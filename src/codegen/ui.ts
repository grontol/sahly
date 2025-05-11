export interface UiElement {
    name: string
    properties: UiProperty[]
    
    create(): string
}

export interface UiProperty {
    name: string
    jsName: string
}

const styleProperties: UiProperty[] = [
    { name: 'background', jsName: 'style.background' },
    { name: 'padding', jsName: 'style.padding' }
]

export const uiElements: Record<string, UiElement> = {
    'Input': {
        name: 'Input',
        properties: [
            { name: 'text', jsName: 'value' },
            { name: 'hint', jsName: 'placeholder' },
            ...styleProperties,
        ],
        create() {
            return `document.createElement('input')`
        },
    },
    
    'Label': {
        name: 'Label',
        properties: [
            { name: 'text', jsName: 'innerHTML' },
            ...styleProperties,
        ],
        create() {
            return `document.createElement('div')`
        },
    },
    
    'Tombol': {
        name: 'Tombol',
        properties: [
            { name: 'text', jsName: 'textContent' },
            { name: 'aksi', jsName: 'onclick' },
        ],
        create() {
            return `document.createElement('button')`
        },
    },
}