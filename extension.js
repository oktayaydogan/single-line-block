const vscode = require('vscode');

function wrapText(text, maxLineLength) {
    const words = text.split(' ');
    const lines = [];
    let start = 0;

    while (start < words.length) {
        let end = start;
        let lineLength = 0;
        let naturalBreak = -1;

        while (end < words.length) {
            const nextLength = lineLength + words[end].length + (end > start ? 1 : 0);
            if (lineLength && nextLength > maxLineLength) break;

            lineLength = nextLength;
            if (/[,:;]$/.test(words[end])) {
                naturalBreak = end + 1;
            }
            end += 1;
        }

        if (end === words.length) {
            lines.push(words.slice(start, end).join(' '));
            break;
        }

        const breakAt = naturalBreak > start && lineLength >= maxLineLength * 0.65
            ? naturalBreak
            : end > start ? end : start + 1;
        lines.push(words.slice(start, breakAt).join(' '));
        start = breakAt;
    }

    if (lines.length > 1 && lines.at(-1).length < maxLineLength * 0.35) {
        const lastLine = lines.pop();
        let previousLine = lines.pop();
        const wordsToMove = lastLine.split(' ');

        while (wordsToMove.length > 0) {
            const candidate = `${previousLine} ${wordsToMove[0]}`;
            if (candidate.length > maxLineLength) break;
            previousLine = candidate;
            wordsToMove.shift();
        }

        lines.push(previousLine, wordsToMove.join(' '));
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
