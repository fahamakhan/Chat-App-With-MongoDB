import mongoose, { Schema } from 'mongoose';


const MessageSchema = new Schema({
    conversationId: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: { type: String },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IMessage extends mongoose.Document {
    conversationId: string,
    sender: string,
    text: string,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IMessageModel extends mongoose.Model<IMessage> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

MessageSchema.statics.getSearchableFields = function (): string[] {
    return [
        "_id",
        "conversationId",
        "sender",
        "text",
    ];
}

MessageSchema.statics.getClientFields = function (): string[] {
    return [
        "_id",
        "conversationId",
        "sender",
        "text",
        "deleted",
        "createdAt"
    ];
}
MessageSchema.statics.getClientFieldsFilter = function (): { [field: string]: true } {
    return Message.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
MessageSchema.statics.getSearchableFieldsFilter = function (): { [field: string]: true } {
    return Message.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Message = mongoose.model<IMessage, IMessageModel>('Message', MessageSchema);