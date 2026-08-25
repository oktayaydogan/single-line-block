# Single Line Block

Collapse a selected multi-line block into one line in Visual Studio Code.

The extension trims each selected line, removes blank lines, and joins the remaining lines with a single space.

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

## License

This project is licensed under the [MIT License](LICENSE).
