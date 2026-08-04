import express from 'express';
import cors from 'cors';
import menuGroupsRouter  from './routes/menuGroups';
import exercisesRouter from './routes/exercises';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
  // 1. req を使って「どんな手紙（リクエスト）が届いたか」を確認できる
  // （今回は /health にアクセスがあったこと自体がトリガー）

  // 2. res.json(...) を使って「{ status: 'ok' } というデータをJSONにして返信する」
  res.json({ status: 'ok' });
});

app.use('/menu-groups', menuGroupsRouter);
app.use('/exercises', exercisesRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
