export abstract class DataStorage {

    public defaultTimeout: number | null

    constructor(timeout: number | null) {
        this.defaultTimeout = timeout
    }

    abstract save(content: string): Promise<string>
    abstract read(name: string): Promise<string | null>
    abstract checkAndDeleteExpiredEntries(): Promise<void>
}