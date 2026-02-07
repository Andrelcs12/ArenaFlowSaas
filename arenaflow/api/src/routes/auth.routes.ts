import { Router } from "express";
import { AuthService } from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, tenantId, role } = req.body;

    // Verificação de campos obrigatórios (O motivo do erro 400)
    if (!email || !password || !tenantId) {
      return res.status(400).json({ error: "E-mail, senha e tenantId são obrigatórios." });
    }

    const user = await AuthService.register({ email, password, tenantId, role });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export { router as authRoutes}