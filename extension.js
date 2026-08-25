const vscode = require('vscode');

function activate(context) {
    const disposable = vscode.commands.registerCommand('single-line-block.collapse', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage('Please select a block of text first.');
            return;
        }

        const selectedText = editor.document.getText(selection);

        // Replace all line breaks (and surrounding whitespace) with a single space,
        // then trim leading/trailing whitespace from the result.
        const collapsed = selectedText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' ');

        await editor.edit(editBuilder => {
            editBuilder.replace(selection, collapsed);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
