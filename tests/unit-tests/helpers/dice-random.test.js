import { random1, random2, random3, random4, random5 } from "../../../src/helpers/dice-random";

describe("random functions tests", () => {
    it("random1 should return correct value of dice", () => {
        // act
        var dice = random1();

        // assert
        expect(dice).toBeGreaterThanOrEqual(1);
        expect(dice).toBeLessThanOrEqual(6);
    });

    it("random2 should return correct value of dice", () => {
        // act
        var dice = random2();

        // assert
        expect(dice).toBeGreaterThanOrEqual(1);
        expect(dice).toBeLessThanOrEqual(6);
    });

    it("random3 should return correct value of dice", () => {
        // act
        var dice = random3();

        // assert
        expect(dice).toBeGreaterThanOrEqual(1);
        expect(dice).toBeLessThanOrEqual(6);
    });

    it("random4 should return correct value of dice", () => {
        // act
        var dice = random4();

        // assert
        expect(dice).toBeGreaterThanOrEqual(1);
        expect(dice).toBeLessThanOrEqual(6);
    });

    it("random5 should return correct value of dice", () => {
        // act
        var dice = random5();

        // assert
        expect(dice).toBeGreaterThanOrEqual(1);
        expect(dice).toBeLessThanOrEqual(6);
    });
});
