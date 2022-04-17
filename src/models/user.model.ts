import mongoose, { Schema } from 'mongoose';

import { createJwt, hashPassword, checkPassword } from '../shared';
import { Role, RoleValues, Language, LanguageValues } from './enums';
import { JWT_EXPIRY_SECONDS } from './constants';

const UserSchema = new Schema({
    role: { type: String, enum: RoleValues, default: Role.User },
    langPref: { type: String, enum: LanguageValues, default: Language.English },

    fullName: { type: String },
    userName: { type: String },
    email: { type: String, default: "", required: true },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    updatedAt: { type: Date },
    password: { type: String },

});

export interface IUser extends mongoose.Document {
    langPref: Language,
    role: Role,

    fullName: string,
    userName: string,
    email: string,


    deleted: boolean,
    deactivated: boolean,
    updatedAt: Date,
    password: string,


    checkPassword: (password: string) => Promise<boolean>,
    setPassword: (password: string) => Promise<void>,
    createUserJwt: () => string,
    createPasswordResetToken: () => Promise<string>,
    verifyPasswordResetToken: (token: number) => boolean
};

export interface IUserModel extends mongoose.Model<IUser> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableField: () => string[];
    getSearchableFieldFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
    checkUserNameValidation: (field: string) => boolean;
    checkEmailValidation: (field: string) => boolean;
    checkDateValidation: (field: string) => boolean;
    compareDates: (field_1: string, field_2: string) => boolean;
    checkPhoneValidation: (field: string) => boolean;
    // checkPhoneValidation: (field: string) => boolean;
    // sendVerificationCode: (field: string) => boolean;
    // codeVerify: (field: string, code: string) => boolean;	
}

UserSchema.statics.getSearchableField = function (): string[] {
    return [
        "fullName",
        "userName"
    ];
}
UserSchema.statics.getSearchableFields = function (): string[] {
    return [
        "_id",
        "role",
        "fullName",
        "username",
        "email"
    ];
}
UserSchema.statics.getClientFields = function (): string[] {
    return [
        "_id",
        "role",
        "_id",
        "role",
        "fullName",
        "userName",
        "email",
    ];
}
UserSchema.statics.getClientFieldsFilter = function (): { [field: string]: true } {
    return User.getClientFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}
UserSchema.statics.getSearchableFieldFilter = function (): { [field: string]: true } {
    return User.getSearchableField().reduce((map: any, el) => { map[el] = true; return map }, {});
}
UserSchema.statics.getSearchableFieldsFilter = function (): { [field: string]: true } {
    return User.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

UserSchema.methods.createUserJwt = function () {
    const user = (<IUser>this);
    return createJwt({
        data: {
            role: user.role,
            userId: user._id,
        },
        maxAge: JWT_EXPIRY_SECONDS
    });
};
UserSchema.methods.checkPassword = async function (password: string) {
    const user = (<IUser>this)
    const isValid = await checkPassword(password, user.password);
    if (isValid) { 
        await user.setPassword(password);
    }
    return isValid;
};
UserSchema.methods.setPassword = async function (password: string) {
    const user = (<IUser>this)
    user.password = await hashPassword(password);
    return await user.save();
};

UserSchema.statics.checkUserNameValidation = async function (userName: string) {
    var isValid = false;
    const regexp = new RegExp(/\s/g);
    isValid = !regexp.test(userName);
    return isValid;
};
UserSchema.statics.checkEmailValidation = async function (email: string) {
    var isValid = false;
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    isValid = regexp.test(email);
    return isValid;
};

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);