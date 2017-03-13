'use babel'

let clangUtils = null

export function activate (state) {
  const ClangUtils = require('./clang_utils')
  clangUtils = new ClangUtils()
  clangUtils.activate(state)
}

export function deactivate () {
  if (clangUtils) {
    clangUtils.deactivate()
    clangUtils.destroy()
    clangUtils = null
  }
}
