import { AstExpr, AstKind, AstPlaceUi, AstProperty, AstRoot, AstStmt } from "@/parser/ast";
import { showError, todo, unreachable } from "@/utils";

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
        default: {
            todo()
        }
    }
}

function genPlaceUi(placeUi: AstPlaceUi): string {
    switch (placeUi.ui.value) {
        case "Label": {
            return genUiLabel(placeUi.properties)
        }
        case "Input": {
            return genUiInput(placeUi.properties)
        }
        case "Tombol": {
            return genUiButton(placeUi.properties)
        }
        default: {
            showError(
                `Tidak ada ui yang namanya '${placeUi.ui.value}'`,
                placeUi.ui.file,
                placeUi.ui.row,
                placeUi.ui.col,
            )
        }
    }
}

function genUiLabel(properties: AstProperty[]): string {
    const v = createVar()
    
    const text = [`
        const ${v} = document.createElement('div');
        el.appendChild(${v})
    `]
    
    for (const prop of properties) {
        switch (prop.name.value) {
            case "text": {
                const value = genExpr(prop.value)
                text.push(`${v}.innerHTML = ${value};`)
                break
            }
            default: {
                showError(
                    `Property '${prop.name.value}' gak ada di Label`,
                    prop.name.file,
                    prop.name.row,
                    prop.name.col,
                )
            }
        }
    }
    
    return text.join('\n')
}

function genUiInput(properties: AstProperty[]): string {
    const v = createVar()
    
    const text = [`
        const ${v} = document.createElement('input');
        el.appendChild(${v})
    `]
    
    for (const prop of properties) {
        switch (prop.name.value) {
            case "text": {
                const value = genExpr(prop.value)
                text.push(`${v}.value = ${value};`)
                break
            }
            case "hint": {
                const value = genExpr(prop.value)
                text.push(`${v}.placeholder = ${value};`)
                break
            }
            default: {
                showError(
                    `Property '${prop.name.value}' gak ada di Input`,
                    prop.name.file,
                    prop.name.row,
                    prop.name.col,
                )
            }
        }
    }
    
    return text.join('\n')
}

function genUiButton(properties: AstProperty[]): string {
    const v = createVar()
    
    const text = [`
        const ${v} = document.createElement('button');
        el.appendChild(${v});
    `]
    
    for (const prop of properties) {
        switch (prop.name.value) {
            case "text": {
                const value = genExpr(prop.value)
                text.push(`${v}.textContent = ${value};`)
                break
            }
            default: {
                showError(
                    `Property '${prop.name.value}' gak ada di Tombol`,
                    prop.name.file,
                    prop.name.row,
                    prop.name.col,
                )
            }
        }
    }
    
    return text.join('\n')
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
    }
}