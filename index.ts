import * as express from 'express';

const app = express();

app.use(express.json());

app.listen(3001 || process.env.PORT, () => {
    console.log('App is running on https://localhost:3001');
})