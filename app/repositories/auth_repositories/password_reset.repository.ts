import { DEBUG } from "../../config/config";
import Logger from "../../config/logger";
import connection from "../../database/connection";
import { isPasswordResetsModelArray, PasswordResetsModel } from "../../models/auth_models/password_resets.model";
import { InternalError, NotFoundError, UnexpectedSchemaError } from "../../utils/errors";
import { isResultWithBigSerial } from "../../utils/knex-helper";

const PASSWORDRESETS_TABLE = "password_resets";
const PasswordResetsTable = () => connection()<PasswordResetsModel>(PASSWORDRESETS_TABLE);

/*
 * Repository for PasswordResets CRUD Operations
 */
class PasswordResetsRepository {
    /**
     * Creates new PasswordResets
     * @param item Item to create
     */
    async createPasswordResets(user_id: string, token: string): Promise<string> {
        const insertResult = await PasswordResetsTable().insert({ user_id: user_id, token: token } as Partial<PasswordResetsModel>, "id");
        if (DEBUG) {
            console.log("Inserted record =>", insertResult);
        }
        if (isResultWithBigSerial(insertResult) && insertResult.length === 1) {
            return insertResult[0].id;
        }
        throw new InternalError("PasswordResets could not be created for unknown reason");
    }

    async getPasswordResetsByToken(token: string): Promise<PasswordResetsModel> {
        Logger.info("startet getPasswordResetsByToken");
        const result = await PasswordResetsTable()
            .select()
            .from<PasswordResetsModel>(PASSWORDRESETS_TABLE)
            .where({ token: token } as Partial<PasswordResetsModel>);
        if (!isPasswordResetsModelArray(result)) {
            throw new UnexpectedSchemaError();
        }
        if (result.length === 1) {
            return result[0];
        }
        throw new NotFoundError();
    }
}

export default PasswordResetsRepository;
