export interface UiElement {
    name: string
    properties: UiProperty[]
    
    create(parent: string, varName: string): string
}

export interface UiProperty {
    name: string
    jsName: string
}

export const uiElements: Record<string, UiElement> = {
    'Input': {
        name: 'Input',
        properties: [
            { name: 'text', jsName: 'value' },
            { name: 'hint', jsName: 'placeholder' },
        ],
        create(parent, varName) {
            return `
                const ${varName} = document.createElement('input');
                ${parent}.appendChild(${varName});
            `
        },
    },
    
    'Label': {
        name: 'Label',
        properties: [
            { name: 'text', jsName: 'innerHTML' },
        ],
        create(parent, varName) {
            return `
                const ${varName} = document.createElement('div');
                ${parent}.appendChild(${varName});
            `
        },
    },
    
    'Tombol': {
        name: 'Tombol',
        properties: [
            { name: 'text', jsName: 'textContent' },
            { name: 'aksi', jsName: 'onclick' },
        ],
        create(parent, varName) {
            return `
                const ${varName} = document.createElement('button');
                ${parent}.appendChild(${varName});
            `
        },
    },
}