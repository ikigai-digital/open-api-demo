export const logger = {
  info: (message, optionalParams) => {
    if (optionalParams) {
      console.info('\x1b[0m', message, optionalParams)
    } else {
      console.info('\x1b[0m', message)
    }
  },
  success: (message, optionalParams) => {
    if (optionalParams) {
      console.info('\x1b[32m%s\x1b[0m', message, optionalParams)
    } else {
      console.info('\x1b[32m%s\x1b[0m', message)
    }
  },
  warn: (message, optionalParams) => {
    if (optionalParams) {
      console.info('\x1b[33m%s\x1b[0m', message, optionalParams)
    } else {
      console.info('\x1b[33m%s\x1b[0m', message)
    }
  },
  error: (message, optionalParams) => {
    if (optionalParams) {
      console.error('\x1b[31m%s\x1b[0m', message, optionalParams)
    } else {
      console.error('\x1b[31m%s\x1b[0m', message)
    }
  },
}
