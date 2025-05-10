import { exit } from "process";

export function todo(msg = ''): never {
    console.log("TODO...")
    
    if (msg) {
        console.log(msg)
    }
    
    console.trace()
    exit(1)
}

export function unreachable(): never {
    console.log("UNREACHABLE...")
    console.trace()
    exit(1)
}

export function bug(msg: string): never {
    console.log("BUG!!!", msg)
    console.trace()
    exit(1)
}

export function showError(msg: string, file: string, row: number, col: number): never {
    console.log("Error:")
    console.log(msg)
    console.log(`\nat:\n${file}:${row + 1}:${col + 1}`)
    exit(1)
}