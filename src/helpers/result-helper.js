import { random } from "./dice-random";

const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints > 10,
    small: (totalPoints) => totalPoints <= 10,
});

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
