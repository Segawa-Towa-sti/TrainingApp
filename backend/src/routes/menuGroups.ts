import { Router } from 'express';
import prisma from '../lib/prisma';

const FIXED_USER_ID = 1;

const router = Router();

router.get('/',async (_req, res) => {
    const menuGroups = await prisma.menuGroup.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
        });

    res.json(menuGroups);
    });

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'name is required' });
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return res.status(400).json({ message: 'name must not be empty' });
  }

  const menuGroup = await prisma.menuGroup.create({
    data: {
      userId: FIXED_USER_ID,
      name: trimmedName,
    },
  });

  return res.status(201).json(menuGroup);
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
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

  const existing = await prisma.menuGroup.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: 'menu group not found' });
  }

  const updated = await prisma.menuGroup.update({
    where: { id },
    data: { name: trimmedName },
  });

  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  const existing = await prisma.menuGroup.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: 'menu group not found' });
  }

  await prisma.menuGroup.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return res.status(204).send();
});

export default router;