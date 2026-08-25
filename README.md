# Single Line Block

Format a selected text block into one line or multiple logical lines in Visual Studio Code.

## Usage

1. Select the text to collapse.
2. Run **Collapse to Single Line** from the editor context menu or the Command Palette.

Keyboard shortcut:

- macOS: `Cmd+Shift+J`
- Windows and Linux: `Ctrl+Shift+J`

For example, this selection:

```text
  first line

  second line
```

becomes:

```text
first line second line
```

### Expand to Multiple Lines

Select a line of text and run **Expand to Multiple Lines** from the editor context menu or the Command Palette.

The command starts a new line after sentence-ending punctuation (`.`, `!`, and `?`). Within long sentences it prefers natural pauses such as commas, semicolons, and colons, then falls back to word boundaries without splitting words. The default maximum line length is 40 characters and can be changed with the `singleLineBlock.expand.maxLineLength` setting.

Keyboard shortcut:

- macOS: `Cmd+Shift+Option+J`
- Windows and Linux: `Ctrl+Shift+Alt+J`

For example:

```text
First sentence. Second sentence! This sentence is still part of the same paragraph.
```

becomes:

```text
First sentence.
Second sentence!
This sentence is still part of the same paragraph.
```

## License

This project is licensed under the [MIT License](LICENSE).
