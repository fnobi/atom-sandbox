'use babel';

import AtomSandboxView from './atom-sandbox-view';
import { CompositeDisposable } from 'atom';

export default {

  atomSandboxView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomSandboxView = new AtomSandboxView(state.atomSandboxViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomSandboxView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-sandbox:sudden-death': () => this.suddenDeath()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomSandboxView.destroy();
  },

  serialize() {
    return {
      atomSandboxViewState: this.atomSandboxView.serialize()
    };
  },

  suddenDeath() {
    const editor = atom.workspace.getActiveTextEditor();
    const text = editor.getSelectedText();
    const length = Math.floor(this.charCount(text) / 2) + 1;

    const wrapText = [
      `＿${ new Array(length + 2).join('人') }＿`,
      `＞　${text}　＜`,
      `￣${ new Array(length + 2).join('Ｙ') }￣`
    ].join('\n');

    editor.insertText(wrapText);
  },

  charCount (str) {
    let len = 0;
    str = escape(str);
    for (let i = 0; i < str.length; i++, len++) {
      if (str.charAt(i) == '%') {
        if (str.charAt(++i) == 'u') {
          i += 3;
          len++;
        }
        i++;
      }
    }
    return len;
  }
};
