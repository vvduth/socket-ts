"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LuckyNumberGame {
    constructor() {
        this.luckyNumbers = {};
    }
    GetWinners(number) {
        let ret = [];
        for (let key in this.luckyNumbers) {
            if (number === this.luckyNumbers[key]) {
                ret.push(key);
            }
        }
        return ret;
    }
}
exports.default = LuckyNumberGame;
//# sourceMappingURL=luckyNumbersGame.js.map