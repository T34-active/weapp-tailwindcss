import { createTemplateClassRegexp, createTempleteHandlerMatchRegexp } from '@/reg'
import { matchAll } from './util'
describe('regexp-maker', () => {
  it('TempleteHandlerMatchRegexp single attr', () => {
    const reg = createTempleteHandlerMatchRegexp('l-o-v-e-r', 'i-love-you')
    const match0 = matchAll(reg, '<l-o-v-e-r i-love-you="">l-o-v-e-r</l-o-v-e-r>')
    expect(match0.length).toBeTruthy()
    const match1 = matchAll(reg, '<l-o-v-e-r i-hate-you="">l-o-v-e-r</l-o-v-e-r>')
    expect(match1.length).toBeFalsy()
  })
  it('TempleteHandlerMatchRegexp multiple attrs', () => {
    const reg = createTempleteHandlerMatchRegexp('l-o-v-e-r', ['i', 'love', 'you'])
    const match0 = matchAll(reg, '<l-o-v-e-r i="" love="" you="">l-o-v-e-r</l-o-v-e-r>')
    expect(match0.length).toBeTruthy()
    const match1 = matchAll(reg, '<l-o-v-e-r ii="" llove="" yyou="">l-o-v-e-r</l-o-v-e-r>')
    expect(match1.length).toBeFalsy()
  })

  it('TempleteHandlerMatchRegexp multiple attrs with false exact option', () => {
    // exact
    const reg = createTempleteHandlerMatchRegexp('l-o-v-e-r', ['i', 'love', 'you'], {
      exact: false
    })
    const match0 = matchAll(reg, '<l-o-v-e-r i="" love="" you="">l-o-v-e-r</l-o-v-e-r>')
    expect(match0.length).toBeTruthy()
    const match1 = matchAll(reg, '<l-o-v-e-r ii="" llove="" yyou="">l-o-v-e-r</l-o-v-e-r>')
    expect(match1.length).toBeTruthy()
  })

  it('TemplateClassRegexp single option', () => {
    const reg = createTemplateClassRegexp('shit')
    expect(matchAll(reg, 'shit="happens"').length).toBeTruthy()
    expect(matchAll(reg, ' shit=" happens " aaa ').length).toBeTruthy()
    expect(matchAll(reg, ' a b c shit="happens" ').length).toBeTruthy()

    expect(matchAll(reg, ' a b c sssshit="happens" ').length).toBeFalsy()
    expect(matchAll(reg, ' a b c shitttttt="happens" ').length).toBeFalsy()
  })

  it('TemplateClassRegexp single option with false exact option', () => {
    const reg = createTemplateClassRegexp('shit', { exact: false })
    expect(matchAll(reg, 'shit="happens"').length).toBeTruthy()
    expect(matchAll(reg, ' shit=" happens " aaa ').length).toBeTruthy()
    expect(matchAll(reg, ' a b c shit="happens" ').length).toBeTruthy()

    expect(matchAll(reg, ' a b c sssshit="happens" ').length).toBeTruthy()
    expect(matchAll(reg, ' a b c shitttttt="happens" ').length).toBeFalsy()
  })

  // it('TemplateClassRegexp multiple option', () => {
  //   const reg = createTemplateClassRegexp(['shit', 'fucker', 'hater'])
  //   expect(reg.test(' a b c shit="happens" fucker="you are" hater="they are"')).toBe(true)

  //   expect(reg.test(' a b c sssshit="happens" fucker="you are"')).toBe(true)

  //   expect(reg.test(' a b c shitttttt="happens" hater="they are"')).toBe(true)
  // })
})