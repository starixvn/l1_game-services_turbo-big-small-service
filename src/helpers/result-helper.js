import { random } from "./dice-random";

const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints > 10,
    small: (totalPoints) => totalPoints <= 10,
});

const resultSymbols = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅",
};

export const generateResult = () => {
    const dice1 = random();
    const dice2 = random();
    const dice3 = random();

    return { dice1, dice2, dice3 };
};

export const getSettlementResult = (roundResult) => {
    const totalPoints = Object.values(roundResult).reduce((accumulator, currentValue) => accumulator + currentValue);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};

export const generateRawResultForMd5 = (roundResult) => {
    return `{${resultSymbols[+roundResult.dice1]}${resultSymbols[+roundResult.dice2]}${resultSymbols[+roundResult.dice3]}}`;
};
