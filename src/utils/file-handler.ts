import { mkdir } from "node:fs/promises";
import generateName from "./utils";

export class FileHandler {
    private directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    public async saveFile(content: string): Promise<string> {
        await this.ensureDirectoryExists();
        let name = generateName();
        while (await this.fileExists(name)) {
            name = generateName();
        }
        await this.writeFile(name, content);
        return name;
    }

    public async ensureDirectoryExists(): Promise<void> {
        const dir = Bun.file(this.directory);
        const exists = await dir.exists();
        if (!exists) {
            await mkdir(this.directory, { recursive: true });
        }
    }

    public async fileExists(name: string): Promise<boolean> {
        const file = Bun.file(`${this.directory}/${name}`);
        return await file.exists();
    }

    public async writeFile(name: string, content: string): Promise<void> {
        await Bun.write(`${this.directory}/${name}`, content);
    }

    public async readFile(name: string): Promise<string | null> {
        const file = Bun.file(`${this.directory}/${name}`);

        const fileExists = await file.exists();
        if (!fileExists) {
            return null;
        }
        return await file.text();
    }
}
