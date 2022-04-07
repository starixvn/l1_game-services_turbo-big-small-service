import { generateResult } from "../../../src/helpers/result-helper";
import { randomModes } from "../../../src/helpers/dice-random";

describe("Result statistic: 100000 times", () => {
    Object.keys(randomModes).forEach((mode) => {
        it(`should generate results statistically correct with mode ${mode}`, () => {
            // Arrange
            let statisticResult = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
            };
            const totalRounds = 100000;

            // Act
            for (let i = 0; i < totalRounds; i++) {
                const result = generateResult(mode);
                statisticResult[result.dice1]++;
                statisticResult[result.dice2]++;
                statisticResult[result.dice3]++;
            }

            // Assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = parseFloat((statisticResult[key] / (totalRounds * 3)) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${mode}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            const allResultPercentGoodEnough = Object.keys(resultPercentage).every((key) => resultPercentage[key] >= 16.4);
            expect(allResultPercentGoodEnough).toBe(true);
        });
    });
});
