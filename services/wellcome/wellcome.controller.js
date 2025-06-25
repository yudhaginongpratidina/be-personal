export default class WellcomeController {

    static index(req, res, next) {
        try {            
            return res.status(200).json({
                message: 'Success',
                data : {
                    name: 'backend personal',
                    version: '1.0.0',
                    developer: 'yudha ginong pratidina'
                }
            });
        } catch (error) {
            next(error);
        }
    }

}