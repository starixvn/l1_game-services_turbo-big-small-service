import mongoose from "mongoose";
import { Core } from "sc-game-base";

export const TurboBigSmallMD5s = mongoose.model("TXTurbo_md5s", Core.Models.MD5Schema);
