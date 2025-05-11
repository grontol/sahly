import { bug, showError, todo } from "@/utils";
import { Token, TokenKind, Tokens } from "./token";

const KEYWORDS: Record<string, TokenKind> = {
    'pasang':  TokenKind.KeywordPlaceUi,
    'sebagai': TokenKind.KeywordBind,
}

export function tokenize(input: string, filePath: string): Tokens {
    const tokens: Token[] = []
    const inputs = new Inputs(input, filePath)
    
    while (inputs.hasNext()) {
        const ch = inputs.peek()
        
        if (isNumeric(ch)) {
            tokens.push(tokenizeNumber(inputs))
        }
        else if (isAlphabet(ch)) {
            tokens.push(tokenizeKeywordOrIdentifier(inputs))
        }
        else if (ch === ' ') {
            inputs.next()
        }
        else if (ch === '/') {
            // NOTE: di-next-in dulu, soalnya mau peek lagi
            inputs.next()
            
            // Check kalau single line comment
            if (inputs.peek() === '/') {
                // Loop terus sampai ketemu new line
                while (inputs.peek() !== '\n') {
                    inputs.next()
                }
                
                // New line-nya belum di-next di dalam loop-nya
                inputs.next()
            }
            // Kalau gak berarti operator pembagian
            else {
                tokens.push({
                    kind: TokenKind.OpDiv,
                    value: '/',
                    file: inputs.file,
                    row: inputs.row,
                    col: inputs.col,
                    // Karena udah di-next, maka start-nya dikurangin 1
                    start: inputs.curIndex() - 1,
                    end: inputs.curIndex(),
                })
            }
        }
        else if (ch === '\n') {
            inputs.next()
        }
        else if (ch === '"') {
            tokens.push(tokenizeString(inputs))
        }
        else if (ch === '{') {
            tokens.push({
                kind: TokenKind.OpenCurlyBracket,
                value: '{',
                file: inputs.file,
                row: inputs.row,
                col: inputs.col,
                start: inputs.curIndex(),
                end: inputs.curIndex() + 1,
            })
            inputs.next()
        }
        else if (ch === '}') {
            tokens.push({
                kind: TokenKind.CloseCurlyBracket,
                value: '{',
                file: inputs.file,
                row: inputs.row,
                col: inputs.col,
                start: inputs.curIndex(),
                end: inputs.curIndex() + 1,
            })
            inputs.next()
        }
        else {
            showError(`Karakter tidak diketahui: ${ch}`, filePath, inputs.row, inputs.col)
        }
    }
    
    return new Tokens(tokens)
}

function tokenizeNumber(inputs: Inputs): Token {
    todo()
}

function tokenizeKeywordOrIdentifier(inputs: Inputs): Token {
    const startIndex = inputs.curIndex()
    
    // Pertama udah pasti alphabet, soalnya udah dicek di fungsi tokenize
    let text = inputs.next()
    
    while (inputs.hasNext()) {
        if (isAlphanumeric(inputs.peek())) {
            text += inputs.next()
        }
        else {
            break
        }
    }
    
    return {
        kind: KEYWORDS[text] ?? TokenKind.Identifier,
        value: text,
        file: inputs.file,
        row: inputs.row,
        col: inputs.col - text.length,
        start: startIndex,
        end: inputs.curIndex(),
    }
}

function tokenizeString(inputs: Inputs): Token {
    const startIndex = inputs.curIndex()
    
    // Pertama udah pasti petik ("), udah dicek di fungsi tokenize
    let text = inputs.next()
    let closed = false
    
    while(inputs.hasNext()) {
        const ch = inputs.next()
        
        if (ch === '"') {
            text += '"'
            closed = true
            break;
        }
        
        text += ch
    }
    
    if (!closed) {
        showError("String tidak ditutup", inputs.file, inputs.row, inputs.col)
    }
    
    return {
        kind: TokenKind.LitString,
        value: text,
        file: inputs.file,
        row: inputs.row,
        col: inputs.col - text.length,
        start: startIndex,
        end: inputs.curIndex(),
    }
}

function isNumeric(ch: string) {
    return ch >= '0' && ch <= '9'
}

function isAlphabet(ch: string) {
    return ch >= 'A' && ch <= 'Z' || ch >= 'a' && ch <= 'z'
}

function isAlphanumeric(ch: string) {
    return isAlphabet(ch) || isNumeric(ch)
}

class Inputs {
    private input: string
    private index = 0
    
    readonly file: string
    row = 0
    col = 0
    
    constructor(input: string, file: string) {
        this.input = input
        this.file = file
    }
    
    curIndex(): number {
        return this.index
    }
    
    hasNext(): boolean {
        return this.index < this.input.length
    }
    
    peek(): string {
        return this.input.charAt(this.index)
    }
    
    next(): string {
        if (this.index >= this.input.length) {
            bug("Inputs next tapi udah mentok")
        }
        
        const ch = this.input.charAt(this.index)
        this.index++
        
        if (ch === '\n') {
            this.row += 1
            this.col = 0
        }
        else {
            this.col += 1
        }
        
        return ch
    }
    
    nextOrNull(): string | null {
        if (this.index >= this.input.length) {
            return null
        }
        
        const ch = this.input.charAt(this.index)
        this.index++
        
        if (ch === '\n') {
            this.row += 1
            this.col = 0
        }
        else {
            this.col += 1
        }
        
        return ch
    }
}