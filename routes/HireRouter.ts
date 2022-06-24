import {Request, Response, Router} from 'express';
import {changeBookAmount, evaluateDate} from "../utils/utils";
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

            if (hire_id) {
                await changeBookAmount(book_id);
                res.status(200).json(hire_id);
            } else {
                res.status(400).json(null);
            }

        } catch (e) {
            console.log(e);
        }
    })
    .get('/', async (req: Request, res: Response) => {
        const hires = await HireRecord.getAll();
        res.json(hires);
    })
    .get('/:id', async (req: Request, res: Response) => {
        const hires = await HireRecord.getAll();
        const userHires = hires.filter(hire => hire.user_id === req.params.id);
        res.json(userHires);
    })
    .get('/check/:user_id/:book_id', async (req: Request, res: Response) => {
        const haveBook = await HireRecord.checkIfUserHaveBook(req.params.user_id, req.params.book_id);
        res.json(haveBook);
    })
    .delete('/:id', async (req: Request, res: Response) => {
        const hire = await HireRecord.getOne(req.params.id);
        if (hire) {
            //@TODO add book amount +1 when someone gives it back
            await hire.delete();
            res.json(true);
        } else {
            res.json(false);
        }
    })