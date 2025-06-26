import { z } from "zod";

export default class AuthValidation {
    static REGISTER = z.object({
        name: z
            .string()
            .nonempty('name is required')
            .min(3, 'name must be at least 3 characters long')
            .max(60, 'name must be at most 50 characters long'),
        email: z
            .string()
            .email(),
        password: z
            .string()
            .nonempty('password is required')
            .min(6, 'password must be at least 6 characters long')
            .max(60, 'password must be at most 20 characters long'),
        confirm_password: z
            .string()
            .nonempty('password is required')
            .min(6, 'password must be at least 6 characters long')
            .max(60, 'Password must be at most 20 characters long'),
    }).refine((data) => data.password === data.confirm_password, {
        message: 'passwords do not match',
        path: ['confirm_password'],
    });

    static LOGIN = z.object({
        email: z
            .string()
            .email(),
        password: z
            .string()
            .nonempty('password is required')
            .min(6, 'password must be at least 6 characters long')
            .max(60, 'password must be at most 20 characters long'),
    });

}