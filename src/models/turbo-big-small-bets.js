import mongoose from "mongoose";

const betLog = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },

    thanhtoan: { type: Boolean, default: false },
    refund: { type: Number, default: 0 },
    win: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
};

const bet = {
    ...betLog,
    odds: { type: Object },
    totalAmount: { type: Number, default: 0 },
};

export const TurboBigSmallBets = mongoose.model("TXTurbo_one", new mongoose.Schema(bet));
export const TurboBigSmallBetLogs = mongoose.model("TXTurbo_cuoc", new mongoose.Schema(betLog));
