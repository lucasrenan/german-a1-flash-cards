import { describe, expect, it } from 'vitest'
import { blurAfterPointerClick } from './focus'

function button() {
  const el = document.createElement('button')
  document.body.appendChild(el)
  el.focus()
  return el
}

describe('blurAfterPointerClick', () => {
  it('drops focus after a mouse click so shortcuts go back to the page', () => {
    const el = button()
    blurAfterPointerClick({ detail: 1, currentTarget: el })
    expect(document.activeElement).not.toBe(el)
  })

  it('keeps focus when the click came from the keyboard', () => {
    const el = button()
    blurAfterPointerClick({ detail: 0, currentTarget: el })
    expect(document.activeElement).toBe(el)
  })

  it('ignores a missing target', () => {
    expect(() => blurAfterPointerClick({ detail: 1, currentTarget: null })).not.toThrow()
  })
})
