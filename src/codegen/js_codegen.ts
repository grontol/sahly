import { Scope } from "@/codegen/scope";
import { uiElements } from "@/codegen/ui";
import { AstAssign, AstBinop, AstDeclare, AstExpr, AstIdentifier, AstKind, AstLoop, AstObjCall, AstPlaceUi, AstRoot, AstStmt } from "@/parser/ast";
import { showError, showErrorAtToken, todo } from "@/utils";

let varId = 0

function createVar(): string {
    return `_$$var${varId++}`
}

export function jsCodegen(root: AstRoot): string {
    const scope = new Scope()
    const stmts = root.stmts.map(x => genStmt(scope, x)).join('\n')
    
    return `
        export function _$$entry(el) {
            ${stmts}
        }
    `
}

function genStmt(scope: Scope, stmt: AstStmt): string {
    switch (stmt.kind) {
        case AstKind.Declare: {
            return genDeclare(scope, stmt)
        }
        case AstKind.Assign: {
            return genAssign(scope, stmt)
        }
        case AstKind.PlaceUi: {
            return genPlaceUi(scope, stmt)
        }
        case AstKind.Loop: {
            return genLoop(scope, stmt)
        }
        default: {
            todo(`genStmt ${AstKind[stmt.kind]}`)
        }
    }
}

function genDeclare(scope: Scope, decl: AstDeclare): string {
    if (scope.hasSymbol(decl.variable.value)) {
        showErrorAtToken(`Variabel '${decl.variable.value}' sudah ada`, decl.variable)
    }
    
    scope.addSymbol(decl.variable.value)
    
    let text = `let ${decl.variable.value}`
    
    if (decl.value) {
        text += ' = '
        text += genExpr(scope, decl.value)
        text += ';'
    }
    
    return text
}

function genAssign(scope: Scope, ass: AstAssign): string {
    if (!scope.hasSymbol(ass.variable.value)) {
        showErrorAtToken(`Variabel '${ass.variable.value}' tidak ada`, ass.variable)
    }
    
    return `${ass.variable.value} = ${genExpr(scope, ass.value)}`
}

function genPlaceUi(scope: Scope, placeUi: AstPlaceUi): string {
    const value = genExpr(scope, placeUi.ui)
    
    return `el.appendChild(${value});`
}

function genLoop(scope: Scope, loop: AstLoop): string {
    const varName = loop.index ? loop.index.value : createVar()
    const count = genExpr(scope, loop.count)
    
    const newScope = scope.inherit()
    
    if (loop.index) {
        newScope.addSymbol(loop.index.value)
    }
    
    const stmts = loop.body.stmts.map(x => genStmt(newScope, x)).join('\n')
    
    return `
        for (let ${varName} = 0; ${varName} < ${count}; ${varName}++) {
            ${stmts}
        }
    `
}

function genExpr(scope: Scope, expr: AstExpr): string {
    switch (expr.kind) {
        case AstKind.ObjCall: {
            if (expr.name.value in uiElements) {
                return genUiElement(scope, expr)
            }
            else {
                todo(`ObjCall '${expr.name.value}' not a ui element`)
            }
        }
        case AstKind.Identifier: {
            return genIdentifier(scope, expr)
        }
        case AstKind.LitString: {
            return `"${expr.value}"`
        }
        case AstKind.LitNumber: {
            return expr.value.toString()
        }
        case AstKind.Binop: {
            return genBinop(scope, expr)
        }
        case AstKind.Block: {
            const stmts = expr.stmts.map(x => genStmt(scope, x)).join('\n')
            return `() => { ${stmts} }`
        }
    }
}

function genIdentifier(scope: Scope, ident: AstIdentifier): string {
    if (!scope.hasSymbol(ident.name.value)) {
        showErrorAtToken(`Variabel '${ident.name.value}' tidak ada`, ident.name)
    }
    
    return ident.name.value
}

function genBinop(scope: Scope, binop: AstBinop): string {
    return `(${genExpr(scope, binop.lhs)} ${binop.op.value} ${genExpr(scope, binop.rhs)})`
}

function genUiElement(scope: Scope, call: AstObjCall): string {
    const ui = uiElements[call.name.value]
    
    const texts = [
        `const el = ${ui.create()};`
    ]
    
    for (const prop of call.properties) {        
        const uiProp = ui.properties.find(x => x.name === prop.name.value)
        
        if (!uiProp) {
            showError(
                `Property '${prop.name.value}' gak ada di ${ui.name}`,
                prop.name.file,
                prop.name.row,
                prop.name.col,
            )
        }
        
        const value = genExpr(scope, prop.value)
        texts.push(`el.${uiProp.jsName} = ${value};`)
    }
    
    return `(function() {
        ${texts.join('\n')}
        return el;
    })()`
}