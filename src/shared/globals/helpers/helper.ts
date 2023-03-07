/* eslint-disable @typescript-eslint/no-explicit-any */
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

  static parseJson(prop: string): any {
    try {
      JSON.parse(prop)
    } catch (error) {
      return prop
    }
    return JSON.parse(prop)
  }

  static shuffle(list: string[]): string[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }
    return list
  }
}
