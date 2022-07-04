import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import { randomModes } from "../../../src/helpers/dice-random";

describe("Result statistic: 100000 times", () => {
    Object.keys(randomModes).forEach((mode) => {
        it(`should generate results statistically correct with mode ${mode}`, () => {
            // Arrange
            let statisticResult = {
                big: 0,
                small: 0,
            };
            const totalRounds = 100000;
            const dragonTails = {};
            let continuity = 0;
            let isBig = false;

            // Act
            for (let i = 0; i < totalRounds; i++) {
                const result = generateResult(mode);
                const settlementResult = getSettlementResult(result);

                statisticResult.big += settlementResult.big >> 0;
                statisticResult.small += settlementResult.small >> 0;
                if (i > 0) {
                    if (settlementResult.big && isBig) {
                        continuity++;
                    } else {
                        if (settlementResult.small && !isBig) {
                            continuity++;
                        } else {
                            if (continuity >= 4) {
                                dragonTails[continuity] = dragonTails[continuity] ?? 0;
                                dragonTails[continuity] += 1;
                            }
                            continuity = 0;
                        }
                    }
                    isBig = settlementResult.big ? true : false;
                }
            }

            // Assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / totalRounds) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${mode}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`dragon tails: ${JSON.stringify(dragonTails)}`);

            expect(resultPercentage.big).toBeGreaterThanOrEqual(49.5);
            expect(resultPercentage.small).toBeGreaterThanOrEqual(49.5);
            expect(dragonTails[4]).toBeLessThan(1700);
            expect(dragonTails[5]).toBeLessThan(900);
            expect(dragonTails[6]).toBeLessThan(450);
            expect(dragonTails[7]).toBeLessThan(230);
            expect(dragonTails[8]).toBeLessThan(130);
            expect(dragonTails[9]).toBeLessThan(70);
            expect(dragonTails[10]).toBeLessThan(35);
        });
    });
});
