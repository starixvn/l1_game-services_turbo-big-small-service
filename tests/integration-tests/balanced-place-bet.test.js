import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";

import gameSettings from "../../src/game-settings";
import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export default function balancedPlaceBetTest() {
    describe("when user place bet to get refund", () => {
        describe("when place bet successful", () => {
            let driver;

            beforeAll(async (done) => {
                driver = await initDriverAndPlaceBet(normalUser);
                done();
            });

            afterAll(() => {
                driver.close();
            });

            it("should place balanced bets", (done) => {
                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.totalBets && endBetData.totalBets.small >= 300) {
                        done();
                    }
                });
            });
        });
    });
}

const getTimeOutToBet = (remainingTime, durations) => {
    let timeout = 0;
    if (remainingTime <= durations.lockingBet) {
        timeout = durations.wholeRound + remainingTime - 7;
    } else {
        timeout = remainingTime - 7;
    }

    return timeout;
};

const initDriverAndPlaceBet = (user) => {
    const betChoice = "big";
    const amount = 1000;

    return new Promise((resolve, reject) => {
        const driver = new GameClientDriver(socketOptions, initUserSession(user));
        driver.handleSignedInEvent(() => {
            driver.sendInGameEvent();
        });
        driver.handleInGameEvent((inGameData) => {
            if (inGameData.remainingTime) {
                setTimeout(() => {
                    driver.sendBetEvent(betChoice, amount);
                }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);

                resolve(driver);
            }
        });
    });
};
