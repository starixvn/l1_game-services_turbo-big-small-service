import Chance from "chance";
import Random from "random";
import { MersenneTwister19937, Random as RandomJS } from "random-js";
import { randomInt } from "crypto";

export const mathRandom = () => {
    return Math.random();
};

export const random1 = () => {
    return Math.floor(mathRandom() * 6) + 1;
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

export const random6 = () => {
    return randomInt(1, 7);
};

export const random7 = () => {
    const seed = Math.floor(mathRandom() * 100000);
    const randomJS = new RandomJS(MersenneTwister19937.seed(seed));
    return randomJS.integer(1, 6);
};

export const random8 = () => {
    const seeds = [
        Math.floor(mathRandom() * 10),
        Math.floor(mathRandom() * 100),
        Math.floor(mathRandom() * 1000),
        Math.floor(mathRandom() * 10000),
        Math.floor(mathRandom() * 100000),
    ];
    const randomJS = new RandomJS(MersenneTwister19937.seedWithArray(seeds));
    return randomJS.integer(1, 6);
};

export const randomModes = {
    1: [random1, random2, random3, random4, random5],
    2: [random1, random2, random3, random6, random7],
    3: [random4, random5, random6, random8],
};

export const random = (mode) => {
    const randomFunctions = randomModes[mode];
    const selectedRandomMethodIndex = Math.floor(mathRandom() * randomFunctions.length);
    const randomFunction = randomFunctions[selectedRandomMethodIndex];

    return randomFunction();
};
