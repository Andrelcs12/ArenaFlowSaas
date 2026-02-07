import { Router } from 'express';
import { TenantService } from '../services/tenant.service';

const router = Router();

router.get('/', async (req, res) => {
  const tenants = await TenantService.getAll();
  res.json(tenants);
});

router.post('/', async (req, res) => {
  try {
    const tenant = await TenantService.create(req.body);
    res.status(201).json(tenant);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// api/src/routes/tenant.routes.ts
router.get('/slug/:slug', async (req, res) => {
  try {
    const tenant = await TenantService.getBySlug(req.params.slug);
    if (!tenant) return res.status(404).json({ error: "Arena não encontrada" });
    res.json(tenant);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


export { router as tenantRoutes };