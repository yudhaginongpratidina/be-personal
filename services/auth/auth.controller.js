import AuthService from "./auth.service.js";
import AuthValidation from "./auth.validation.js";
import Validation from "../../utils/validation.js";
import ResponseError from "../../utils/response-error.js";

export default class AuthController {

    static async register(req, res, next) {
        try {
            const data = req.body
            const validation = await Validation.validate(AuthValidation.REGISTER, data);
            const response = await AuthService.register(validation);
            return res.status(201).json({ message: 'create user success', data: response });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const data = req.body
            const validation = await Validation.validate(AuthValidation.LOGIN, data);
            const response = await AuthService.login(validation);

            const access_token = response.access_token;
            const refresh_token = response.refresh_token;

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            return res.status(200).json({ message: 'login success', token: access_token });
        } catch (error) {
            next(error);
        }
    }

    static async refresh_token(req, res, next) {
        try {
            const refresh_token = req.cookies.refresh_token;
            if (!refresh_token) { throw new ResponseError(401, 'refresh token required') }

            const response = await AuthService.refresh_token(refresh_token);
            return res.status(200).json({ message: 'refresh token success', token: response });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const refresh_token = req.cookies.refresh_token;
            if (!refresh_token) { throw new ResponseError(401, 'refresh token required') }

            res.clearCookie('refresh_token');
            res.json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }

}