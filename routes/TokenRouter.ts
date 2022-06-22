import {Request, Response, Router} from 'express';
import {createAdminToken} from "../utils/usersActions";

export const TokenRouter = Router();

TokenRouter
    .get('/', async (req: Request, res: Response) => {
        const tokenObject = await createAdminToken();
        res.json(tokenObject);
    })