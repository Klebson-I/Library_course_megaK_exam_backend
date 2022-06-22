import {Request, Response, Router} from 'express';
import {BookRecord} from "../record/BookRecord";

export const BookRouter = Router();

BookRouter
    .get('/', async (req: Request, res: Response) => {
        const books = await BookRecord.getAll();
        res.json(books);
    })
    .get('/id/:id', async (req: Request, res: Response) => {
        const book = await BookRecord.getOne(req.params.id);
        res.json(book);
    })
    .get('/title/:title', async (req: Request, res: Response) => {
        const books = await BookRecord.getByTitle(req.params.title);
        res.json(books);
    })
