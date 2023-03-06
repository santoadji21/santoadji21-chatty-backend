export class Helpers {
  static firstLetterUpperCase(str: string): string {
    return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase())
  }

  static generateRandomInteger(integerLength: number): number {
    const character = '0123456789'
    let randomInteger = ''
    for (let i = 0; i < integerLength; i++) {
      randomInteger += character.charAt(Math.floor(Math.random() * character.length))
    }
    return parseInt(randomInteger, 10)
  }
}
