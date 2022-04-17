"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
var shared_1 = require("../../shared");
var environment_name_1 = require("../enums/environment-name");
var getEnvironmentName = function (NAME) {
    switch (NAME) {
        case environment_name_1.EnvironmentName.Production:
            return environment_name_1.EnvironmentName.Production;
        case environment_name_1.EnvironmentName.Stage:
            return environment_name_1.EnvironmentName.Stage;
        case environment_name_1.EnvironmentName.Test:
            return environment_name_1.EnvironmentName.Test;
        case environment_name_1.EnvironmentName.Local:
            return environment_name_1.EnvironmentName.Local;
        default:
            throw new Error("Invalid Environment Name given. Must be one of: " +
                environment_name_1.EnvironmentNameValues);
    }
};
var configEnvs = shared_1.loadEnvs(["BCRYPT_SALT_ROUNDS", "BCRYPT_REHASH_DATE"], false);
var BCRYPT_REHASH_DATE;
try {
    if (BCRYPT_REHASH_DATE)
        BCRYPT_REHASH_DATE = new Date(configEnvs["BCRYPT_REHASH_DATE"]);
}
catch (e) {
    // logger.error(`BCRYPT_REHASH_DATE not a valid date: ${BCRYPT_REHASH_DATE}`);
}
exports.CONFIG = {
    VIDEODIR: "videos",
    FILEDIR: "files",
    IMAGEDIR: "images",
    IMAGEURLNAME: "/static",
    MONGOOSEURI: 'mongodb://localhost:27017/chat-app',
    STATIC_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U",
    mutliGETRouteModules: [''],
    mutliPOSTRouteModules: [''],
};
