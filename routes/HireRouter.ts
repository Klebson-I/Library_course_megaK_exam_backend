import {Request, Response, Router} from 'express';
import {evaluateDate} from "../utils/utils";
import {HireRecord} from "../record/HireRecord";

export const HireRouter = Router();

interface receiveData {
    user_id: string,
    book_id: string
}

HireRouter
    .post('/', async (req: Request, res: Response) => {
        try {
            const {user_id, book_id}: receiveData = req.body;
            const expire_date = evaluateDate();

            const hire = new HireRecord({
                user_id,
                book_id,
                expire_date
            })

            const hire_id = await hire.insert();
            res.status(200).json(hire_id);
        } catch (e) {
            console.log(e);
        }
    })