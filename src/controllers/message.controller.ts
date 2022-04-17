import mongoose, { Schema } from 'mongoose';
import { Message, IMessage } from '../models/message.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";

interface CreateMessageMessage {
    payload: {
        conversationId: string,
        sender: string,
        text: string,
    }
}

interface CreateOrUpdateMessageMessage {
    query: {
        search?: string
        id?: string
    },
    payload: {
        conversationId?: string,
        sender?: string,
        text?: string,

    }
}


export class MessageController {
    constructor() { }

    async get(search: string, type: SearchType, isId: boolean | undefined): Promise<IMessage[] | null> {
        let query = {};
        const filter = Message.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter)
            if (isId) {
                query['$or'] = searchableFields.map(field => {
                    return !type ? { [field]: mongoose.Types.ObjectId(search) } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
                })
            } else {
                query['$or'] = searchableFields.map(field => {
                    return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
                })
            }
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<IMessage | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateMessageMessage) {
        if (!payload.sender || !payload.conversationId) {
            throw new BadRequestError(`Validate fields sender and conversationId`, {
                message: `Requiered Fields sender and conversationId`,
            });
        }
        const data = new Message({
            ...payload
        });
        await data.save();
        return data;
    }

    async edit({ query, payload }: CreateOrUpdateMessageMessage) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var data = await this._findMessage(query.id);
        if (data === null) {
            throw new NotFoundError("Message not found", {
                message: 'Message not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: data._id };
        const result = await Message.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify: false
        }) as unknown as IMessage;
        if (result === null) {
            throw new BadRequestError('Message not edited correctly, Try to edit again', {
                message: 'Message not edited correctly, Try to edit again',
            });
        } else {
            return result;
        }
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var data = await this._findMessage(query.id);
        if (data === null) {
            throw new NotFoundError("Message not found", {
                message: 'Message not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        data = await Message.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false }) as unknown as IMessage;
        if (data === null) {
            throw new BadRequestError('Message not deleted correctly, Try to delete again', {
                message: 'Message not deleted correctly, Try to delete again',
            });
        } else {
            return data;
        }
    }

    async _findMessage(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Message.findOne(query);
    }

    async returnGetResponse(query): Promise<IMessage[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Message.aggregate([{
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
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async returnGetByResponse(query): Promise<any | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Message.aggregate([{
            $facet: {
                Message: [
                    { $match: query }
                ]
            }
        },
        {
            $project: {
                "Message": { $ifNull: [{ $arrayElemAt: ["$Message", 0] }, null] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new MessageController();
