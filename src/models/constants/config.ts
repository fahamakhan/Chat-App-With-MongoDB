import { loadEnvs } from "../../shared";
import {
  EnvironmentName,
  EnvironmentNameValues,
} from "../enums/environment-name";

const getEnvironmentName = (NAME: string) => {
  switch (NAME) {
    case EnvironmentName.Production:
      return EnvironmentName.Production;
    case EnvironmentName.Stage:
      return EnvironmentName.Stage;
    case EnvironmentName.Test:
      return EnvironmentName.Test;
    case EnvironmentName.Local:
      return EnvironmentName.Local;
    default:
      throw new Error(
        "Invalid Environment Name given. Must be one of: " +
          EnvironmentNameValues
      );
  }
};

const configEnvs = loadEnvs(
  ["BCRYPT_SALT_ROUNDS", "BCRYPT_REHASH_DATE"],
  false
);

let BCRYPT_REHASH_DATE;
try {
  if (BCRYPT_REHASH_DATE)
    BCRYPT_REHASH_DATE = new Date(configEnvs["BCRYPT_REHASH_DATE"]);
} catch (e) {
  // logger.error(`BCRYPT_REHASH_DATE not a valid date: ${BCRYPT_REHASH_DATE}`);
}

export const CONFIG = {
  VIDEODIR: "videos",
  FILEDIR: "files",
  IMAGEDIR: "images",

  IMAGEURLNAME: "/static",
  MONGOOSEURI: 'mongodb://localhost:27017/chat-app',
  STATIC_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U",
  mutliGETRouteModules: [''],
  mutliPOSTRouteModules: [''],
};

