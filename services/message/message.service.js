import MessageRepository from "./message.repository.js";
import ResponseError from "../../utils/response-error.js";

export default class MessageService {

    static async sendMessage(data) {
        const response = await MessageRepository.sendMessage(data);
        return response;
    }

    static async getMessages() {
        const response = await MessageRepository.getMessages();
        return response;
    }

    static async getMessage(id) {
        const response = await MessageRepository.getMessage(id);
        if (!response) throw new ResponseError(404, "message not found");
        return response;
    }

    static async updateMessage(id, status) {
        const data = MessageRepository.getMessage(id);
        if (!data) throw new ResponseError(404, "message not found");
        const response = await MessageRepository.updateStatusMessage(id, status);
        return response;
    }

    static async deleteMessage(id){
        const data = MessageRepository.getMessage(id);
        if (!data) throw new ResponseError(404, "message not found");
        const response = await MessageRepository.deleteMessage(id);
        return response;
    }

}