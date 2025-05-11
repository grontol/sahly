import {
    AstAssign,
    AstBinop,
    AstBlock, AstDeclare, AstExpr, AstIdentifier, AstKind, AstLitNumber, AstLitString, AstLoop, AstObjCall, AstPlaceUi,
    AstProperty, AstRoot, AstStmt,
} from "@/parser/ast";
import { Token, TokenKind, Tokens } from "@/tokenizer/token";
import { showError, todo } from "@/utils";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
const BINOP_PRECEDENCES: Record<string, number> = {
    '+': 11,
    '-': 11,
    '*': 12,
    '/': 12,
    '%': 12,
}

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
    const peek = tokens.peek()
        
    switch (peek.kind) {
        case TokenKind.Identifier: {
            if (tokens.peek(2).kind === TokenKind.KeywordAs) {
                return parseAssign(tokens)
            }
            else {
                showError(
                    'Identifier gak bener',
                    peek.file,
                    peek.row,
                    peek.col,
                )
            }
        }
        case TokenKind.KeywordDeclare: {
            return parseDeclare(tokens)
        }
        case TokenKind.KeywordPlaceUi: {
            return parsePlaceUi(tokens)
        }
        case TokenKind.KeywordLoop: {
            return parseLoop(tokens)
        }
        default: {
            todo(`parseStmt : ${TokenKind[peek.kind]}`)
        }
    }
}

function parseDeclare(tokens: Tokens): AstDeclare {
    tokens.nextExpect(TokenKind.KeywordDeclare)
    const variable = tokens.nextExpect(TokenKind.Identifier)
    let value: AstExpr | null = null
    
    if (tokens.peek().kind === TokenKind.KeywordAs) {
        tokens.next()
        value = parseExpr(tokens)
    }
    
    return {
        kind: AstKind.Declare,
        variable,
        value,
    }
}

function parseAssign(tokens: Tokens): AstAssign {
    const variable = tokens.nextExpect(TokenKind.Identifier)
    tokens.nextExpect(TokenKind.KeywordAs)
    const value = parseExpr(tokens)
    
    return {
        kind: AstKind.Assign,
        variable,
        value,
    }
}

function parsePlaceUi(tokens: Tokens): AstPlaceUi {
    tokens.nextExpect(TokenKind.KeywordPlaceUi)
    const ui = parseExpr(tokens)
    
    return {
        kind: AstKind.PlaceUi,
        ui,
    }
}

function parseLoop(tokens: Tokens): AstLoop {
    tokens.nextExpect(TokenKind.KeywordLoop)
    const count = parseExpr(tokens)
    let index: Token | null = null
    
    if (tokens.peek().kind === TokenKind.KeywordIndex) {
        tokens.next()
        index = tokens.nextExpect(TokenKind.Identifier)
    }
    
    const body = parseBlock(tokens)
    
    return {
        kind: AstKind.Loop,
        count,
        index,
        body,
    }
}

function parseProperty(tokens: Tokens): AstProperty {
    const name = tokens.nextExpect(TokenKind.Identifier)
    const value = parseExpr(tokens)
    
    return {
        kind: AstKind.Property,
        name,
        value,
    }
}

function parseExpr(tokens: Tokens): AstExpr {
    const exprs = [parsePrimaryExpr(tokens)]
    const ops: Token[] = []
    
    while (tokens.peek().value in BINOP_PRECEDENCES) {
        ops.push(tokens.next())
        exprs.push(parsePrimaryExpr(tokens))
    }
    
    while (exprs.length > 1) {
        let index = 0
        
        for (let i = 0; i < ops.length - 1; i++) {
            const lPrec = BINOP_PRECEDENCES[ops[i].value]
            const rPrec = BINOP_PRECEDENCES[ops[i + 1].value]
            
            if (lPrec >= rPrec) {
                index = i
                break
            }
            else {
                index = i + 1
            }
        }
        
        const lhs = exprs.splice(index, 1)[0]
        const rhs = exprs.splice(index, 1)[0]
        const op = ops.splice(index, 1)[0]
        
        const binExpr: AstBinop = {
            kind: AstKind.Binop,
            op,
            lhs,
            rhs,
        }
        
        exprs.splice(index, 0, binExpr)
    }
    
    return exprs[0]
}

function parsePrimaryExpr(tokens: Tokens): AstExpr {
    const kind = tokens.peek().kind
    
    switch (kind) {
        case TokenKind.Identifier: {
            if (tokens.peek(2).kind === TokenKind.OpenCurlyBracket) {
                return parseObjCall(tokens)
            }
            else {
                return parseIdentifier(tokens)
            }
        }
        case TokenKind.LitNumber: {
            return parseLitNumber(tokens)
        }
        case TokenKind.LitString: {
            return parseLitString(tokens)
        }
        case TokenKind.OpenCurlyBracket: {
            return parseBlock(tokens)
        }
        case TokenKind.OpenBracket: {
            tokens.next()
            const expr = parseExpr(tokens)
            tokens.nextExpect(TokenKind.CloseBracket)
            return expr
        }
        default: {
            todo(`Parse expr : ${TokenKind[kind]}`)
        }
    }
}

function parseObjCall(tokens: Tokens): AstObjCall {
    const name = tokens.nextExpect(TokenKind.Identifier)
    const properties: AstProperty[] = []
    
    tokens.nextExpect(TokenKind.OpenCurlyBracket)
    
    while (tokens.peek().kind !== TokenKind.CloseCurlyBracket) {
        properties.push(parseProperty(tokens))
    }
    
    tokens.nextExpect(TokenKind.CloseCurlyBracket)
    
    return {
        kind: AstKind.ObjCall,
        name,
        properties,
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

function parseIdentifier(tokens: Tokens): AstIdentifier {
    return {
        kind: AstKind.Identifier,
        name: tokens.nextExpect(TokenKind.Identifier),
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