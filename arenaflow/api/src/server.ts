import express from 'express';
import cors from 'cors';
import { authRoutes } from "./routes/auth.routes"
import { tenantRoutes } from './routes/tenant.routes';
import { courtRoutes } from './routes/court.routes';
import { bookingRoutes } from './routes/booking.routes';
import { webHooksRoutes } from "./routes/webhook.routes"
import paymentRoutes from './routes/payment.routes';
const app = express();

app.use(cors());
app.use(express.json());

// Agrupamento de rotas
app.use('/api/webhooks', webHooksRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 ArenaFlow Backend rodando em http://localhost:${PORT}`);
});