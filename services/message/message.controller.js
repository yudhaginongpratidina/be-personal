import MessageService from "./message.service.js";
import Validation from "../../utils/validation.js";
import MessageValidation from "./message.validation.js";

export default class MessageController {

    static async sendMessage(req, res, next) {
        try {
            const validation = await Validation.validate(MessageValidation.SEND_MESSAGE, req.body);
            const response = await MessageService.sendMessage(validation);
            return res.status(201).json({
                message: 'send message success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMessages(req, res, next) {
        try {
            const data = await MessageService.getMessages();
            const response = {
                message: 'get messages success',
                data : {
                    total : {
                        all : data.length,
                        pending : data.filter(item => item.status === 'PENDING').length,
                        read : data.filter(item => item.status === 'READ').length,
                        resolved : data.filter(item => item.status === 'RESOLVED').length
                    },
                    messages : {
                        pending : data.filter(item => item.status === 'PENDING'),
                        read : data.filter(item => item.status === 'READ'),
                        resolved : data.filter(item => item.status === 'RESOLVED')
                    }
                }
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getMessage(req, res, next) {
        try {
            const id = req.params.id;
            const response = await MessageService.getMessage(id);
            return res.status(200).json({
                message: 'get message success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatusMessage(req, res, next) {
        try {
            const id = req.params.id;
            const validation = await Validation.validate(MessageValidation.UPDATE_STATUS_MESSAGE, req.body);
            const response = await MessageService.updateMessage(id, validation.status);
            return res.status(200).json({
                message: 'update status message success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteMessage(req, res, next) {
        try {
            const id = req.params.id;
            const response = await MessageService.deleteMessage(id);
            return res.status(200).json({
                message: 'delete message success',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

}