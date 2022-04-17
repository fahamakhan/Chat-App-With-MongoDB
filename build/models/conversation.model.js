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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var ConversationSchema = new mongoose_1.Schema({
    members: [{ type: String }],
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
;
ConversationSchema.statics.getSearchableFields = function () {
    return [
        "_id",
        "members",
    ];
};
ConversationSchema.statics.getClientFields = function () {
    return [
        "_id",
        "members",
        "deleted",
        "createdAt"
    ];
};
ConversationSchema.statics.getClientFieldsFilter = function () {
    return exports.Conversation.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
ConversationSchema.statics.getSearchableFieldsFilter = function () {
    return exports.Conversation.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
exports.Conversation = mongoose_1.default.model('Conversation', ConversationSchema);
