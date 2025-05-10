import { Token } from "@/tokenizer/token"

export enum AstKind {
    Root,
    PlaceUi,
    Property,
    Bind,
    
    LitNumber,
    LitString,
}

export type AstRoot = {
    kind: AstKind.Root
    stmts: AstStmt[]
}

export type AstPlaceUi = {
    kind: AstKind.PlaceUi
    ui: Token
    bind: string | null
    properties: AstProperty[]
}

export type AstProperty = {
    kind: AstKind.Property
    name: Token
    value: AstExpr
    isBind: boolean
}

export type AstStmt = AstPlaceUi
| AstProperty

export type AstLitNumber = {
    kind: AstKind.LitNumber
    value: number
}

export type AstLitString = {
    kind: AstKind.LitString
    value: string
}

export type AstBind = {
    kind: AstKind.Bind
    name: string
}

export type AstExpr = AstLitNumber
| AstLitString
| AstBind