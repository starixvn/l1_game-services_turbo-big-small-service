import { RoundQuery } from "sc-pool-betting-game-base";

import { getSettlementResult } from "../settlement-rule";

export class TurboBigSmallRoundQuery extends RoundQuery {
    convertSettlementResult(roundResult) {
        return getSettlementResult(roundResult);
    }

    convertResult(round) {
        return {
            dice1: round.dice1,
            dice2: round.dice2,
            dice3: round.dice3,
        };
    }
}
