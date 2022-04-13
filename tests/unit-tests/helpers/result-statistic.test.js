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

            // Act
            for (let i = 0; i < totalRounds; i++) {
                const result = generateResult(mode);
                const settlementResult = getSettlementResult(result);

                statisticResult.big += settlementResult.big >> 0;
                statisticResult.small += settlementResult.small >> 0;
            }

            // Assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / totalRounds) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${mode}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );

            expect(resultPercentage.big).toBeGreaterThanOrEqual(49.5);
            expect(resultPercentage.small).toBeGreaterThanOrEqual(49.5);
        });
    });
});
