import { mkdir } from "node:fs/promises";
import { log } from "./logger";

/**
 * This class manages the deletion of expired files in the file storage system. 
 * It keeps track of when each file should expire and deletes them when necessary.
 */
export class DeletionManager {

    private defaultTimeout: number
    private dataFolder: string
    private ready: Promise<void>

    constructor(dataFolder: string, timeout: number) {
        this.defaultTimeout = timeout
        this.dataFolder = dataFolder
        this.ready = this.checkStorageFile();
    }

    private async checkStorageFile(): Promise<void> {
        await mkdir(this.dataFolder, { recursive: true });
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        if (!await storageFile.exists()) {
            await storageFile.write(JSON.stringify({}))
        }
    }

    public async addToDeletion(id: string) {
        await this.ready;
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        const data = await this.readStorageData(storageFile)
        
        data[id] = Date.now() + this.defaultTimeout
        await storageFile.write(JSON.stringify(data))
    }

    public async removeOldEntries() {
        await this.ready;
        const storageFile = Bun.file(`${this.dataFolder}/storage.json`)
        const data = await this.readStorageData(storageFile)
        const now = Date.now()
        let changed = false
        for (const id in data) {
            if (data[id] < now) {
                delete data[id]
                changed = true
                Bun.file(`${this.dataFolder}/${id}`).delete().catch(() => {
                    log("Failed to delete file with id:", id);
                });
                log("Deleted expired entry with id:", id);
            }
        }
        if (changed) {
            await storageFile.write(JSON.stringify(data))
        }
    }

    private async readStorageData(storageFile: Bun.BunFile): Promise<Record<string, number>> {
        if (!await storageFile.exists()) {
            return {}
        }

        const raw = await storageFile.text()
        if (!raw.trim()) {
            return {}
        }

        try {
            return JSON.parse(raw) as Record<string, number>
        } catch {
            log("Invalid storage.json contents, resetting deletion metadata")
            return {}
        }
    }
}