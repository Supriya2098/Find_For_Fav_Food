import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { cuisine, city, search } = req.query;
    const where = {};

    if (cuisine) where.cuisine = { contains: cuisine };
    if (city) where.city = { contains: city };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { cuisine: { contains: search } },
      ];
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: { _count: { select: { menuItems: true } } },
      orderBy: { name: 'asc' },
    });

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        menuItems: { where: { isAvailable: true }, orderBy: { category: 'asc' } },
        _count: { select: { reservations: true } },
      },
    });

    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, description, address, city, cuisine, imageUrl, openingTime, closingTime, capacity } = req.body;
    if (!name || !description || !address || !city || !cuisine) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const restaurant = await prisma.restaurant.create({
      data: { name, description, address, city, cuisine, imageUrl, openingTime, closingTime, capacity },
    });

    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(restaurant);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Restaurant not found' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.restaurant.delete({ where: { id: req.params.id } });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Restaurant not found' });
    res.status(500).json({ error: err.message });
  }
});

export default router;
