import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        dice1: { type: Number, required: true },
        dice2: { type: Number, required: true },
        dice3: { type: Number, required: true },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, require: true },
});

export const TurboBigSmallRounds = mongoose.model("TXTurbo_phien", Schema);
