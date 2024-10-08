import process from 'node:process'
import mm from 'micromatch'
import { defu } from '@weapp-core/shared'
import path from 'pathe'
import klaw from 'klaw'
import { defaultExcluded, getWxmlEntry, searchAppEntry } from './utils'
import type { Entry, WeappViteConfig } from './types'

export function createFilter(include: string[], exclude: string[], options?: mm.Options) {
  const opts = defu<mm.Options, mm.Options[]>(options, {
    ignore: exclude,
    // debug: true,
    // dot: true,
    // contains: true,
  })
  // function getPath(id: string) {
  //   if (typeof opts.cwd === 'string') {
  //     return path.relative(opts.cwd, id)
  //   }
  //   return id
  // }

  return function (id: unknown | string) {
    if (typeof id !== 'string') {
      return false
    }
    if (/\0/.test(id)) {
      return false
    }
    // const x = getPath(id)

    return mm.isMatch(id as string, include, opts)
  }
}

export async function getEntries(options: { root?: string, srcRoot?: string, outDir?: string, relative?: boolean, subPackage?: WeappViteConfig['subPackage'] }) {
  // build.outDir
  const { root = process.cwd(), outDir = 'dist', relative, srcRoot = '', subPackage } = options

  function formatPath(to: string) {
    if (relative) {
      return path.relative(root, to)
    }
    return path.normalize(to)
  }

  // 单独打包分包的场景
  if (subPackage) {
    const subPackageRoot = subPackage.root ?? ''
    const filter = createFilter(
      [path.join(root, srcRoot, subPackageRoot, '**/*')],
      [
        ...defaultExcluded,
      ],
      { cwd: root },
    )

    const pageEntries: Entry[] = []
    const componentEntries: Entry[] = []
    const subPackageEntries: Entry[] = []

    if (subPackage.entry) {
      subPackageEntries.push({
        deps: [],
        path: path.join(root, subPackageRoot, subPackage.entry),
        type: 'subPackageEntry',
      })
    }

    for await (
      const file of klaw(
        path.join(root, subPackageRoot),
        {
          filter,
        },
      )
    ) {
      if (file.stats.isFile()) {
        if (/\.wxml$/.test(file.path)) {
          const entry = getWxmlEntry(file.path, formatPath)
          if (entry) {
            //  && !walkPathsSet.has(file.path)
            // 防止重复，理论上不会
            // walkPathsSet.add(file.path)
            if (entry.type === 'component') {
              componentEntries.push(entry)
            }
            else if (entry.type === 'page') {
              pageEntries.push(entry)
            }
          }
        }
      }
    }
    return {
      pages: pageEntries,
      components: componentEntries,
      subPackageEntries,
    }
  }
  // 打包主包的场景
  else {
    const appEntry = searchAppEntry({
      root: path.join(root, srcRoot),
      formatPath,
    })

    // TODO exclude 需要和 output 配套
    // const walkPathsSet = new Set<string>()
    if (appEntry) {
      const subPackageDeps = appEntry.deps.filter(x => x.type === 'subPackage')
      const filter = createFilter(
        [path.join(root, srcRoot, '**/*')],
        [
          ...defaultExcluded,
          path.join(root, `${outDir}/**`),
          ...subPackageDeps.map((x) => {
            return path.join(root, `${x.root}/**`)
          }),
        ],
        { cwd: root },
      )

      const pageEntries: Entry[] = []
      const componentEntries: Entry[] = []

      for await (
        const file of klaw(
          path.join(root, srcRoot),
          {
            filter,
          },
        )
      ) {
        if (file.stats.isFile()) {
          if (/\.wxml$/.test(file.path)) {
            const entry = getWxmlEntry(file.path, formatPath)
            if (entry) {
              //  && !walkPathsSet.has(file.path)
              // 防止重复，理论上不会
              // walkPathsSet.add(file.path)
              if (entry.type === 'component') {
                componentEntries.push(entry)
              }
              else if (entry.type === 'page') {
                pageEntries.push(entry)
              }
            }
          }
        }
      }

      return {
        app: appEntry,
        pages: pageEntries,
        components: componentEntries,
        subPackages: subPackageDeps,
        // walkPathsSet,
      }
    }
  }
}
