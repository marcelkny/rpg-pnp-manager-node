import { DEBUG } from "../../config/config";
import connection from "../../database/connection";
import { UsersModel, isUsersModelArray } from "../../models/auth_models/users.model";
import { InternalError, NotFoundError, UnexpectedSchemaError } from "../../utils/errors";
import { isResultWithBigSerial } from "../../utils/knex-helper";

const USERS_TABLE = "users";
const UsersTable = () => connection()<UsersModel>(USERS_TABLE);

/*
 * Repository for User CRUD Operations
 */
class UsersRepository {
    /**
     * Creates new User User
     * @param item Item to create
     */
    async createUser(email: string, password: string): Promise<string> {
        const insertResult = await UsersTable().insert({ email: email, password: password } as Partial<UsersModel>, "id");
        if (DEBUG) {
            console.log("Inserted record =>", insertResult);
        }
        if (isResultWithBigSerial(insertResult) && insertResult.length === 1) {
            return insertResult[0].id;
        }
        throw new InternalError("User could not be created for unknown reason");
    }

    async getUserById(id: string): Promise<UsersModel> {
        const result = await UsersTable()
            .select()
            .from<UsersModel>(USERS_TABLE)
            .where({ id: id } as Partial<UsersModel>);
        if (!isUsersModelArray(result)) {
            throw new UnexpectedSchemaError();
        }
        if (result.length === 1) {
            return result[0];
        }
        throw new NotFoundError();
    }

    async getUserByEMail(email: string): Promise<UsersModel> {
        const result = await UsersTable()
            .select()
            .from<UsersModel>(USERS_TABLE)
            .where({ email: email } as Partial<UsersModel>);
        if (!isUsersModelArray(result)) {
            throw new UnexpectedSchemaError();
        }
        if (result.length === 1) {
            return result[0];
        }
        throw new NotFoundError();
    }

    async updateUserPassword(id: string, pass: string) {
        const result = await UsersTable().where("id", "=", id).update({
            password: pass,
        });
        return result;
    }
    async updateUserName(id: string, value: string) {
        const result = await UsersTable().where("id", "=", id).update({
            username: value,
        });
        return result;
    }
    async updateUserMail(id: string, value: string) {
        const result = await UsersTable().where("id", "=", id).update({
            email: value,
        });
        return result;
    }
    async updateUserPass(id: string, value: string) {
        const result = await UsersTable().where("id", "=", id).update({
            password: value,
        });
        return result;
    }
}

export default UsersRepository;
