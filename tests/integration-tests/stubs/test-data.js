const game = {
    id: 4,
    name: "TXTurbo",
};

const currencyData = { code: "USD", name: "$US" };

const socketOptions = {
    socketUri: "http://localhost:5001/user/txturbo",
    gameName: game.name,
    proxyRoute: "/socket.io",
};

const gameConfig = {
    type: 0,
    name: "txturbo",
    minbet: 1,
    maxbet: 2000,
    minBet: 1,
    maxBet: 2000,
    odds: { big: 1.97, small: 1.97 },
    smartBotGroupRatio: 0.99,
    bot_maxbet: 1000000,
    botenabled: true,
};

const userBetData = (uid) => {
    return [
        {
            uid: uid,
            betwin: 0,
            currency: "$US",
            amount: 100,
            baseAmount: 100,
            baseBetWin: 0,
            baseRefund: 0,
            baseTotalWin: 0,
            choice: "big",
            playerId: 1,
            name: "NormalUser",
            rate: 1,
            siteId: "111",
            win: false,
            roundId: 823211,
            operatorId: "dummy-operator-id",
            paid: true,
        },
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            amount: 100,
            baseAmount: 100,
            baseBetWin: 0,
            baseRefund: 0,
            baseTotalWin: 0,
            choice: "small",
            playerId: 4,
            name: "NormalUser",
            rate: 1,
            siteId: "111",
            win: false,
            roundId: 823211,
            operatorId: "dummy-operator-id",
            paid: true,
        },
    ];
};

const rounds = [
    {
        id: 823209,
        result: { dice1: 1, dice2: 2, dice3: 6 },
        settlementResult: { big: false, small: true },
    },
    {
        id: 823210,
        result: { dice1: 4, dice2: 4, dice3: 1 },
        settlementResult: { big: false, small: true },
    },
    {
        id: 823211,
        result: { dice1: 1, dice2: 5, dice3: 3 },
        settlementResult: { big: false, small: true },
    },
];

const promotions = [
    {
        gameId: game.id,
        startDateTime: new Date(new Date().setSeconds(new Date().getSeconds() - 1)),
        endDateTime: new Date(new Date().setSeconds(new Date().getSeconds() + 40)),
        isDaily: false,
        odds: { big: 1.98, small: 1.98 },
        status: "enabled",
    },
];

export { game, currencyData, socketOptions, gameConfig, rounds, userBetData, promotions };
