import express, { type Request, type Response } from 'express';
import { z } from 'zod';

const app = express();
const PORT = 3000;

const RandomUserResponseSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    })
  ),
});

// GET route
app.get('/random-person', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();

    // Validate the data using Zod
    const parsedData = RandomUserResponseSchema.parse(data);
    
    const user = parsedData.results[0];

    res.json({
      fullName: `${user.name.first} ${user.name.last}`,
      country: user.location.country,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch or validate user data' });
  }
});

app.use(express.json());

const UserInputSchema = z.object({
  // Name 3-12 characters
  name: z.string().min(3).max(12),
  
  age: z.number().min(18).max(100).default(28),
  
  email: z.string().email().toLowerCase(),
});

// POST route
app.post('/users', (req: Request, res: Response) => {

    const result = UserInputSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.format(),
    });
  }

  res.status(201).json(result.data);
});

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});