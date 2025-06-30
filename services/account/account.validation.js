import { z } from "zod";

export default class AccountValidation {
    static UPDATE_INFO = z.object({
        name: z
            .string()
            .nonempty('name is required')
            .min(3, 'name must be at least 3 characters long')
            .max(60, 'name must be at most 50 characters long'),
    });

    static UPDATE_PASSWORD = z.object({
        old_password: z
            .string()
            .nonempty('old password is required')
            .min(6, 'old password must be at least 6 characters long')
            .max(60, 'old password must be at most 20 characters long'),
        new_password: z
            .string()
            .nonempty('new password is required')
            .min(6, 'new password must be at least 6 characters long')
            .max(60, 'new password must be at most 20 characters long'),
        confirm_password: z
            .string()
            .nonempty('confirm password is required')
            .min(6, 'confirm password must be at least 6 characters long')
            .max(60, 'confirm password must be at most 20 characters long'),
    }).refine((data) => data.new_password === data.confirm_password, {
        message: 'passwords do not match',
        path: ['confirm_password'],
    });

    static DELETE_ACCOUNT = z.object({
        password: z
            .string()
            .nonempty({ message: 'Password is required' })
            .min(6, { message: 'Password must be at least 6 characters long' })
            .max(60, { message: 'Password must be at most 60 characters long' }),

        confirm_delete: z
            .string()
            .nonempty({ message: 'Confirm delete is required' }),
    }).refine((data) => data.confirm_delete === 'DELETE ACCOUNT', {
        message: 'Confirm delete must be "DELETE ACCOUNT"',
        path: ['confirm_delete'],
    });
}