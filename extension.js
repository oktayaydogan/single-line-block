const vscode = require('vscode');

function wrapText(text, maxLineLength) {
    const lines = [];
    let currentLine = '';

    for (const word of text.split(' ')) {
        if (!currentLine) {
            currentLine = word;
        } else if (currentLine.length + word.length + 1 <= maxLineLength) {
            currentLine += ` ${word}`;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function expandText(text, maxLineLength) {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    if (!normalizedText) return '';

    return normalizedText
        .split(/(?<=[.!?])\s+/u)
        .flatMap(sentence => wrapText(sentence, maxLineLength))
        .join('\n');
}

function activate(context) {
    const collapseDisposable = vscode.commands.registerCommand('single-line-block.collapse', async () => {
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

    const expandDisposable = vscode.commands.registerCommand('single-line-block.expand', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage('Please select a line of text first.');
            return;
        }

        const maxLineLength = vscode.workspace
            .getConfiguration('singleLineBlock.expand')
            .get('maxLineLength', 40);
        const expanded = expandText(editor.document.getText(selection), maxLineLength);

        await editor.edit(editBuilder => {
            editBuilder.replace(selection, expanded);
        });
    });

    context.subscriptions.push(collapseDisposable, expandDisposable);
}

function deactivate() {}

module.exports = { activate, deactivate, expandText };
