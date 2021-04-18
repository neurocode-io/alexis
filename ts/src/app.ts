import express, { Response, Request } from 'express';

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hi');
});

export { app };
