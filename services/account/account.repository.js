import db from "../../configs/db.js";

export default class AccountRepository {

    static async getAccount(id) {
        return await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                hash_password: true
            }
        });
    }

    static async updateInfo(id, name) {
        return await db.user.update({
            where: { id },
            data: {
                name: name,
                updatedAt: new Date()
            },
            select: {
                id: true,
                name: true,
                email: true,
                hash_password: true,
                updatedAt: true
            }
        });
    }

    static async updatePassword(id, hash_password) {
        return await db.user.update({
            where: { id },
            data: {
                hash_password: hash_password,
                updatedAt: new Date()
            },
            select: {
                id: true,
                name: true,
                email: true,
                hash_password: true,
                updatedAt: true
            }
        });
    }

    static async deleteAccount(id) {
        return await db.user.delete({ 
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                hash_password: true
            } 
        });
    }

}