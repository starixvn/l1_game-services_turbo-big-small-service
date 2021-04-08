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

    convertBetLogs(betLogs) {
        return betLogs.map((betLog) => {
            if (betLog.bet) {
                const convertedBet = {
                    amount: betLog.bet,
                    choice: betLog.select ? "big" : "small",
                    refund: betLog.tralai,
                };
                return { ...betLog, ...convertedBet };
            }

            return betLog;
        });
    }
}
