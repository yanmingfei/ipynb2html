// AnsiUp may be provided in the browser environment as an external dependency
// via global variable. It's an alternative to Anser that doesn't provide
// bundle for browsers.
declare class AnsiUp {
  ansi_to_html (input: string): string
}
