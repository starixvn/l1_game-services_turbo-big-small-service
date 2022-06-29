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
    minBet: 1,
    maxBet: 2000,
    odds: { big: 1.97, small: 1.97 },
};

const userBetData = (uid) => {
    return [
        {
            phien: 823211,
            uid: uid,
            betwin: 0,
            currency: "$US",
            amount: 100,
            baseAmount: 100,
            baseBetWin: 0,
            baseRefund: 0,
            baseTotalWin: 0,
            choice: "big",
            memberId: 1,
            name: "NormalUser",
            partnerId: "dummy-partner-id",
            rate: 1,
            siteId: "111",
            thanhtoan: true,
            win: false,

            roundId: 823211,
            operatorId: "dummy-partner-id",
            paid: true,
            playerId: 1,
        },
        {
            freeBet: false,
            phien: 823211,
            uid: uid,
            betwin: 0,
            currency: "$US",
            amount: 100,
            baseAmount: 100,
            baseBetWin: 0,
            baseRefund: 0,
            baseTotalWin: 0,
            choice: "small",
            memberId: 4,
            name: "NormalUser",
            partnerId: "dummy-partner-id",
            rate: 1,
            siteId: "111",
            thanhtoan: true,
            win: false,

            roundId: 823211,
            operatorId: "dummy-partner-id",
            paid: true,
            playerId: 4,
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

export { game, currencyData, socketOptions, gameConfig, rounds, userBetData };
