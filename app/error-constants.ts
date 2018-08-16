enum ErrorCodes {
  NOT_SUPPORTED,
  LOADING_FAILED,
}

interface iErrorMessages {
  [key: string]: string
}

const ErrorMessages: iErrorMessages = {
  [ErrorCodes.NOT_SUPPORTED]: 'Your browser does not support WebAudio API.',
  [ErrorCodes.LOADING_FAILED]: 'Error loading the source for <audio> element',
};

interface iError {
  code: ErrorCodes,
  debug: any
}

export { ErrorCodes, ErrorMessages, iError };
