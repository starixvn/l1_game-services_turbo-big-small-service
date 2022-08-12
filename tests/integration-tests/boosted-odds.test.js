import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const boostedOddsTest = () => {
    describe("boosted odds", () => {
        it("should return boosted odds then original odds", (done) => {
            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            normalUserClientDriver.handleSignedInEvent(() => {
                normalUserClientDriver.sendInGameEvent();
            });

            let boostedOdds = false;

            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData.gameConfigs && inGameData.gameConfigs.odds.big === 1.98) {
                    expect(inGameData.gameConfigs.boostedChoices).toEqual(["big", "small"]);
                    if (!boostedOdds) {
                        setTimeout(() => {
                            normalUserClientDriver.sendInGameEvent();
                        }, 60000);
                    }

                    boostedOdds = true;
                }

                if (boostedOdds && inGameData.gameConfigs && inGameData.gameConfigs.odds.big === 1.97) {
                    expect(inGameData.gameConfigs.boostedChoices).toEqual([]);
                    normalUserClientDriver.close();
                    done();
                }
            });
        });
    });
};
