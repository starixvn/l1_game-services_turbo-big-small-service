import Chance from "chance";
import Random from "random";
import RandomJS from "random-js";

const random1 = () => {
    return Math.floor(Math.random() * 6) + 1;
};
const random2 = () => {
    const chance = new Chance();

    return chance.d6();
};

const random3 = () => {
    const chance = new Chance();

    return chance.integer({ min: 1, max: 6 });
};

const random4 = () => {
    return Random.int(1, 6);
};

const random5 = () => {
    const randomJS = new RandomJS.Random(MersenneTwister19937.autoSeed());

    return randomJS.integer(1, 6);
};

const randomFunctions = [random1, random2, random3, random4, random5];

export const random = () => {
    const selectedRandomMethodIndex = Math.floor(Math.random() * (randomFunctions.length - 1));
    const randomFunction = randomFunctions[selectedRandomMethodIndex];

    return randomFunction();
};
