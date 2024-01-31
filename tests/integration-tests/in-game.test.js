import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";

import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export default function inGameTest() {
    describe("when user join game", () => {
        let driver;
        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
        });

        afterAll(() => {
            driver.close();
        });

        // Arrange
        const expectedGameConfigs = {
            minBet: 1,
            maxBet: 2000,
            odds: { big: 1.97, small: 1.97 },
        };

        const expectedUser = {
            UID: 1,
            avatarId: 1,
            currency: "$US",
            name: "NormalUser",
            rate: 1,
            red: 25000,
            type: false,
        };

        const expectedRoundHistory = [
            {
                roundId: 823211,
                result: { dice1: 1, dice2: 5, dice3: 3 },
                settlementResult: { big: false, small: true },
            },
            {
                roundId: 823210,
                result: { dice1: 4, dice2: 4, dice3: 1 },
                settlementResult: { big: false, small: true },
            },
            {
                roundId: 823209,
                result: { dice1: 1, dice2: 2, dice3: 6 },
                settlementResult: { big: false, small: true },
            },
        ];

        it("should return game configuration (odds, min bet, max bet)", async () => {
            // Act
            driver.sendInGameEvent();
            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.gameConfigs);
            const { gameConfigs } = result;

            // Assert
            expect(gameConfigs.minBet).toEqual(expectedGameConfigs.minBet);
            expect(gameConfigs.maxBet).toEqual(expectedGameConfigs.maxBet);
        });

        it.skip("should return user information", (done) => {
            // Act
            driver.sendInGameEvent();

            // Assert
            driver.handleInGameEvent((inGameData) => {
                if (inGameData?.user?.UID) {
                    expect(inGameData.user).toStrictEqual(expectedUser);

                    done();
                }
            });
        });

        it.skip("should return old round history", (done) => {
            // Act
            driver.sendInGameEvent();

            // Assert
            driver.handleInGameEvent((inGameData) => {
                if (inGameData?.roundHistory) {
                    expect(inGameData.roundHistory.slice(1, 4)).toStrictEqual(expectedRoundHistory);
                    done();
                }
            });
        });
    });
}
