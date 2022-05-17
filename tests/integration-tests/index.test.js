import getHistoryTest from "./get-history.test";
import inGameTest from "./in-game.test";
import placeBetTest from "./place-bet.test";
import { startServiceProcess, startSetupDataProcess } from "./stubs/test-jobs";

let processStartService;

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 70000;

beforeAll((done) => {
    jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    startSetupDataProcess(() => {
        console.log("start service");
        processStartService = startServiceProcess(() => {
            console.log("start service successfully");
            setTimeout(() => {
                console.log("start tests");
                done();
            }, 15000);
        });
    });
});

afterAll(() => {
    processStartService.stdin.pause();
    processStartService.kill();
});

inGameTest();
getHistoryTest();
placeBetTest();
