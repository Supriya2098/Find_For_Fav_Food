import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { category } = req.query;
    const where = { restaurantId: req.params.restaurantId, isAvailable: true };
    if (category) where.category = category;

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    const categories = [...new Set(menuItems.map((item) => item.category))];

    res.json({ items: menuItems, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { restaurant: { select: { id: true, name: true } } },
    });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, restaurantId } = req.body;
    if (!name || !description || price == null || !category || !restaurantId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = await prisma.menuItem.create({
      data: { name, description, price: Number(price), category, imageUrl, restaurantId },
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.price != null) data.price = Number(data.price);

    const item = await prisma.menuItem.update({
      where: { id: req.params.id },
      data,
    });
    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Menu item not found' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.menuItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Menu item not found' });
    res.status(500).json({ error: err.message });
  }
});

export default router;
