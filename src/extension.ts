import * as vscode from 'vscode';


function convertCase(text: string, style: 'camel' | 'snake' | 'screamingSnake' | 'kebab'): string {
    const words = text
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean);

    switch (style) {
        case 'camel':
            return words
                .map((word, index) =>
                    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join('');
        case 'snake':
            return words.map(word => word.toLowerCase()).join('_');
        case 'screamingSnake':
            return words.map(word => word.toUpperCase()).join('_');
        case 'kebab':
            return words.map(word => word.toLowerCase()).join('-');
        default:
            return text;
    }
}


function transformEditorSelection(style: 'camel' | 'snake' | 'screamingSnake' | 'kebab') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const selections = editor.selections;

    editor.edit(editBuilder => {
        for (const selection of selections) {
            const text = editor.document.getText(selection);
            const transformedText = convertCase(text, style);
            editBuilder.replace(selection, transformedText);
        }
    });
}


export function activate(context: vscode.ExtensionContext) {
    const commands = [
        { command: 'caseConverter.toCamelCase', style: 'camel' },
        { command: 'caseConverter.toSnakeCase', style: 'snake' },
        { command: 'caseConverter.toScreamingSnakeCase', style: 'screamingSnake' },
        { command: 'caseConverter.toKebabCase', style: 'kebab' },
    ];

    for (const { command, style } of commands) {
        const disposable = vscode.commands.registerCommand(command, () => transformEditorSelection(style as any));
        context.subscriptions.push(disposable);
    }

    vscode.window.showInformationMessage('Case Converter Plugin Activated!');
}

export function deactivate() {}
