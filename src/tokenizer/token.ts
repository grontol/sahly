import { showError, todo } from "@/utils"

export enum TokenKind {
    KeywordPlaceUi,
    KeywordBind,
    
    Identifier,
    OpenCurlyBracket,
    CloseCurlyBracket,
    OpDiv,
    
    LitNumber,
    LitString,
    
    Eof,
}

export type Token = {
    kind: TokenKind
    value: string
    file: string
    row: number
    col: number
    start: number
    end: number
}

const EOF_TOKEN: Token = {
    kind: TokenKind.Eof,
    value: '',
    file: '',
    row: 0,
    col: 0,
    start: 0,
    end: 0,
}

export class Tokens {
    readonly tokens: Token[]
    private index = 0
    
    constructor(tokens: Token[]) {
        this.tokens = tokens
    }
    
    hasNext(): boolean {
        return this.index < this.tokens.length
    }
    
    peek(): Token {
        if (this.index >= this.tokens.length) return EOF_TOKEN
        return this.tokens[this.index]
    }
    
    next(): Token {
        return this.tokens[this.index++]
    }
    
    nextExpect(kind: TokenKind, ...others: TokenKind[]): Token {
        const next = this.next()
        const kinds = [kind, ...others]
        
        if (!kinds.some(x => x === next.kind)) {
            const kindsText = kinds.map(x => TokenKind[x]).join(" | ")
            const message = `Butuh ${kindsText} tapi malah dapat ${TokenKind[next.kind]}`
            
            showError(message, next.file, next.row, next.col)
        }
        
        return next
    }
}