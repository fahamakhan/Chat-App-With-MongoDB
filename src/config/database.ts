import mongoose from "mongoose";
import { CONFIG } from "../models/constants";

export class DBConnection {
  constructor() {}

  async connect() {
    // add async
    try {
      console.log("connected to mongo")
      await mongoose.connect(CONFIG.MONGOOSEURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {}
  }
}

export default new DBConnection();
