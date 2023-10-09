import { DEBUG } from "../../config/config";
import connection from "../../database/connection";
import { TokenModel, isTokenModelArray } from "../../models/auth_models/token.model";
import { UsersModel, isUsersModelArray } from "../../models/auth_models/users.model";
import { InternalError, NotFoundError, UnexpectedSchemaError } from "../../utils/errors";
import { isResultWithBigSerial } from "../../utils/knex-helper";

const TOKEN_TABLE = "token";
const TokenTable = () => connection()<TokenModel>(TOKEN_TABLE);
const USERS_TABLE = "users";
/*
 * Repository for Token CRUD Operations
 */
class TokenRepository {
    /**
     * Creates new Token Token
     */
    async createToken(id_user: string, token: string, jwt: string): Promise<string> {
        const insertResult = await TokenTable().insert({ id_user: id_user, token: token, jwt: jwt } as Partial<TokenModel>, "id");
        if (DEBUG) {
            // console.log("Inserted documents =>", insertResult);
        }
        if (isResultWithBigSerial(insertResult) && insertResult.length == 1) {
            return insertResult[0].id;
        }
        throw new InternalError("Token could not be created for unknown reason");
    }

    async getToken(TokenId: string): Promise<TokenModel> {
        const result = await TokenTable()
            .select()
            .from<TokenModel>(TOKEN_TABLE)
            .where({ id: TokenId } as Partial<TokenModel>);
        if (!isTokenModelArray(result)) {
            throw new UnexpectedSchemaError();
        }
        if (result.length > 0) {
            return result[0];
        }
        throw new NotFoundError();
    }

    async getTokenByUser(UserId: string): Promise<TokenModel> {
        const result = await TokenTable()
            .select()
            .from<TokenModel>(TOKEN_TABLE)
            .where({ id_user: UserId } as Partial<TokenModel>);
        if (!isTokenModelArray(result)) {
            throw new UnexpectedSchemaError();
        }
        if (result.length > 0) {
            return result[0];
        }
        throw new NotFoundError();
    }
    async getTokenByToken(token: string): Promise<TokenModel> {
        const result = await TokenTable()
            .select()
            .from<TokenModel>(TOKEN_TABLE)
            .where({ token: token } as Partial<TokenModel>);
        if (result.length > 0) {
            return result[0];
        }
        throw new NotFoundError();
    }
    async getTokenAndUserByToken(token: string): Promise<[TokenModel, UsersModel]> {
        return await connection().transaction(async (trx) => {
            const tokenResult = await trx
                .select()
                .from<TokenModel>(TOKEN_TABLE)
                .where({ token: token } as Partial<TokenModel>);
            // console.log("tokenResult", tokenResult);
            if (!isTokenModelArray(tokenResult)) {
                throw new UnexpectedSchemaError();
            }

            if (tokenResult.length <= 0) {
                throw new NotFoundError();
            }
            const tokenItem = tokenResult[0];

            const result = await trx
                .select()
                .from<UsersModel>(USERS_TABLE)
                .where({ id: tokenItem.id_user } as Partial<UsersModel>);
            if (!isUsersModelArray(result)) {
                throw new UnexpectedSchemaError();
            }

            if (result.length > 0) {
                return [tokenItem, result[0]];
            }
            throw new NotFoundError();
        });
    }
}

export default TokenRepository;
