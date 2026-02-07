import { Router } from 'express';
import { BookingService } from '../services/booking.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    const booking = await BookingService.create({ ...req.body, tenantId });
    res.status(201).json(booking);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'] as string;
  const bookings = await BookingService.getByTenant(tenantId);
  res.json(bookings);
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await BookingService.updateStatus(id, status);
  res.json(updated);
});

export { router as bookingRoutes };