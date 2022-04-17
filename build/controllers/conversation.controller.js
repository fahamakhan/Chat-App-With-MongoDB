"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var conversation_model_1 = require("../models/conversation.model");
var enums_1 = require("../models/enums");
var errors_1 = require("../errors");
var ConversationController = /** @class */ (function () {
    function ConversationController() {
    }
    ConversationController.prototype.get = function (search, type) {
        return __awaiter(this, void 0, void 0, function () {
            var query, filter, searchRegExp_1, searchableFields;
            return __generator(this, function (_a) {
                query = {};
                filter = conversation_model_1.Conversation.getSearchableFieldsFilter();
                if (search !== undefined && typeof search === 'string') {
                    searchRegExp_1 = new RegExp(search.split(' ').join('|'), 'ig');
                    searchableFields = Object.keys(filter).filter(function (f) { return f !== "_id"; });
                    query['$or'] = searchableFields.map(function (field) {
                        var _a, _b, _c;
                        return !type ? (_a = {}, _a[field] = search, _a) : type === enums_1.SearchType.Multi ? (_b = {}, _b[field] = searchRegExp_1, _b) : (_c = {}, _c[field] = search, _c);
                    });
                }
                return [2 /*return*/, this.returnGetResponse(query)];
            });
        });
    };
    ConversationController.prototype.getBy = function (userId, maulanaId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = [userId, maulanaId];
                        return [4 /*yield*/, this.returnGetByResponse(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConversationController.prototype.create = function (_a) {
        var payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!payload.members) {
                            throw new errors_1.BadRequestError("Validate fields members", {
                                Conversation: "Requiered Fields members",
                            });
                        }
                        data = new conversation_model_1.Conversation(__assign({}, payload));
                        return [4 /*yield*/, data.save()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ConversationController.prototype.edit = function (_a) {
        var query = _a.query, payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var data, updateDoc, _query, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!query.id) {
                            throw new errors_1.BadRequestError('Id required', {
                                Conversation: 'Id required',
                            });
                        }
                        return [4 /*yield*/, this._findConversation(query.id)];
                    case 1:
                        data = _b.sent();
                        if (data === null) {
                            throw new errors_1.NotFoundError("Conversation not found", {
                                Conversation: 'Conversation not found',
                                i18n: 'notFound'
                            });
                        }
                        updateDoc = __assign({}, payload);
                        _query = { _id: data._id };
                        return [4 /*yield*/, conversation_model_1.Conversation.findOneAndUpdate(_query, updateDoc, {
                                upsert: true, new: true, useFindAndModify: false
                            })];
                    case 2:
                        result = _b.sent();
                        if (result === null) {
                            throw new errors_1.BadRequestError('Conversation not edited correctly, Try to edit again', {
                                Conversation: 'Conversation not edited correctly, Try to edit again',
                            });
                        }
                        else {
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ConversationController.prototype.delete = function (_a) {
        var query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var data, _query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!query.id) {
                            throw new errors_1.BadRequestError('Id required', {
                                Conversation: 'Id required',
                            });
                        }
                        return [4 /*yield*/, this._findConversation(query.id)];
                    case 1:
                        data = _b.sent();
                        if (data === null) {
                            throw new errors_1.NotFoundError("Conversation not found", {
                                Conversation: 'Conversation not found',
                                i18n: 'notFound'
                            });
                        }
                        _query = { _id: query.id };
                        return [4 /*yield*/, conversation_model_1.Conversation.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false })];
                    case 2:
                        data = (_b.sent());
                        if (data === null) {
                            throw new errors_1.BadRequestError('Conversation not deleted correctly, Try to delete again', {
                                Conversation: 'Conversation not deleted correctly, Try to delete again',
                            });
                        }
                        else {
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ConversationController.prototype._findConversation = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ '_id': mongoose_1.default.Types.ObjectId(search) }] };
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, conversation_model_1.Conversation.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConversationController.prototype.returnGetResponse = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, conversation_model_1.Conversation.aggregate([{
                                    $facet: {
                                        paginatedResult: [
                                            { $match: query },
                                            { $sort: { category: 1 } },
                                        ],
                                        totalCount: [
                                            { $match: query },
                                            { $count: 'totalCount' }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        "result": "$paginatedResult",
                                        "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
                                    }
                                }])];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : null;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ConversationController.prototype.returnGetByResponse = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, conversation_model_1.Conversation.find({ members: { $all: query } })];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : null;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return ConversationController;
}());
exports.ConversationController = ConversationController;
exports.default = new ConversationController();
