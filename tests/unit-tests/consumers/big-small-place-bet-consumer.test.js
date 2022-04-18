import BigSmallPlaceBetConsumer from "../../../src/consumers/big-small-place-bet-consumer";
import { helpers } from "sc-common";

describe("composeBettingTimeValidationCriteria", () => {
    it("when not enabled - return invalid bet", () => {
        // Arrange
        const consumer = new BigSmallPlaceBetConsumer();
        consumer.gameData = {
            gameConfigs: {
                enabled: false,
            },
        };
        consumer.definition = {
            durations: {
                wholeRound: 61,
                placingBets: 50,
                balancingBetTime: 9,
                lockingBet: 5,
                shakeThePlateDuration: 2,
            },
        };

        // Act
        const result = consumer.composeBettingTimeValidationCriteria();

        // Assert
        expect(result.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.invalidBet },
        });
    });

    it("when round id different - return invalid bet", () => {
        // Arrange
        const consumer = new BigSmallPlaceBetConsumer();
        consumer.gameData = {
            gameConfigs: {
                enabled: true,
            },
            roundId: 123,
        };
        consumer.definition = {
            durations: {
                wholeRound: 61,
                placingBets: 50,
                balancingBetTime: 9,
                lockingBet: 5,
                shakeThePlateDuration: 2,
            },
        };

        // Act
        const result = consumer.composeBettingTimeValidationCriteria(122);

        // Assert
        expect(result.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.invalidBet, gameRoundId: 122 },
        });
    });

    it("when shaking plate time - return cannotPlaceBet", () => {
        // Arrange
        const consumer = new BigSmallPlaceBetConsumer();
        consumer.gameData = {
            gameConfigs: {
                enabled: true,
            },
            roundId: 122,
            remainingTime: 51,
        };
        consumer.definition = {
            durations: {
                wholeRound: 61,
                placingBets: 50,
                balancingBetTime: 9,
                lockingBet: 5,
                shakeThePlateDuration: 2,
            },
        };

        // Act
        const result = consumer.composeBettingTimeValidationCriteria(122);

        // Assert
        expect(result.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.cannotPlaceBet },
        });
    });

    it("when locking time - return placeBetNextRound", () => {
        // Arrange
        const consumer = new BigSmallPlaceBetConsumer();
        consumer.gameData = {
            gameConfigs: {
                enabled: true,
            },
            roundId: 122,
            remainingTime: 4,
        };
        consumer.definition = {
            durations: {
                wholeRound: 61,
                placingBets: 50,
                balancingBetTime: 9,
                lockingBet: 5,
                shakeThePlateDuration: 2,
            },
        };

        // Act
        const result = consumer.composeBettingTimeValidationCriteria(122);

        // Assert
        expect(result.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("when settle time - return placeBetNextRound", () => {
        // Arrange
        const consumer = new BigSmallPlaceBetConsumer();
        consumer.gameData = {
            gameConfigs: {
                enabled: true,
            },
            roundId: 122,
            remainingTime: 55,
        };
        consumer.definition = {
            durations: {
                wholeRound: 61,
                placingBets: 50,
                balancingBetTime: 9,
                lockingBet: 5,
                shakeThePlateDuration: 2,
            },
        };

        // Act
        const result = consumer.composeBettingTimeValidationCriteria(122);

        // Assert
        expect(result.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });
});
