import {Request, Response, Router} from "express";
import {HireRecord} from "../record/HireRecord";
import {evaluateDebtForBook, isExpire} from "../utils/utils";
import {HireFullEntityWithDebt} from "../utils/types";

export const DebtRouter = Router();

DebtRouter
    .get("/", async (req: Request, res: Response) => {
        const hires = await HireRecord.getAll();

        if (hires) {
            const hiresWithDebt = hires.map(hire => {
                return {
                    ...hire,
                    debt: isExpire(hire.expire_date) ? evaluateDebtForBook(hire) : 0
                } as HireFullEntityWithDebt
            })
            res.json(hiresWithDebt);
        } else {
            res.json(null);
        }

    })
    .get('/:id', async (req: Request, res: Response) => {
        const userHires = await HireRecord.getAll();
        if (userHires) {
            const userDebt = userHires
                .filter(hire => hire.user_id === req.params.id)
                .map(hire => isExpire(hire.expire_date) ? evaluateDebtForBook(hire) : 0)
                .reduce((prev, curr) => {
                    return prev + curr;
                }, 0)

            res.json(userDebt);
        } else {
            res.json(null);
        }
    })
    .get('/hire/:id', async (req: Request, res: Response) => {
        const hire = await HireRecord.getOne(req.params.id);
        if (hire) {
            const debt = isExpire(hire.expire_date) ? evaluateDebtForBook(hire) : 0;
            res.json(debt);
        } else {
            res.json(null);
        }
    })