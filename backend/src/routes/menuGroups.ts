// expressからRouterを取り出す
import { Router } from 'express';

// DB操作用のPrismaクライアントを取り込む
import prisma from '../lib/prisma';

// 認証がないのでユーザーIDを1に固定する
const FIXED_USER_ID = 1;

// このファイル専用のURLルール集の入れ物を作る
const router = Router();

// GET /menu-groups が来たときの処理（一覧取得）
router.get('/', async (_req, res) => {
  const menuGroups = await prisma.menuGroup.findMany({
    where: { deletedAt: null },
    // deletedAtがnullのもの=論理削除されていないものだけ取得する
    orderBy: { id: 'asc' },
    // id昇順（作成順）で並べる
  });
  res.json(menuGroups);
  // 取得したデータをJSONでフロントに返す
});

// POST /menu-groups が来たときの処理（新規作成）
router.post('/', async (req, res) => {
  const { name } = req.body;
  // req.bodyからnameを取り出す（分割代入）

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }
  // nameがない、または文字列でなければ400を返して終了する

  const trimmedName = name.trim();
  // 前後の空白を除去する（例: " 上半身 " → "上半身"）

  if (trimmedName.length === 0) {
    return res.status(400).json({ message: 'name must not be empty' });
  }
  // 空白だけの文字列も弾く

  const menuGroup = await prisma.menuGroup.create({
    data: {
      userId: FIXED_USER_ID,
      // 固定ユーザーIDをセットする
      name: trimmedName,
      // 空白除去済みの名前をセットする
    },
  });

  return res.status(201).json(menuGroup);
  // 201（作成成功）とともに作成したデータを返す
});

// PATCH /menu-groups/:id が来たときの処理（名前更新）
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  // URLの:id部分を数値に変換して取り出す
  const { name } = req.body;
  // req.bodyから新しい名前を取り出す

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }
  // idが正の整数でなければ400を返す

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return res.status(400).json({ message: 'name must not be empty' });
  }

  const existing = await prisma.menuGroup.findFirst({
    where: { id, deletedAt: null },
  });
  // 指定IDが存在するか、かつ論理削除されていないかを確認する

  if (!existing) {
    return res.status(404).json({ message: 'menu group not found' });
  }
  // 見つからなければ404（対象データが存在しない）を返す

  const updated = await prisma.menuGroup.update({
    where: { id },
    data: { name: trimmedName },
  });
  // DBの名前を更新する

  return res.json(updated);
  // 更新後のデータをJSONで返す
});

// DELETE /menu-groups/:id が来たときの処理（論理削除）
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  // URLの:id部分を数値に変換して取り出す

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  const existing = await prisma.menuGroup.findFirst({
    where: { id, deletedAt: null },
  });
  // 未削除のデータが存在するか確認する

  if (!existing) {
    return res.status(404).json({ message: 'menu group not found' });
  }

  await prisma.menuGroup.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  // 物理削除せず、deletedAtに現在時刻を入れることで「削除済み」状態にする（論理削除）

  return res.status(204).send();
  // 204（成功だが返すデータなし）を返す
});

// このファイルのルール集をindex.tsから使えるように公開する
export default router;