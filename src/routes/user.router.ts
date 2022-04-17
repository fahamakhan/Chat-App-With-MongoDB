import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import userController, { UserController } from '../controllers/user.controller';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { Language, Role } from '../models/enums';
import { asyncWrap } from '../shared/async-wrap';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../errors';
import { me } from '../shared';
import { Pagination } from '../models/shared';


export class UserRouter {
    public router: express.Router;
    constructor(
        private userController: UserController
    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    public async getLoginUser(req, res) {
        const decodedToken = await me(req, res) as any;
        if (decodedToken === null) {
            res.status(401).send(new UnauthorizedError(`Invalid Token`, {
                message: `Invalid Token`,
                i18n: 'invalidToken'
            }));
        }
        return decodedToken.data;
    }




    private async get(req, res) {
        try {
            const user = await this.getLoginUser(req, res);
            const { search, role, type, sortKey } = req.query as any;
            const users = await this.userController.get(user, role, search, type, sortKey, await Pagination.pagination(req, 'U'));
            users === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(users);
        } catch (error: any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async getBy(req, res) {
        try {
            const tokenUser = await this.getLoginUser(req, res);
            const { search, role } = req.query as any;
            const user = await this.userController.getBy(tokenUser, role, search);
            user === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(user);
        } catch (error: any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private routes() {
        this.router.route("/get")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.get(req, res);
                }));

        this.router.route("/get-by")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.getBy(req, res);
                }));

        this.router.route("/create")
            .post(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const user = await this.userController.create({
                            payload: req.body
                        }, 'API');
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user
                        });
                    } catch (error: any) {
                        console.log({ error });
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/login")
            .post(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const { email, password } = req.body;
                        const search = email;
                        const user = await this.userController.login({ search, password });
                        res.json({
                            user
                        });
                    } catch (error: any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));
    }
}

export default new UserRouter(userController);