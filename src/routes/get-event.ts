import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getEvent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId', {}, async (request, reply) => {})
}