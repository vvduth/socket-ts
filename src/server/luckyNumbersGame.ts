// The code that will get the lucky number and return the array that 
// has all the socket ids having that number
interface LuckyNumber<T> {
    [luckyNumber: number] : T 
}

export default class LuckyNumberGame {
    public luckyNumbers : LuckyNumber<number> ={} ; 

    constructor() {

    }

    public GetWinners(number: number) : string[] {
        let ret: string[] = [] ; 

        for (let key in this.luckyNumbers) {
            if (number === this.luckyNumbers[key]) {
                ret.push(key) ; 
            }
        }

        return ret ; 
    }
}