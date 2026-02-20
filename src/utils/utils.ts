
function generateName(length: number = 7): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let name = '';
    for (let i = 0; i < length; i++) {
        name += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return name;
}

export {generateName};