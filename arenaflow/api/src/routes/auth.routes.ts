import { Router } from "express";
import { AuthService } from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, slug } = req.body;

    // Campos necessários para criar a Arena + Usuário
    if (!email || !password || !name || !slug) {
      return res.status(400).json({ 
        error: "Para registrar, envie: email, password, name (da arena) e slug." 
      });
    }

    const user = await AuthService.register({ email, password, name, slug });
    res.status(201).json(user);
  } catch (error: any) {
    // Se o slug já existir, o Prisma vai dar erro aqui
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

export { router as authRoutes };