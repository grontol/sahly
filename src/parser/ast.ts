import { Token } from "@/tokenizer/token"

export enum AstKind {
    Root,
    Declare,
    Assign,
    PlaceUi,
    Property,
    Loop,
    Block,
    
    ObjCall,
    Identifier,
    LitNumber,
    LitString,
    Binop,
}

export type AstRoot = {
    kind: AstKind.Root
    stmts: AstStmt[]
}

export type AstDeclare = {
    kind: AstKind.Declare
    variable: Token
    value: AstExpr | null
}

export type AstAssign = {
    kind: AstKind.Assign
    variable: Token
    value: AstExpr
}

export type AstPlaceUi = {
    kind: AstKind.PlaceUi
    ui: AstExpr
}

export type AstProperty = {
    kind: AstKind.Property
    name: Token
    value: AstExpr
}

export type AstLoop = {
    kind: AstKind.Loop
    count: AstExpr
    index: Token | null
    body: AstBlock
}

export type AstStmt
= AstDeclare
| AstAssign
| AstPlaceUi
| AstProperty
| AstLoop

export type AstObjCall = {
    kind: AstKind.ObjCall
    name: Token
    properties: AstProperty[]
}

export type AstBlock = {
    kind: AstKind.Block
    stmts: AstStmt[]
}

export type AstIdentifier = {
    kind: AstKind.Identifier
    name: Token
}

export type AstLitNumber = {
    kind: AstKind.LitNumber
    value: number
}

export type AstLitString = {
    kind: AstKind.LitString
    value: string
}

export type AstBinop = {
    kind: AstKind.Binop
    op: Token
    lhs: AstExpr
    rhs: AstExpr
}

export type AstExpr
= AstObjCall
| AstBlock
| AstIdentifier
| AstLitNumber
| AstLitString
| AstBinop