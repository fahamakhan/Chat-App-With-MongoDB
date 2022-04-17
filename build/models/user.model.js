"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var shared_1 = require("../shared");
var enums_1 = require("./enums");
var constants_1 = require("./constants");
var UserSchema = new mongoose_1.Schema({
    role: { type: String, enum: enums_1.RoleValues, default: enums_1.Role.User },
    langPref: { type: String, enum: enums_1.LanguageValues, default: enums_1.Language.English },
    fullName: { type: String },
    userName: { type: String },
    email: { type: String, default: "", required: true },
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    updatedAt: { type: Date },
    password: { type: String },
});
;
UserSchema.statics.getSearchableField = function () {
    return [
        "fullName",
        "userName"
    ];
};
UserSchema.statics.getSearchableFields = function () {
    return [
        "_id",
        "role",
        "fullName",
        "username",
        "email"
    ];
};
UserSchema.statics.getClientFields = function () {
    return [
        "_id",
        "role",
        "_id",
        "role",
        "fullName",
        "userName",
        "email",
    ];
};
UserSchema.statics.getClientFieldsFilter = function () {
    return exports.User.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.statics.getSearchableFieldFilter = function () {
    return exports.User.getSearchableField().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.statics.getSearchableFieldsFilter = function () {
    return exports.User.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.methods.createUserJwt = function () {
    var user = this;
    return shared_1.createJwt({
        data: {
            role: user.role,
            userId: user._id,
        },
        maxAge: constants_1.JWT_EXPIRY_SECONDS
    });
};
UserSchema.methods.checkPassword = function (password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    return [4 /*yield*/, shared_1.checkPassword(password, user.password)];
                case 1:
                    isValid = _a.sent();
                    if (!isValid) return [3 /*break*/, 3];
                    return [4 /*yield*/, user.setPassword(password)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, isValid];
            }
        });
    });
};
UserSchema.methods.setPassword = function (password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = this;
                    _a = user;
                    return [4 /*yield*/, shared_1.hashPassword(password)];
                case 1:
                    _a.password = _b.sent();
                    return [4 /*yield*/, user.save()];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
UserSchema.statics.checkUserNameValidation = function (userName) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = new RegExp(/\s/g);
            isValid = !regexp.test(userName);
            return [2 /*return*/, isValid];
        });
    });
};
UserSchema.statics.checkEmailValidation = function (email) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            isValid = regexp.test(email);
            return [2 /*return*/, isValid];
        });
    });
};
exports.User = mongoose_1.default.model('User', UserSchema);
