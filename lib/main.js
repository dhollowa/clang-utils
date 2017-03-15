'use babel'

let clangUtils = null

export function activate () {
  const ClangUtils = require('./clang_utils')
  clangUtils = new ClangUtils()
  clangUtils.activate()
}

export function deactivate () {
  if (clangUtils) {
    clangUtils.deactivate()
    clangUtils.destroy()
    clangUtils = null
  }
}
