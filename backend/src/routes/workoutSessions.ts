// expressパッケージからRouterを取り出す
// RouterはURLルール集を作る道具で、index.tsに差し込む形で使う
import { Router } from 'express';

// DBを操作するPrismaクライアントを取り込む
import prisma from '../lib/prisma';

// 認証がないのでユーザーIDを1に固定する
// ログイン機能を追加するときここを変える
const FIXED_USER_ID = 1;

// このファイル専用のURLルール集の入れ物を作る
const router = Router();

// GET /workout-sessions が来たときの処理（一覧取得）
router.get('/', async (_req, res) => {
// _reqは「リクエスト情報」だが今回は使わないので_をつけている
// resは「レスポンス（返事）」を制御するオブジェクト

  const sessions = await prisma.workoutSession.findMany({
  // workoutSessionテーブルから複数件取得する
  // awaitで非同期処理の完了を待ってからsessionsに代入する

    where: { userId: FIXED_USER_ID },
    // userId=1のデータだけに絞り込む条件

    orderBy: { date: 'desc' },
    // dateフィールドを基準に降順（新しい順）で並べる

    include: { workoutSets: { include: { exercise: true } } },
    // 関連するWorkoutSetとExerciseも一緒に取得する
    // これがないと「何kg何回やったか」「種目名は何か」が分からない
  });

  res.json(sessions);
  // 取得したデータをJSON形式に変換してクライアントへ返す
});

// POST /workout-sessions が来たときの処理（セッション作成）
router.post('/', async (req, res) => {

  const { date } = req.body;
  // reqはリクエスト情報全体、req.bodyはフロントが送ってきたJSONの中身
  // { date }はreq.bodyからdateだけを取り出す分割代入という書き方

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ message: 'date is required' });
  }
  // dateがない、または文字列でない場合は400（不正リクエスト）を返して終了
  // returnで以降の処理を止めることで不正データがDBに入るのを防ぐ

  const session = await prisma.workoutSession.create({
  // workoutSessionテーブルに新しいレコードを1件作る

    data: {
      userId: FIXED_USER_ID,
      // 固定ユーザーIDをセットする

      date: new Date(date),
      // "2026-08-05"のような文字列をJavaScriptのDate型に変換してセットする
    },
  });

  return res.status(201).json(session);
  // 201は「新しいデータを作成した成功」という意味（200は「単純な成功」）
  // 作成したセッションデータをJSONで返す
});

// POST /workout-sessions/:sessionId/sets が来たときの処理（セット追加）
// :sessionIdはURLの変数で /workout-sessions/1/sets の「1」が入る
router.post('/:sessionId/sets', async (req, res) => {

  const sessionId = Number(req.params.sessionId);
  // req.params.sessionIdでURLの:sessionId部分を取り出す
  // 文字列で来るのでNumber()で数値に変換する

  const { exerciseId, setNumber, weight, reps } = req.body;
  // req.bodyから4つの値をまとめて取り出す（分割代入）
  // exerciseId=種目ID、setNumber=何セット目、weight=重量、reps=回数

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return res.status(400).json({ message: 'sessionId must be a positive integer' });
  }
  // sessionIdが正の整数でなければ400を返す
  // /workout-sessions/abc/sets のような不正なURLを弾く

  if (!exerciseId || !setNumber || weight == null || !reps) {
    return res.status(400).json({ message: 'exerciseId, setNumber, weight, reps are required' });
  }
  // 必須4項目のどれかが欠けていたら400を返す
  // weight == null は「0kgは有効だが未入力は弾く」という意図（===ではなく==を使う理由）

  const session = await prisma.workoutSession.findFirst({
    where: { id: sessionId },
  });
  // セットを追加する前にそのセッションが実在するか確認する
  // 存在しないsessionIdにセットを作るとデータが宙に浮くため必ずチェックする

  if (!session) {
    return res.status(404).json({ message: 'session not found' });
  }
  // 404は「対象のデータが存在しない」という意味

  const workoutSet = await prisma.workoutSet.create({
  // workoutSetテーブルに新しいレコードを1件作る

    data: {
      sessionId,
      // sessionId: sessionId と同じ意味（変数名とキー名が同じときは省略できる）

      exerciseId: Number(exerciseId),
      setNumber: Number(setNumber),
      weight: Number(weight),
      reps: Number(reps),
      // req.bodyから来た値は文字列の場合があるのでNumber()で数値に変換する
    },
  });

  return res.status(201).json(workoutSet);
  // 作成したセットデータを201とともに返す
});

// このファイルのルール集をindex.tsから使えるように外に渡す
export default router;