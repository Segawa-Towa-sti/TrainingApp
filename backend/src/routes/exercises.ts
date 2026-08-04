import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const exercises = await prisma.exercise.findMany({
    where: { deletedAt: null },
    orderBy: { id: 'asc' },
  });

  res.json(exercises);
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

  const exercise = await prisma.exercise.create({
    data: {
      name: trimmedName,
    },
  });

  return res.status(201).json(exercise);
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

  const existing = await prisma.exercise.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  const updated = await prisma.exercise.update({
    where: { id },
    data: {
      name: trimmedName,
    },
  });

  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  const existing = await prisma.exercise.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  await prisma.exercise.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  return res.status(204).send();
});

export default router;