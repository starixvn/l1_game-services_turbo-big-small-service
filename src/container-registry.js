import { asClass, asValue } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";

import { TurboBigSmallBetLogs, TurboBigSmallBets, TurboBigSmallRounds } from "./models";
import { TurboBigSmallRoundQuery } from "./query-apis";

export default class TurboBigSmallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(TurboBigSmallRounds),
            betsRepository: asValue(TurboBigSmallBets),
            betLogsRepository: asValue(TurboBigSmallBetLogs),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            roundQuery: asClass(TurboBigSmallRoundQuery).singleton(),
        });
    }
}
