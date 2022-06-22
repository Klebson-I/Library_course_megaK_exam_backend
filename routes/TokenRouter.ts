import {Request, Response, Router} from 'express';
import {createAdminToken} from "../utils/usersActions";

export const TokenRouter = Router();

TokenRouter
    .get('/', async (req: Request, res: Response) => {
        const tokenObject = createAdminToken();
        res.json(tokenObject);
    })