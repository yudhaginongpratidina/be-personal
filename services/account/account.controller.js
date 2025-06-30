import AccountService from "./account.service.js";
import AccountValidation from "./account.validation.js";
import Validation from "../../utils/validation.js";

export default class AccountController {

    static async getAccount(req, res, next) {
        try {
            const token = req.token;
            const response = await AccountService.getAccount(token.id);
            return res.status(200).json({
                message: 'get account success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    
    static async updateInfo(req, res, next) {
        try {
            const token = req.token;
            const validation = await Validation.validate(AccountValidation.UPDATE_INFO, req.body);
            const response = await AccountService.updateInfo(token.id, validation.name);
            return res.status(200).json({
                message: 'update info success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    
    
    static async updatePassword(req, res, next) {
        try {
            const token = req.token;
            const validation = await Validation.validate(AccountValidation.UPDATE_PASSWORD, req.body);
            const response = await AccountService.updatePassword(token.id, validation.old_password, validation.new_password);
            return res.status(200).json({
                message: 'update password success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }


    static async deleteAccount(req, res, next) {
        try {
            const token = req.token;
            const validation = await Validation.validate(AccountValidation.DELETE_ACCOUNT, req.body);
            const response = await AccountService.deleteAccount(token.id, validation.password);
            return res.status(200).json({
                message: 'delete account success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

}