import { FastifyInstance } from "fastify";
import { paymentCreatedController } from "./paymentCreatedController";
import { paymentSearchManyPreferenceController } from "./paymentSearchManyPreferenceController";
import { paymentSearchPreferenceController } from "./paymentPreferenceController";
import { searchPaymentController } from "./searchPaymentController";
import { paymentCreatedPixController } from "./paymentCreatedPixController";

export async function paymentRouter(app: FastifyInstance) {
  app.post("/payment", paymentCreatedController);
  app.post("/payment/pix", paymentCreatedPixController);
  app.get("/payment/:id", searchPaymentController);
  app.get("/payment/search", paymentSearchManyPreferenceController);
  app.get("/payment/search/:id", paymentSearchPreferenceController);
}
