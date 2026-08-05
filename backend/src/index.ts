// expressパッケージ本体を取り込む
// expressはNode.jsでWebサーバーを作るためのフレームワーク
import express from 'express';

// CORSミドルウェアを取り込む
// フロント(localhost:5173)からバック(localhost:3000)へのリクエストを許可するために必要
import cors from 'cors';

// 各機能のルーター（URLルール集）を取り込む
import menuGroupsRouter from './routes/menuGroups';
import exercisesRouter from './routes/exercises';
import workoutSessionsRouter from './routes/workoutSessions';

// expressアプリの本体を作る
const app = express();

// サーバーが待ち受けるポート番号
const PORT = 3000;

// CORSの設定：フロントのオリジン(localhost:5173)からのリクエストだけを許可する
// これがないとブラウザがAPIへのアクセスをブロックする
app.use(cors({ origin: 'http://localhost:5173' }));

// リクエストのbodyをJSONとして解析するミドルウェアを登録する
// これがないとreq.bodyが空になってしまう
app.use(express.json());

// GET /health が来たらサーバーの生存確認用レスポンスを返す
// reqはリクエスト情報、resはレスポンス制御用オブジェクト
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /menu-groups で始まるリクエストをmenuGroupsRouterに渡す
app.use('/menu-groups', menuGroupsRouter);

// /exercises で始まるリクエストをexercisesRouterに渡す
app.use('/exercises', exercisesRouter);

// /workout-sessions で始まるリクエストをworkoutSessionsRouterに渡す
app.use('/workout-sessions', workoutSessionsRouter);

// サーバーをPORTで起動して待ち受けを開始する
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
