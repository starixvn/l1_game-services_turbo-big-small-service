import Chance from "chance";
import Random from "random";
import { MersenneTwister19937, Random as RandomJS } from "random-js";

export const random1 = () => {
    return Math.floor(Math.random() * 6) + 1;
};
export const random2 = () => {
    const chance = new Chance();
    return chance.d6();
};

export const random3 = () => {
    const chance = new Chance();
    return chance.integer({ min: 1, max: 6 });
};

export const random4 = () => {
    return Random.int(1, 6);
};

export const random5 = () => {
    const randomJS = new RandomJS(MersenneTwister19937.autoSeed());

    return randomJS.integer(1, 6);
};

const randomFunctions = [random1, random2, random3, random4, random5];

export const random = () => {
    const selectedRandomMethodIndex = Math.floor(Math.random() * (randomFunctions.length - 1));
    const randomFunction = randomFunctions[selectedRandomMethodIndex];

    return randomFunction();
};
