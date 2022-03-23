import {
    endGameErrorUser,
    errorUser,
    GameClientDriver,
    internalServerErrorUser,
    normalUser,
} from "sc-game-service-integration-utils";

import { currencyData, socketOptions } from "./stubs/test-data";
import { startServiceProcess, startSetupDataProcess } from "./stubs/test-jobs";

let processStartService;

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 70000;

let normalUserClientDriver;
let errorUserClientDriver;
let internalServerErrorUserClientDriver;
let endGameErrorUserClientDriver;

beforeAll((done) => {
    startSetupDataProcess(() => {
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
        processStartService = startServiceProcess(() => {
            normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

            errorUserClientDriver = new GameClientDriver(socketOptions, initUserSession(errorUser));
            errorUserClientDriver.handleSignedInEvent(() => {
                errorUserClientDriver.sendInGameEvent();
            });

            internalServerErrorUserClientDriver = new GameClientDriver(socketOptions, initUserSession(internalServerErrorUser));
            internalServerErrorUserClientDriver.handleSignedInEvent(() => {
                internalServerErrorUserClientDriver.sendInGameEvent();
            });

            endGameErrorUserClientDriver = new GameClientDriver(socketOptions, initUserSession(endGameErrorUser));
            endGameErrorUserClientDriver.handleSignedInEvent(() => {
                endGameErrorUserClientDriver.sendInGameEvent();
            });

            done();
        });
    });
});

afterAll(() => {
    normalUserClientDriver.close();
    errorUserClientDriver.close();
    internalServerErrorUserClientDriver.close();
    endGameErrorUserClientDriver.close();

    processStartService.stdin.pause();
    processStartService.kill();
});

describe("BigSmall Service", () => {
    describe("when sign in successful", () => {
        it("should receive signed in response", (done) => {
            // Assert
            normalUserClientDriver.handleSignedInEvent(() => {
                done();
            });
        });
    });

    describe("when user joins game", () => {
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

        beforeAll((done) => {
            normalUserClientDriver.sendInGameEvent();
            done();
        });

        it("should return game configuration (odds, min bet, max bet)", (done) => {
            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.gameConfigs) {
                    if (inGameData.gameConfigs) {
                        expect(inGameData.gameConfigs.minBet).toEqual(expectedGameConfigs.minBet);
                        expect(inGameData.gameConfigs.maxBet).toEqual(expectedGameConfigs.maxBet);
                        expect(inGameData.gameConfigs.odds).toStrictEqual(expectedGameConfigs.odds);

                        done();
                    }
                }
            });
        });

        // it("should return user information", (done) => {
        //     // Assert
        //     normalUserClientDriver.handleInGameEvent((inGameData) => {
        //         if (inGameData?.user?.UID) {
        //             expect(inGameData.user).toStrictEqual(expectedUser);

        //             done();
        //         }
        //     });
        // });

        it("should return old round history", () => {
            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.roundHistory) {
                    expect(inGameData.roundHistory).toStrictEqual(expectedRoundHistory);
                    done();
                }
            });
        });
    });

    describe("when user get bet history", () => {
        it("should return bet history", (done) => {
            // Arrange
            const expectedData = [
                {
                    refund: 0,
                    baseRefund: 0,
                    win: false,
                    betwin: 0,
                    baseBetWin: 0,
                    totalWin: 0,
                    baseTotalWin: 0,
                    totalAmount: 0,
                    phien: 823211,
                    currency: "$US",
                    amount: 100,
                    baseAmount: 100,
                    choice: "small",
                    name: "NormalUser",
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                },
                {
                    refund: 0,
                    baseRefund: 0,
                    win: false,
                    betwin: 0,
                    baseBetWin: 0,
                    totalWin: 0,
                    baseTotalWin: 0,
                    totalAmount: 0,
                    phien: 823211,
                    currency: "$US",
                    amount: 100,
                    baseAmount: 100,
                    choice: "big",
                    name: "NormalUser",
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                },
            ];

            // Act
            normalUserClientDriver.sendGetHistoryEvent();

            // Assert
            normalUserClientDriver.handleGetHistoryEvent((betHistoryData) => {
                if (betHistoryData?.history) {
                    const actualBetLogs = betHistoryData.history.betLogs.map((betLog) => {
                        delete betLog.result;
                        delete betLog.settlementResult;
                        return betLog;
                    });

                    expect(actualBetLogs).toEqual(expectedData);
                    done();
                }
            });
        });
    });

    describe("User place bet", () => {
        // Arrange
        const betChoice = "big";
        const amount = 100;

        describe("when place bet successful", () => {
            beforeAll(async (done) => {
                // Act
                await normalUserClientDriver.sendBetEvent(betChoice, amount);
                done();
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
                normalUserClientDriver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet) {
                        expect(endBetData).toStrictEqual(expectedEndBetResponse);
                        done();
                    }
                });
            });

            it("should return ticket status when end game", (done) => {
                // Assert
                normalUserClientDriver.handleEndBetEvent((endGameResult) => {
                    if (endGameResult.status) {
                        done();
                    }
                });
            });
        });

        describe("when get error response from api", () => {
            beforeAll(async (done) => {
                // Act
                await errorUserClientDriver.sendBetEvent(betChoice, amount);
                done();
            });

            it("should return api error to client", (done) => {
                // Assert
                errorUserClientDriver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet === -1) {
                        expect(endBetData.betChoice).toEqual("big");
                        expect(endBetData.apiError.errorCode).toEqual(3002);
                        expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                        done();
                    }
                });
            });
        });

        describe("when API internal server error", () => {
            beforeAll(async (done) => {
                // Act
                await internalServerErrorUserClientDriver.sendBetEvent(betChoice, amount);
                done();
            });

            it("should return api error to client", (done) => {
                // Assert
                internalServerErrorUserClientDriver.handleEndBetEvent((endBetData) => {
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
});

const initUserSession = (user) => {
    return {
        session: `${user.memberId}-session-id`,
        ss: `${user.memberId}-session-id`,
        currency: currencyData.name,
        username: `${user.memberId}_${user.memberName}`,
        browserUserAgent: "browser-user-agent",
    };
};
