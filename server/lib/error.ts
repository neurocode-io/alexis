type ErrorInput = {
  name: string
  msg: string
  code: number
  retryable: boolean
}

class APIerror extends Error {
  private code: number
  private retryable: boolean
  private newStack: string

  constructor(error: ErrorInput, orgError?: Error) {
    super(error.msg)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIerror)
    }

    this.name = error.name
    this.code = error.code
    this.retryable = error.retryable
    this.newStack = String(this.stack)
    const messageLines = (this.message.match(/\n/g) || []).length + 1

    this.stack = `${this.newStack
      .split('\n')
      .slice(0, messageLines + 1)
      .join('\n')}
        \n${orgError?.stack || ''}`
  }

  public serialize() {
    return JSON.stringify({ error: { name: this.name, msg: this.message, code: this.code, retryable: this.retryable } })
  }

  public getCode() {
    return this.code
  }
}

const createError = (opts: ErrorInput, orgError?: Error) => {
  throw new APIerror(opts, orgError)
}

export { APIerror, createError }
