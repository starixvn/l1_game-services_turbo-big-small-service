import { Core } from "sc-game-base";
import { initAPIStub } from "sc-game-service-integration-utils";
import { GameData } from "sc-pool-betting-game-base";

import appConfigs from "../../../src/app-configs";
import gameSettings from "../../../src/game-settings";
import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";
import TurboBigSmallContainerRegistry from "../../../src/turbo-big-small-container-registry";

const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new TurboBigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("TurboBigSmall", appConfigs);

    await app.run();
    await app.startGame(container);
};

run();
