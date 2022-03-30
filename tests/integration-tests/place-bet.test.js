import { errorUser, GameClientDriver, internalServerErrorUser, normalUser } from "sc-game-service-integration-utils";

import gameSettings from "../../src/game-settings";
import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export default function placeBetTest() {
    describe("when user place bet", () => {
        describe("when place bet successful", () => {
            let driver;

            beforeAll(async (done) => {
                driver = await initDriverAndPlaceBet(normalUser);
                done();
            });

            afterAll(() => {
                driver.close();
            });

            it("should return current user ticket result", (done) => {
                const expectedEndBetResponse = {
                    ownBets: { big: 100 },
                    endBet: 100,
                    betChoice: "big",
                    freeBet: false,
                    user: { maxBet: 2000, minBet: 1, red: 24250, scoins: 0 },
                };

                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet) {
                        expect(endBetData).toStrictEqual(expectedEndBetResponse);
                        done();
                    }
                });
            });

            it("should return ticket status when end game", (done) => {
                // Assert
                driver.handleEndGameEvent((endGameResult) => {
                    if (endGameResult.status) {
                        done();
                    }
                });
            });
        });

        describe("when API has internal server error", () => {
            let driver;
            beforeAll(async (done) => {
                driver = await initDriverAndPlaceBet(internalServerErrorUser);
                done();
            });

            afterAll(() => {
                driver.close();
            });

            it("should return api error to client", () => {
                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet === -1) {
                        expect(endBetData.betChoice).toEqual("big");
                        expect(endBetData.apiError.errorCode).toEqual("SB1900");
                        expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                        done();
                    }
                });
            });
        });

        describe("When API response error", () => {
            let driver;
            beforeAll(async (done) => {
                driver = await initDriverAndPlaceBet(errorUser);
                done();
            });

            afterAll(() => {
                driver.close();
            });

            it("should return api error to client", () => {
                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet === -1) {
                        expect(endBetData.betChoice).toEqual("big");
                        expect(endBetData.apiError.errorCode).toEqual("SB1900");
                        expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
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
        timeout = durations.wholeRound - durations.placingBets + remainingTime + 4;
    } else if (remainingTime > durations.placingBets) {
        timeout = durations.wholeRound - durations.placingBets + 4;
    }

    return timeout;
};

const initDriverAndPlaceBet = (user) => {
    const betChoice = "big";
    const amount = 100;

    return new Promise((resolve, reject) => {
        let receivedRemainingTime = false;
        const driver = new GameClientDriver(socketOptions, initUserSession(user));
        driver.handleSignedInEvent(() => {
            driver.sendInGameEvent();
        });
        driver.handleInGameEvent((inGameData) => {
            if (!receivedRemainingTime && inGameData.remainingTime) {
                receivedRemainingTime = true;
                setTimeout(() => {
                    driver.sendBetEvent(betChoice, amount);
                }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);

                resolve(driver);
            }
        });
    });
};
