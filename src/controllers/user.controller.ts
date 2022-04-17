import mongoose, { Schema } from "mongoose";
import { User, IUser } from "../models/user.model";
import {
  UnauthorizedError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  ForbiddenError,
} from "../errors";
import { createJwt } from "../shared";
import {
  FileType,
  FileTypeValues,
  Gender,
  GenderValues,
  Role,
  RoleValues,
  SearchType,
  Sort,
  SortValues,
  StatusValues,
} from "../models/enums";
// controllers


interface CreateUserParams {
  payload: {
    role: Role;
    user_id?: string;
    fullName?: string;
    userName?: string;
    email?: string;
    password?: string;
  };
}

interface UserLoginParams {
    search: string,
    password: string,
}

export class UserController {
  constructor() { }

  async returnGetResponse(
    query,
    role: any,
    sortKey,
    pageOptions
  ): Promise<IUser[] | null> {
    var sort = { createdAt: -1 } as any;
    if (sortKey) {
      const index = await SortValues.indexOf(sortKey);
      if (index === -1) {
        throw new BadRequestError(
          `Enter valid sorting options, Should be in ${SortValues}`,
          {
            message: `Enter valid sorting options, Should be in ${SortValues}`,
          }
        );
      }
      if (sortKey === Sort.ALPHA) {
        sort = { fullName: 1 };
      } else if (sortKey === Sort.DESC) {
        sort = { createdAt: 1 };
      }
    }
    if (role && role !== "") {
      query = { $and: [{ role: role }, query] };
    }
    query = { $and: [{ deleted: false }, query] };
    let data = await User.aggregate([
      {
        $facet: {
          paginatedResult: [
            { $match: query },
            { $sort: sort },
            { $skip: pageOptions.limit * pageOptions.page - pageOptions.limit },
            { $limit: pageOptions.limit },
            {
              $project: {
                passwordResetToken: 0,
                passwordUpdated: 0,
                password: 0,
              },
            },
          ],
          totalCount: [{ $match: query }, { $count: "totalCount" }],
        },
      },
      {
        $project: {
          paginatedResult: "$paginatedResult",
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0],
          },
        },
      },
    ]);
    data = data.length > 0 ? data[0] : null;
    return data;
  }

  async returnGetByResponse(query, role: any): Promise<any | null> {
    if (role && role !== "") {
      query = { $and: [{ role: role }, query] };
    }
    query = { $and: [{ deleted: false }, query] };
    let data = await User.aggregate([
      {
        $facet: {
          user: [
            { $match: query },
            {
              $project: {
                passwordResetToken: 0,
                passwordUpdated: 0,
                password: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          user: { $ifNull: [{ $arrayElemAt: ["$user", 0] }, null] },
        },
      },
    ]);
    data = data.length > 0 ? data[0] : null;
    return data;
  }

  async get(
    user: any,
    role: Role,
    search: string,
    type: SearchType,
    sortKey: Sort,
    pageOptions
  ): Promise<IUser[] | null> {
    let query = {};
    if (user && user.role !== Role.Admin && role !== Role.SuperAdmin) {
      query = {
        $and: [
          { role: { $ne: Role.SuperAdmin } },
          { role: { $ne: Role.Admin } },
          query,
        ],
      };
    }
    const filter = User.getSearchableFieldsFilter();
    if (search !== undefined && search !== "" && typeof search === "string") {
      const searchRegExp = new RegExp(search.split(" ").join("|"), "ig");
      const searchableFields = Object.keys(filter).filter((f) => f !== "_id");
      query["$or"] = searchableFields.map((field) => {
        return !type
          ? { [field]: search }
          : type === SearchType.Multi
            ? { [field]: searchRegExp }
            : { [field]: search };
      });
    }
    return this.returnGetResponse(query, role, sortKey, pageOptions);
  }

  async getBy(user: any, role: Role, search: string): Promise<IUser | null> {
    let query = {} as any;
    if (search && search !== "") {
      query = { _id: search };
    }
    return await this.returnGetByResponse(query, role);
  }

  async me(id: string): Promise<IUser | null> {
    return await User.findById({ _id: id },'-password -passwordResetToken -passwordUpdated -deleted')
      // .populate("wishList");
  }

  async create({ payload }: CreateUserParams, from: any) {

    if (
      payload.role === Role.Admin ||
      (!payload.email && !payload.userName)
    ) {
      throw new BadRequestError(
        `Required fileds (email or user name).`,
        {
          message: `Required fileds (email or user name)`,
        }
      );
    }
    if (from === "API" && (!payload.password)) {
      throw new BadRequestError(`Required fileds (password)`, {
        message: `Required fileds (password)`,
      });
    }
    if (payload.email) {
      payload.email = payload.email.toLocaleLowerCase();
      const isUnique = await this.emailIsUnique(payload.email);
      if (isUnique === false) {
        throw new BadRequestError("Cannot create user, email already in use", {
          message: "Cannot create user, email already in use",
          payload,
        });
      }
    }
    if (payload.userName) {
      payload.userName = payload.userName.toLocaleLowerCase();
      const isUnique = await this.userNameIsUnique(payload.userName);
      if (isUnique === false) {
        throw new BadRequestError(
          "Cannot create user, user name already in use",
          {
            message: "Cannot create user, user name already in use",
            payload,
          }
        );
      }
    }
    const user = new User({
      ...payload,
    });
    await user.save();
    var access_token = "";
    if (user) {
      if (payload.password) {
        const setPassword = await user.setPassword(payload.password);
      }
      access_token = await createJwt({
        data: {
          role: user.role,
          userId: user._id,
          
        },
      });
    }

    return {
      access_token,
      fullName: user.fullName,
      role: user.role,
      userId: user._id,
      langPref: user.langPref,
    };
  }

  async login({ search, password }: UserLoginParams) {
    if (!search) {
        throw new BadRequestError('Email or User Name required', {
            message: 'Email or User Name required',
        });
    }
    if (!password) {
        throw new BadRequestError('Password required', {
            message: 'Password required',
        });
    }
    const user = await this.findUser(search.toLocaleLowerCase());
    if (user === null) {
        throw new UnauthorizedError("Invalid user", {
            message: 'Invalid user',
        });
    }
    if (user.deactivated === true) {
        throw new ForbiddenError("Account Deactivated", {
            message: 'Account Deactivated',
        });
    }
    if (!(await user.checkPassword(password))) {
        throw new UnauthorizedError("Invalid password", {
            message: 'Invalid password',
        });
    }
    const access_token = await createJwt({
        data: {
            role: user.role,
            userId: user._id
        }
    });
    return {
        access_token,
        fullName: user.fullName,
        role: user.role,
        userId: user._id,
    };
}

  async _findUser(search: string) {
    const query = {
      $or: [
        { _id: search },
        { email: search },
        { userName: search },
      ],
    };
    return await User.findOne(query);
  }

  async findUser(search: string) {
    const query = { $or: [{ email: search }, { userName: search }] };
    return await User.findOne(query);
  }


  async phoneIsUnique(phone: string) {
    return (await User.findOne({ phone })) === null;
  }

  async emailIsUnique(email: string) {
    const isValidEmail = await User.checkEmailValidation(email);
    if (isValidEmail === false) {
      throw new BadRequestError(
        "Cannot create user, email format is not valid",
        {
          message: "Cannot create user, email format is not valid",
        }
      );
    }
    return (await User.findOne({ email })) === null;
  }

  async userNameIsUnique(userName: string) {
    const isValidUserName = await User.checkUserNameValidation(userName);
    if (isValidUserName === false) {
      throw new BadRequestError(
        "Cannot create user, user name format or remove space is not valid",
        {
          message:
            "Cannot create user, user name format or remove space is not valid",
        }
      );
    }
    return (await User.findOne({ userName })) === null;
  }
}

export default new UserController();
