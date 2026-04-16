declare const __APP_NAME__: string
declare const __APP_VERSION__: string
declare const __APP_BUILD__: string
declare const __APP_AUTHOR__: string
declare const __APP_LICENSE__: string

// CSS module declarations
declare module '*.css' {
  const content: Record<string, string>
  export default content
}

// mjml-browser has no official @types package
declare module 'mjml-browser' {
  interface MjmlError {
    message: string
    line: number
    tagName?: string
  }

  interface MjmlOutput {
    html: string
    errors: MjmlError[]
  }

  interface MjmlOptions {
    beautify?: boolean
    minify?: boolean
    validationLevel?: 'strict' | 'soft' | 'skip'
  }

  function mjml2html(input: string, options?: MjmlOptions): MjmlOutput

  export default mjml2html
}
