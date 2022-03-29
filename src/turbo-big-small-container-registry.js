import { asValue } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";

import { TurboBigSmallBetLogs, TurboBigSmallBets, TurboBigSmallResults, TurboBigSmallRounds } from "./models";

export default class TurboBigSmallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(TurboBigSmallRounds),
            betsRepository: asValue(TurboBigSmallBets),
            betLogsRepository: asValue(TurboBigSmallBetLogs),
            resultsRepository: asValue(TurboBigSmallResults),
        });
    }
}
