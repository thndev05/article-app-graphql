import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT: number = 3000;

app.get('/articles', (req: Request, res: Response) => {
  res.json({
    articles: []
  })
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Articles API endpoints available at /articles`);
});