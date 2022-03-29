import mongoose from "mongoose";
import { Core } from "sc-game-base";

export const TurboBigSmallResults = mongoose.model("TXTurbo_results", Core.Models.ResultSchema);
