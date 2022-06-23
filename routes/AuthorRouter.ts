import {Request, Response, Router} from 'express';
import {AuthorRecord} from "../record/AuthorRecord";

export const AuthorRouter = Router();

AuthorRouter
    .get('/', async (req: Request, res: Response) => {
        const authors = await AuthorRecord.getAll();
        res.json(authors);
    })
    .get('/:id', async (req: Request, res: Response) => {
        const authors = await AuthorRecord.getOne(req.params.id);
        res.json(authors);
    })