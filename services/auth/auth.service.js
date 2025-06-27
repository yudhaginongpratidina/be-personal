import AuthRepository from "./auth.repository.js";
import ResponseError from "../../utils/response-error.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateToken, refreshAccessToken } from "../../utils/jwt.js";

export default class AuthService {

    static async register(data) {
        const count_email_is_same = await AuthRepository.count_email_is_same(data.email);
        if (count_email_is_same > 0) throw new ResponseError(409, "email already exists");

        const password = await hashPassword(data.password);
        data.password = password;

        const response = await AuthRepository.register(data);
        return response;
    }


    static async login(data) {
        const find = await AuthRepository.login(data.email);
        if (!find) throw new ResponseError(404, "user not found");

        const password = await comparePassword(data.password, find.hash_password);
        if (!password) throw new ResponseError(401, "invalid password");

        const response = await generateToken(find.id, find.name, find.email);
        return response;
    }

    static async refresh_token(refreshToken) {
        const token = await refreshAccessToken(refreshToken);
        const response = token.access_token;
        return response;
    }

}