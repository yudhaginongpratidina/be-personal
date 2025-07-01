import db from "../../configs/db.js";

export default class MessageRepository {

    static async sendMessage(data) {
        return await db.message.create({
            data: {
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                message: data.message,
                status: 'PENDING'
            }
        });
    }

    static async getMessages() {
        return await db.message.findMany({
            select: {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                message: true,
                status: true,
                createdAt: true,
            }
        });
    }

    static async getMessage(id) {
        return await db.message.findUnique({
            where: { id },
            select: {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                message: true,
                status: true,
                createdAt: true,
            }
        });
    }

    static async updateStatusMessage(id, status) {
        return await db.message.update({
            where: { id },
            data: {
                status: status,
                updatedAt: new Date()
            },
            select: {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                message: true,
                status: true,
                updatedAt: true
            }
        });
    }

    static async deleteMessage(id) {
        return await db.message.delete({ where: { id } });
    }

}