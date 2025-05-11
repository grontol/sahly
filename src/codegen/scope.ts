export class Scope {
    parent: Scope | null = null
    
    private symbols = new Set<string>()
    
    constructor(parent: Scope | null = null) {
        this.parent = parent
    }
    
    hasSymbol(name: string): boolean {
        if (this.symbols.has(name)) return true
        return this.parent?.hasSymbol(name) ?? false
    }
    
    addSymbol(name: string) {
        this.symbols.add(name)
    }
    
    inherit(): Scope {
        return new Scope(this)
    }
}