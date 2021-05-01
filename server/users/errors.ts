export const errors = {
  validationError: {
    name: 'ValidationError',
    code: 400,
    msg: 'Invalid input',
    retryable: false
  },
  emailConflictError: {
    name: 'EmailConflictError',
    code: 409,
    msg: 'Email already exists',
    retryable: false
  },
  pdfIndexing: {
    name: 'PDFError',
    code: 500,
    msg: 'Could not index pdf',
    retryable: true
  }
}
