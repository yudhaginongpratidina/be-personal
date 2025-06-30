import AccountRepository from "./account.repository.js";
import ResponseError from "../../utils/response-error.js";
import { hashPassword, comparePassword } from "../../utils/password.js";

export default class AccountService {

    static async getAccount(id) {
        const response = await AccountRepository.getAccount(id);
        if (!response) throw new ResponseError(404, "user not found");
        return response;
    }

    static async updateInfo(id, name) {
        const response = await AccountRepository.updateInfo(id, name);
        if (!response) throw new ResponseError(404, "user not found");
        return response;
    }

    static async updatePassword(id, old_password, new_password) {
        const user = await AccountRepository.getAccount(id);
        if (!user) throw new ResponseError(404, "user not found");

        const password = await comparePassword(old_password, user.hash_password);
        if (!password) throw new ResponseError(401, "old password is wrong");

        const password_hash = await hashPassword(new_password);
        const response = await AccountRepository.updatePassword(id, password_hash);

        return response;
    }

    static async deleteAccount(id, password) {
        const user = await AccountRepository.getAccount(id);
        if (!user) throw new ResponseError(404, "user not found");

        const password_check = await comparePassword(password, user.hash_password);
        if (!password_check) throw new ResponseError(401, "password is wrong");

        const response = await AccountRepository.deleteAccount(id);
        return response;
    }

}