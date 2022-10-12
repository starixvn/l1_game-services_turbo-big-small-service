import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";

import { initUserSession } from "./init-user-session";
import { socketOptions } from "./stubs/test-data";

export default function getHistoryTest() {
    describe("when user view bet history", () => {
        let driver;
        beforeAll((done) => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            driver.handleSignedInEvent(() => {
                done();
            });
        });

        afterAll(() => {
            driver.close();
        });

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
                    amount: 100,
                    baseAmount: 100,
                    choice: "small",
                    name: "NormalUser",
                    rate: 1,
                    betLogDetails: [],
                    roundId: 823211,
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
                    amount: 100,
                    baseAmount: 100,
                    choice: "big",
                    name: "NormalUser",
                    rate: 1,
                    betLogDetails: [],
                    roundId: 823211,
                },
            ];

            // Act
            driver.sendGetHistoryEvent();

            // Assert
            driver.handleGetHistoryEvent((betHistoryData) => {
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
}
