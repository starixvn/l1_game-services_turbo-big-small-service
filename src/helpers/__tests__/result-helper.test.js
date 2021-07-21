import Chance from "chance";

import { generateResult, getSettlementResult } from "../result-helper";

describe("getSettlementResult tests", () => {
    const chance = new Chance();

    it("should return big if the total of points is greater than 10", () => {
        // arrange
        const total = chance.integer({ min: 11, max: 18 });
        const dice1 = chance.integer({ min: 1, max: 6 });
        const dice2 = chance.integer({ min: 1, max: Math.min(6, total - dice1 - 1) });
        const dice3 = total - dice1 - dice2;
        const roundResult = { dice1, dice2, dice3 };
        const expected = {
            big: true,
            small: false,
        };

        // act
        var result = getSettlementResult(roundResult);

        // assert
        expect(result).toStrictEqual(expected);
    });

    it("should return small if the total of points is less than or equal 10", () => {
        // arrange
        const total = chance.integer({ min: 3, max: 10 });
        const dice1 = chance.integer({ min: 1, max: Math.min(6, total - 2) });
        const dice2 = chance.integer({ min: 1, max: Math.min(6, total - dice1 - 1) });
        const dice3 = total - dice1 - dice2;
        const roundResult = { dice1, dice2, dice3 };
        const expected = {
            big: false,
            small: true,
        };

        // act
        var result = getSettlementResult(roundResult);

        // assert
        expect(result).toStrictEqual(expected);
    });
});

describe("generateResult tests", () => {
    it("should return enough results", () => {
        // act
        var result = generateResult();

        // assert
        expect(Object.keys(result).length).toBe(3);
        expect(Object.values(result).every((dice) => dice >= 1 && dice <= 6)).toBeTrue();
    });
});
