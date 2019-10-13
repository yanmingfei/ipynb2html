import anser from 'anser'
import hljs from 'highlightjs'
import * as katex from 'katex'
import { KatexOptions } from 'katex'
import { MarkedOptions } from 'marked'
import { Document, HTMLElement } from 'nodom'

import buildElementCreator from './elementCreator'
import htmlRenderer from './htmlRenderer'
import buildMarkdownRenderer from './markdownRenderer'
import buildRenderer, { Options as RendererOpts, NbRenderer } from './renderer'


export { default as version } from './version'

export { NbRenderer }

export type Options = RendererOpts<HTMLElement> & {
  classPrefix?: string,
  katexOpts?: KatexOptions,
  markedOpts?: MarkedOptions,
}

const defaultKatexOpts: KatexOptions = {
  displayMode: true,
  throwOnError: false,
}

function ansiCodesRenderer (input: string): string {
  return anser.ansiToHtml(anser.escapeForHtml(input))
}

function codeHighlighter (code: string, lang: string): string {
  return hljs.getLanguage(lang)
    ? hljs.highlight(lang, code).value
    : code
}

export default (opts: Options = {}): NbRenderer<HTMLElement> => {
  const katexOpts = { ...defaultKatexOpts, ...opts.katexOpts }

  const doc = new Document()
  const elementCreator = buildElementCreator(doc.createElement.bind(doc), opts.classPrefix)
  const markdownRenderer = buildMarkdownRenderer(opts.markedOpts, katexOpts)
  const mathRenderer = (tex: string) => katex.renderToString(tex, katexOpts)

  const dataRenderers = {
    'text/html': htmlRenderer({ elementCreator, mathRenderer }),
    ...opts.dataRenderers,
  }

  return buildRenderer(elementCreator, {
    ansiCodesRenderer,
    codeHighlighter,
    dataRenderers,
    markdownRenderer,
    ...opts,
  })
}
