import { spawn } from "child_process";
import {
    endGameErrorUser,
    errorUser,
    GameClientDriver,
    internalServerErrorUser,
    normalUser,
} from "sc-game-service-integration-utils";

import { currencyData, socketOptions } from "./stubs/test-data";

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 60000;
const WAITING_END_GAME_TIMEOUT = 30000;

const setupTestDataJob = spawn("node", ["--es-module-specifier-resolution=node", "./tests/integration-tests/stubs/test-data-setup.js"]);
setupTestDataJob.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});

setupTestDataJob.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
});
setupTestDataJob.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});

const processStartService = spawn("node", [
    "--es-module-specifier-resolution=node",
    "./tests/integration-tests/game-service-setup/game-service-app.js",
    {
        stdio: [null, null, null, "ipc"],
    },
]);

processStartService.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});

processStartService.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
});

let normalUserClientDriver;
let errorUserClientDriver;
let internalServerErrorUserClientDriver;
let endGameErrorUserClientDriver;

beforeAll(async (done) => {
    setTimeout(() => {
        // set timeout for jest, waiting for socket response
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
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
    }, 20000);
}, 21000);

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

        it("should return user information", () => {
            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.user?.UID) {
                    expect(inGameData.user).toStrictEqual(expectedUser);

                    done();
                }
            });
        });

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

    // describe("Happy Path Cases", () => {
    //     let gameClientDriver;
    //     beforeAll(() => {
    //         // Arrange
    //         gameClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));
    //     });

    //     afterAll(() => {
    //         gameClientDriver.close();
    //     });

    //     it("should start and allow game client connect to.", (done) => {
    //         // Assert
    //         gameClientDriver.handleSignedInEvent(() => {
    //             done();
    //         });
    //     });

    //     it("should return game configuration (odds, min bet, max bet) when user joins game.", (done) => {
    //         // Arrange
    //         const expectedGameConfigs = {
    //             minBet: 1,
    //             maxBet: 2000,
    //             maxBetPerChoices: {},
    //             odds: { big: 1.97, small: 1.97 },
    //         };

    //         // Act
    //         gameClientDriver.sendInGameEvent();

    //         // Assert
    //         gameClientDriver.handleInGameEvent((inGameData) => {
    //             if (inGameData?.gameConfigs) {
    //                 if (inGameData.gameConfigs) {
    //                     expect(inGameData.gameConfigs.minBet).toEqual(expectedGameConfigs.minBet);
    //                     expect(inGameData.gameConfigs.maxBet).toEqual(expectedGameConfigs.maxBet);
    //                     expect(inGameData.gameConfigs.odds).toStrictEqual(expectedGameConfigs.odds);

    //                     done();
    //                 }
    //             }
    //         });
    //     });
    //     it("should return user information when user joins game.", (done) => {
    //         // Arrange
    //         const expectedUser = {
    //             UID: 1,
    //             avatarId: 1,
    //             currency: "$US",
    //             name: "NormalUser",
    //             rate: 1,
    //             red: 25000,
    //         };

    //         // Act
    //         gameClientDriver.sendInGameEvent();

    //         // Assert
    //         gameClientDriver.handleInGameEvent((inGameData) => {
    //             if (inGameData?.user?.UID) {
    //                 expect(inGameData.user).toStrictEqual(expectedUser);

    //                 done();
    //             }
    //         });
    //     });

    //     it("should return old round history when user joins game", (done) => {
    //         // Arrange
    //         const expectedRoundHistory = [
    //             {
    //                 roundId: 823211,
    //                 result: { dice1: 1, dice2: 5, dice3: 3 },
    //                 settlementResult: { big: false, small: true },
    //             },
    //             {
    //                 roundId: 823210,
    //                 result: { dice1: 4, dice2: 4, dice3: 1 },
    //                 settlementResult: { big: false, small: true },
    //             },
    //             {
    //                 roundId: 823209,
    //                 result: { dice1: 1, dice2: 2, dice3: 6 },
    //                 settlementResult: { big: false, small: true },
    //             },
    //         ];

    //         // Act
    //         gameClientDriver.sendInGameEvent();

    //         // Assert
    //         gameClientDriver.handleInGameEvent((inGameData) => {
    //             if (inGameData?.roundHistory) {
    //                 expect(inGameData.roundHistory).toStrictEqual(expectedRoundHistory);
    //                 done();
    //             }
    //         });
    //     });

    //     it("should return current user ticket result when user is playing game.", async (done) => {
    //         // Arrange
    //         const betChoice = "big";
    //         const amount = 100;

    //         const expectedEndBetResponse = {
    //             ownBets: { big: 100 },
    //             endBet: 100,
    //             betChoice: "big",
    //             freeBet: false,
    //             user: { maxBet: 2000, minBet: 1, red: 24250, scoins: 0 },
    //         };

    //         // Act
    //         await gameClientDriver.sendBetEvent(betChoice, amount);

    //         // Assert
    //         gameClientDriver.handleEndBetEvent((endBetData) => {
    //             if (endBetData.endBet) {
    //                 expect(endBetData).toStrictEqual(expectedEndBetResponse);
    //                 done();
    //             }
    //         });
    //     });

    //     it("should return bet history when user request", async (done) => {
    //         // Arrange
    //         await new Promise((r) => setTimeout(r, WAITING_END_GAME_TIMEOUT));

    //         // Act
    //         gameClientDriver.sendGetHistoryEvent();

    //         // Assert
    //         gameClientDriver.handleGetHistoryEvent((betHistoryData) => {
    //             if (betHistoryData?.history) {
    //                 expect(betHistoryData.history.betLogs.length > 0).toBeTruthy();
    //                 done();
    //             }
    //         });
    //     });
    // });

    // describe("Unhappy Path Cases", () => {
    //     it("should return error when place bet failed", async (done) => {
    //         // Arrange
    //         const betChoice = "big";
    //         const amount = 100;
    //         const gameClientDriver = new GameClientDriver(socketOptions, initUserSession(errorUser));
    //         gameClientDriver.handleSignedInEvent(() => {
    //             gameClientDriver.sendInGameEvent();
    //         });

    //         // Act
    //         await gameClientDriver.sendBetEvent(betChoice, amount);

    //         // Assert
    //         gameClientDriver.handleEndBetEvent((endBetData) => {
    //             if (endBetData.endBet === -1) {
    //                 expect(endBetData.betChoice).toEqual("big");
    //                 expect(endBetData.apiError.errorCode).toEqual(3002);
    //                 expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
    //                 done();
    //                 gameClientDriver.close();
    //             }
    //         });
    //     });

    //     it("should return error when get internal server error from api", async (done) => {
    //         // Arrange
    //         const gameClientDriver = new GameClientDriver(socketOptions, initUserSession(internalServerErrorUser));
    //         gameClientDriver.handleSignedInEvent(() => {
    //             gameClientDriver.sendInGameEvent();
    //         });
    //         const betChoice = "big";
    //         const amount = 100;

    //         // Act
    //         await gameClientDriver.sendBetEvent(betChoice, amount);

    //         // Assert
    //         gameClientDriver.handleEndBetEvent((endBetData) => {
    //             if (endBetData.endBet === -1) {
    //                 expect(endBetData.betChoice).toEqual("big");
    //                 expect(endBetData.apiError.errorCode).toEqual("SB1900");
    //                 expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
    //                 done();
    //                 gameClientDriver.close();
    //             }
    //         });
    //     });
    // });
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
