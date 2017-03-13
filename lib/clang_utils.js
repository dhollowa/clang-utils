'use babel'

import {CompositeDisposable} from 'atom'
import {Range} from 'atom'
import {spawn} from 'child_process'
import EditScope from './edit_scope'

export default class ClangUtils {
  constructor () {
    this.subscriptions = null
  }

  activate (state) {
    this.subscriptions = new CompositeDisposable
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clang-utils:format-selection': this.formatSelection
    }))
  }

  deactivate () {
    this.subscriptions.dispose()
  }

  formatSelection () {
    editor = atom.workspace.getActiveTextEditor()
    view = atom.views.getView(editor)
    if (!editor) {
      return
    }

    scope = new EditScope(() => {
      editor.groupChangesSinceCheckpoint()
      view.focus()
    })

    ranges = editor.getSelectedBufferRanges()
    scope.add(ranges.length)
    editor.createCheckpoint()

    properties = { reversed: true, invalidate: 'never' }
    ranges.forEach(range => {
      marker = editor.markBufferRange(range, properties)
      formatRange(marker, editor, scope)
    })
  }
}

function formatRange (marker, editor, scope) {
  stdout = ''
  stderr = ''

  // TODO(dhollowa): Add cursor restoration with the -c option.
  selection = editor.getTextInBufferRange(marker.getBufferRange())
  commandString = `${ atom.config.get('clang-utils.formatExecutable') } ` +
    "-offset 0 " +
    `-length ${ selection.length } ` +
    `-assume-filename ${ editor.getPath() } ` +
    `-style ${ atom.config.get('clang-utils.formatStyle') }`
  child = spawn(process.env.SHELL, ["-l", "-c", commandString])

  child.stdout.on('data', text => {
    stdout += text
  })

  child.stderr.on('data', text => {
    stderr += text
  })

  child.on('close', code => {
    text = stderr || stdout
    editor.setTextInBufferRange(marker.getBufferRange(), text)
    scope.done()
  })

  child.stdin.write(selection)
  child.stdin.end()
}
