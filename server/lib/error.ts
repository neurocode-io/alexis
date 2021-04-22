type ErrorInput = {
  name: string
  msg: string
  code: number
  retryable: boolean
}

class APIerror extends Error {
  private code: number
  private retryable: boolean

  constructor(error: ErrorInput) {
    super(error.msg)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIerror)
    }

    this.name = error.name
    this.code = error.code
    this.retryable = error.retryable
  }

  public serialize() {
    return JSON.stringify({ error: { name: this.name, msg: this.message, code: this.code, retryable: this.retryable } })
  }
}

const createError = (opts: ErrorInput) => {
  throw new APIerror(opts)
}

export { APIerror, createError }
