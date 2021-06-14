import { Core } from "sc-game-base";
import { GameData } from "sc-pool-betting-game-base";

import appConfigs from "./app-configs";
import TurboBigSmallContainerRegistry from "./container-registry";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "./helpers/";

const run = async () => {
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new TurboBigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
