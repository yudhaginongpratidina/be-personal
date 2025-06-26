import db from "../../configs/db.js";

export default class AuthRepository {

    static async count_email_is_same(email) {
        return await db.user.count({ where: { email } });
    };

    static async register(data) {
        return await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                hash_password: data.password
            }
        });
    };

    static async login(email) {
        return await db.user.findUnique({ where: { email } });
    };

}