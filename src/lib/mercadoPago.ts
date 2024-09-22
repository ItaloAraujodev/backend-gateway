import { env } from "@/env";
import MercadoPagoConfig, { Payment, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
});

export const preference = new Preference(client);
export const payment = new Payment(client);
