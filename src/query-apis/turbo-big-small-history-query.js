import { Core } from "sc-game-base";

export class TurboBigSmallHistoryQuery extends Core.QueryApis.HistoryQuery {
    convertBet(bet) {
        if (bet.bet) {
            const convertedBet = {
                amount: bet.bet,
                choice: bet.select ? "big" : "small",
                refund: bet.tralai,
            };
            return { ...bet, ...convertedBet };
        }

        return bet;
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
