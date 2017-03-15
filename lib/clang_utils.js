'use babel'

import {CompositeDisposable} from 'atom'
import {Range} from 'atom'
import {spawnSync} from 'child_process'
import EditScope from './edit_scope'

export default class ClangUtils {
  constructor () {
    this.subscriptions = null
  }

  activate (state) {
    this.subscriptions = new CompositeDisposable
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'clang-utils:format-selection': () => this.formatSelection()
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
      this.formatRange(marker, editor, scope)
    })
  }

  formatRange (marker, editor, scope) {
    selection = editor.getTextInBufferRange(marker.getBufferRange())
    command = `${ atom.config.get('clang-utils.formatExecutable') } ` +
      "-offset 0 " +
      `-length ${ selection.length } ` +
      `-assume-filename ${ editor.getPath() } ` +
      `-style ${ atom.config.get('clang-utils.formatStyle') }`
    output = spawnSync(
      process.env.SHELL,
      ["-l", "-c",command],
      { input:selection, encoding: 'utf8' })

      if (output.stdout) {
        editor.setTextInBufferRange(marker.getBufferRange(), output.stdout)
      }

      if (output.stderr) {
        atom.notifications.addWarning(output.stderr)
      }
    scope.done()
  }
}
