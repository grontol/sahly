import { uiElements } from "@/codegen/ui";
import { AstExpr, AstKind, AstLoop, AstPlaceUi, AstProperty, AstRoot, AstStmt } from "@/parser/ast";
import { Keywords } from "@/tokenizer/keyword";
import { showError, todo } from "@/utils";

let varId = 0

function createVar(): string {
    return `_$$var${varId++}`
}

export function jsCodegen(root: AstRoot): string {
    const stmts = root.stmts.map(x => genStmt(x)).join('\n')
    
    return `
        export function _$$entry(el) {
            ${stmts}
        }
    `
}

function genStmt(stmt: AstStmt): string {
    switch (stmt.kind) {
        case AstKind.PlaceUi: {
            return genPlaceUi(stmt)
        }
        case AstKind.Loop: {
            return genLoop(stmt)
        }
        default: {
            todo()
        }
    }
}

function genPlaceUi(placeUi: AstPlaceUi): string {
    if (placeUi.ui.value in uiElements) {
        const ui = uiElements[placeUi.ui.value]
        
        const varName = createVar()
        const texts = [ui.create('el', varName)]
        
        for (const prop of placeUi.properties) {
            if (prop.name.value === Keywords.Bind) {
                
                
                continue
            }
            
            const uiProp = ui.properties.find(x => x.name === prop.name.value)
            
            if (!uiProp) {
                showError(
                    `Property '${prop.name.value}' gak ada di ${ui.name}`,
                    prop.name.file,
                    prop.name.row,
                    prop.name.col,
                )
            }
            
            const value = genExpr(prop.value)
            texts.push(`${varName}.${uiProp.jsName} = ${value}`)
        }
        
        return texts.join('\n')
    }
    else {
        showError(
            `Tidak ada ui yang namanya '${placeUi.ui.value}'`,
            placeUi.ui.file,
            placeUi.ui.row,
            placeUi.ui.col,
        )
    }
}

function genLoop(loop: AstLoop): string {
    const varName = createVar()
    const count = genExpr(loop.count)
    const stmts = loop.body.stmts.map(x => genStmt(x)).join('\n')
    
    return `
        for (let ${varName} = 0; ${varName} < ${count}; ${varName}++) {
            ${stmts}
        }
    `
}

function genExpr(expr: AstExpr): string {
    switch (expr.kind) {
        case AstKind.LitString: {
            return `"${expr.value}"`
        }
        case AstKind.LitNumber: {
            return expr.value.toString()
        }
        case AstKind.Bind: {
            todo()
        }
        case AstKind.Block: {
            const stmts = expr.stmts.map(x => genStmt(x)).join('\n')
            return `() => { ${stmts} }`
        }
    }
}