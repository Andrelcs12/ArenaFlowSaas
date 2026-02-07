const ABACATE_API_KEY = process.env.ABACATE_API_KEY;
const API_URL = "https://api.abacatepay.com/v1";

export class PaymentService {
  static async createCustomer(tenant: any) {
    const payload = {
      name: tenant.name,
      cellphone: "(79) 99999-9999", 
      email: "contato@arenaflow.com", 
      taxId: "047.979.525-80" 
    };

    const response = await fetch(`${API_URL}/customer/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    if (!response.ok) throw new Error(resData.error || "Erro ao criar cliente");
    return resData.data; 
  }

  static async createSubscription(customerId: string, price: number, tenantSlug: string) {
    const payload = {
      frequency: "ONE_TIME",
      methods: ["PIX"],
      customerId: customerId,
      products: [
        {
          externalId: "plan_subscription",
          name: "Assinatura ArenaFlow",
          quantity: 1,
          price: price 
        }
      ],
      returnUrl: `http://localhost:3000/${tenantSlug}/dashboard`,
      completionUrl: `http://localhost:3000/${tenantSlug}/dashboard`
    };

    const response = await fetch(`${API_URL}/billing/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }
}