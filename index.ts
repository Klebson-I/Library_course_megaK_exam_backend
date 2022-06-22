import * as express from 'express';
import * as cors from 'cors';
import {LoginRouter} from "./routes/LoginRouter";
import {UserRouter} from "./routes/UserRouter";
import {RegisterRouter} from "./routes/RegisterRouter";
import {TokenRouter} from "./routes/TokenRouter";

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use('/login', LoginRouter);
app.use('/user', UserRouter);
app.use('/register', RegisterRouter);
app.use('/token', TokenRouter);

app.listen(3001 || process.env.PORT, () => {
    console.log('App is running on http://localhost:3001');
})