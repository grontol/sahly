import { AstBind, AstBlock, AstExpr, AstKind, AstLitNumber, AstLitString, AstPlaceUi, AstProperty, AstRoot, AstStmt } from "@/parser/ast";
import { TokenKind, Tokens } from "@/tokenizer/token";
import { todo } from "@/utils";

export function parse(tokens: Tokens): AstRoot {
    const stmts: AstStmt[] = []
    
    while (tokens.hasNext()) {
        stmts.push(parseStmt(tokens))
    }
    
    return {
        kind: AstKind.Root,
        stmts,
    }
}

function parseStmt(tokens: Tokens): AstStmt {
    const kind = tokens.peek().kind
        
    switch (kind) {
        case TokenKind.KeywordPlaceUi: {
            return parsePasang(tokens)
        }
        default: {
            todo(`parseStmt : ${TokenKind[kind]}`)
        }
    }
}

function parsePasang(tokens: Tokens): AstPlaceUi {
    // Pastikan dimulai dengan keyword `pasang`
    tokens.nextExpect(TokenKind.KeywordPlaceUi)
    const ui = tokens.nextExpect(TokenKind.Identifier)
    // Habis ui harus kurung kurawa buka
    tokens.nextExpect(TokenKind.OpenCurlyBracket)
    
    const properties: AstProperty[] = []
    // Looping terus, parse property sampai kurung kurawa tutup
    while (tokens.peek().kind !== TokenKind.CloseCurlyBracket) {
        properties.push(parseProperty(tokens))
    }
    
    // Harus ditutup kurung kurawa tutup
    tokens.nextExpect(TokenKind.CloseCurlyBracket)
    
    return {
        kind: AstKind.PlaceUi,
        ui,
        properties,
        bind: null
    }
}

function parseProperty(tokens: Tokens): AstProperty {
    const name = tokens.nextExpect(TokenKind.Identifier, TokenKind.KeywordBind)
    const isBind = name.kind === TokenKind.KeywordBind
    const value = isBind ? parseBind(tokens) : parseExpr(tokens)
    
    return {
        kind: AstKind.Property,
        name,
        value,
        isBind,
    }
}

function parseExpr(tokens: Tokens): AstExpr {
    const kind = tokens.peek().kind
    
    switch (kind) {
        case TokenKind.LitNumber: {
            return parseLitNumber(tokens)
        }
        case TokenKind.LitString: {
            return parseLitString(tokens)
        }
        case TokenKind.OpenCurlyBracket: {
            return parseBlock(tokens)
        }
        default: {
            todo(`Parse expr : ${TokenKind[kind]}`)
        }
    }
}

function parseBlock(tokens: Tokens): AstBlock {
    tokens.nextExpect(TokenKind.OpenCurlyBracket)
    
    const stmts: AstStmt[] = []
    while (tokens.peek().kind !== TokenKind.CloseCurlyBracket) {
        stmts.push(parseStmt(tokens))
    }
    
    tokens.nextExpect(TokenKind.CloseCurlyBracket)
    
    return {
        kind: AstKind.Block,
        stmts,
    }
}

function parseLitNumber(tokens: Tokens): AstLitNumber {
    const text = tokens.nextExpect(TokenKind.LitNumber)
    
    return {
        kind: AstKind.LitNumber,
        value: +text.value
    }
}

function parseLitString(tokens: Tokens): AstLitString {
    const text = tokens.nextExpect(TokenKind.LitString)
    
    return {
        kind: AstKind.LitString,
        value: text.value.slice(1, text.value.length - 1)
    }
}

function parseBind(tokens: Tokens): AstBind {
    const text = tokens.nextExpect(TokenKind.Identifier)
    
    return {
        kind: AstKind.Bind,
        name: text.value,
    }
}