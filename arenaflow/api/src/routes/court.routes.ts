import { Router } from 'express';
import { CourtService } from '../services/court.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) throw new Error("Header x-tenant-id é obrigatório");
    
    const court = await CourtService.create({ ...req.body, tenantId });
    res.status(201).json(court);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'] as string;
  const courts = await CourtService.getByTenant(tenantId);
  res.json(courts);
});

export { router as courtRoutes };