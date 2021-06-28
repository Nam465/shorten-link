class Base32 {
    constructor() {
        this.source = [
            'p', 'q', 'g', 'h', 'z', 'b',
            'k', '2', 'f', 'j', 'y', 'i',
            'a', 'v', 's', 'o', '3', '4',
            'n', '5', '7', 'm', 'x', 'd',
            'c', 'e', '6', 'r', 't', 'u',
            'w', 'l'
        ]
    }

    get() {
        return this.source 
    }
}

module.exports = Base32
