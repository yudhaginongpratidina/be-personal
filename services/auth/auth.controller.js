import AuthService from "./auth.service.js";
import AuthValidation from "./auth.validation.js";
import Validation from "../../utils/validation.js";

export default class AuthController {

    static async register(req, res, next) {
        try {
            const data = req.body
            const validation = await Validation.validate(AuthValidation.REGISTER, data);
            const response = await AuthService.register(validation);
            return res.status(201).json({message: 'create user success', data: response});
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const data = req.body
            const validation = await Validation.validate(AuthValidation.LOGIN, data);
            const response = await AuthService.login(validation);
            return res.status(200).json({message: 'login success', data: response});
        } catch (error) {
            next(error);
        }
    }

}