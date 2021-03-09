const settlementRuleEntries = Object.entries({
    big: (totalPoints) => totalPoints > 10,
    small: (totalPoints) => totalPoints <= 10,
});

export const getSettlementResult = (roundResult) => {
    const totalPoints = Object.values(roundResult).reduce((accumulator, currentValue) => accumulator + currentValue);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(totalPoints);

        return result;
    }, {});
};
