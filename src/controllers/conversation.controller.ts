import mongoose, { Schema } from 'mongoose';
import { Conversation, IConversation } from '../models/conversation.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";

interface CreateConversationRequest {
    payload: {
        members: string[],

    }
}

interface CreateOrUpdateConversationRequest {
    query: {
        search?: string
        id?: string
    },
    payload: {
        members: string[],

    }
}


export class ConversationController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<IConversation[] | null> {
        let query = {};
        const filter = Conversation.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(userId: string, maulanaId: string): Promise<IConversation | null> {
        let query = [ userId, maulanaId ]
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateConversationRequest) {
        if (!payload.members) {
            throw new BadRequestError(`Validate fields members`, {
                Conversation: `Requiered Fields members`,
            });
        }
        const data = new Conversation({
            ...payload
        });
        await data.save();
        return data;
    }

    async edit({ query, payload }: CreateOrUpdateConversationRequest) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                Conversation: 'Id required',
            });
        }
        var data = await this._findConversation(query.id);
        if (data === null) {
            throw new NotFoundError("Conversation not found", {
                Conversation: 'Conversation not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: data._id };
        const result = await Conversation.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify: false
        }) as unknown as IConversation;
        if (result === null) {
            throw new BadRequestError('Conversation not edited correctly, Try to edit again', {
                Conversation: 'Conversation not edited correctly, Try to edit again',
            });
        } else {
            return result;
        }
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                Conversation: 'Id required',
            });
        }
        var data = await this._findConversation(query.id);
        if (data === null) {
            throw new NotFoundError("Conversation not found", {
                Conversation: 'Conversation not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        data = await Conversation.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false }) as unknown as IConversation;
        if (data === null) {
            throw new BadRequestError('Conversation not deleted correctly, Try to delete again', {
                Conversation: 'Conversation not deleted correctly, Try to delete again',
            });
        } else {
            return data;
        }
    }

    async _findConversation(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Conversation.findOne(query);
    }

    async returnGetResponse(query): Promise<IConversation[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Conversation.aggregate([{
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
        let data: any = await Conversation.find({members: {$all: query}})
        data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new ConversationController();
