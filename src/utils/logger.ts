import config from "../../config";


export function log(...args: any[]) {
    if (config.logging) {
        console.log("[HASTE]", ...args);
    }
}

