
export class FileHandler {
    private directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    public async writeFile(name: string, content: string): Promise<void> {
        await Bun.write(`${this.directory}/${name}`, content);
    }

    public async readFile(name: string): Promise<string | null> {
        const file = Bun.file(`${this.directory}/${name}`);
        if (!file.exists()) {
            return null;
        }
        return await file.text();
    }
}
