import { random } from "./dice-random";

const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints > 10,
    small: (totalPoints) => totalPoints <= 10,
});

export const generateResult = (mode) => {
    const selectedMode = mode >= 1 && mode <= 3 ? mode : 1;
    const dice1 = random(selectedMode);
    const dice2 = random(selectedMode);
    const dice3 = random(selectedMode);

    return { dice1, dice2, dice3 };
};

export const getSettlementResult = (roundResult) => {
    const totalPoints = Object.values(roundResult).reduce((accumulator, currentValue) => accumulator + currentValue);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};

export const generateRawResultForHash = (roundResult) => {
    return `{${+roundResult.dice1},${+roundResult.dice2},${+roundResult.dice3}}`;
};
