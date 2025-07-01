import { z } from "zod";

export default class MessageValidation {

    static SEND_MESSAGE = z.object({
        full_name: z
            .string()
            .nonempty('full name is required')
            .min(3, 'full name must be at least 3 characters long')
            .max(60, 'full name must be at most 60 characters long'),
        email: z
            .string()
            .email(),
        phone: z
            .string()
            .optional(),
        message: z
            .string()
            .nonempty('message is required')
            .min(3, 'message must be at least 3 characters long')
            .max(1000, 'message must be at most 1000 characters long'),
    });

    static UPDATE_STATUS_MESSAGE = z.object({
        status: z.string()
    }).refine(data => ['PENDING', 'READ', 'RESOLVED'].includes(data.status), {
        message: 'Invalid status',
        path: ['status']
    });

}