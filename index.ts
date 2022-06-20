import * as express from 'express';
import * as cors from 'cors';
import {LoginRouter} from "./routes/LoginRouter";
import {UserRouter} from "./routes/UserRouter";

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use('/login', LoginRouter);
app.use('/user', UserRouter);

app.listen(3001 || process.env.PORT, () => {
    console.log('App is running on http://localhost:3001');
})