import express, { type Request, type Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});