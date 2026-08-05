// expressからRouterを取り出す
import { Router } from 'express';

// DB操作用のPrismaクライアントを取り込む
import prisma from '../lib/prisma';

// このファイル専用のURLルール集の入れ物を作る
const router = Router();

// GET /exercises が来たときの処理（一覧取得）
router.get('/', async (_req, res) => {
  const exercises = await prisma.exercise.findMany({
    where: { deletedAt: null },
    // deletedAtがnullのもの=論理削除されていないものだけ取得する
    orderBy: { id: 'asc' },
    // id昇順（作成順）で並べる
  });
  res.json(exercises);
  // 取得したデータをJSONでフロントに返す
});

// POST /exercises が来たときの処理（新規作成）
router.post('/', async (req, res) => {
  const { name } = req.body;
  // req.bodyからnameを取り出す（分割代入）

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }
  // nameがない、または文字列でなければ400を返して終了する

  const trimmedName = name.trim();
  // 前後の空白を除去する

  if (trimmedName.length === 0) {
    return res.status(400).json({ message: 'name must not be empty' });
  }
  // 空白だけの文字列も弾く

  const exercise = await prisma.exercise.create({
    data: {
      name: trimmedName,
      // 空白除去済みの名前をセットする
    },
  });

  return res.status(201).json(exercise);
  // 201（作成成功）とともに作成したデータを返す
});

// PATCH /exercises/:id が来たときの処理（名前更新）
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  // URLの:id部分を数値に変換して取り出す
  const { name } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return res.status(400).json({ message: 'name must not be empty' });
  }

  const existing = await prisma.exercise.findFirst({
    where: { id, deletedAt: null },
  });
  // 指定IDが存在するか、かつ論理削除されていないかを確認する

  if (!existing) {
    return res.status(404).json({ message: 'exercise not found' });
  }
  // 見つからなければ404を返す

  const updated = await prisma.exercise.update({
    where: { id },
    data: { name: trimmedName },
  });
  // DBの名前を更新する

  return res.json(updated);
  // 更新後のデータをJSONで返す
});

// DELETE /exercises/:id が来たときの処理（論理削除）
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  // URLの:id部分を数値に変換して取り出す

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  const existing = await prisma.exercise.findFirst({
    where: { id, deletedAt: null },
  });
  // 未削除のデータが存在するか確認する

  if (!existing) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  await prisma.exercise.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  // deletedAtに現在時刻を入れて「削除済み」状態にする（論理削除）

  return res.status(204).send();
  // 204（成功だが返すデータなし）を返す
});

// このファイルのルール集をindex.tsから使えるように公開する
export default router;