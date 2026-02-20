export type RenderOptions = {
    content?: string
    disableInput?: boolean
}

export class HtmlRenderer {

    private theme: string
    private siteName: string

    constructor(theme = 'atom-one-dark', siteName = 'Elysia Haste') {
        this.theme = theme
        this.siteName = siteName
    }

    private escapeHTML(str?: string): string {
        if (!str) return "";
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    public renderEditorPage(options: RenderOptions) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.siteName}</title>
    <link rel="stylesheet" href="/public/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${this.theme}.min.css">
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    />
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
    <script type="text/javascript" src="/public/keybind.min.js"></script>
    <script src="/public/script.js" defer></script>
</head>
<body>
    <div class="toolbar">
        <h1>${this.siteName}</h1>
        <div class="buttons">
            <button id="saveBtn" data-tooltip="Save the text"><i class="bi bi-floppy2"></i></button>
            <button id="newBtn" data-tooltip="Create a new file"><i class="bi bi-file-earmark"></i></button>
            <button id="copyBtn" data-tooltip="Copy the text to clipboard"><i class="bi bi-clipboard"></i></button>
        </div>

    </div>
    <main class="editor">   
        <pre><code></code></pre>
        <textarea class="input" id="input" spellcheck="false" ${options.disableInput ? 'readonly' : ''}>${this.escapeHTML(options.content)}</textarea>
    </main>
</body>
</html>`

    }
}