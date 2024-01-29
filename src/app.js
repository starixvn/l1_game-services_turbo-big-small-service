import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { startTrace } from "sc-instrument";

startTrace(appConfigs.otel?.enabled, appConfigs.otel?.endpoint, appConfigs.otel?.system, appConfigs.sentry.env, gameSettings.name);

import { Core } from "sc-game-base";
import { GameData } from "sc-pool-betting-game-base";

import { generateRawResultForHash, generateResult, getSettlementResult } from "./helpers/";
import TurboBigSmallContainerRegistry from "./turbo-big-small-container-registry";

const run = async () => {
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const container = new TurboBigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("TurboBigSmall", appConfigs);

    await app.run();
    await app.startGame(container);
};

run();
