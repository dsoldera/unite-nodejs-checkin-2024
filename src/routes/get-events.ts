import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getAllEvents(app: FastifyInstance) {
app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events', {
    schema: {
      summary: 'Get all events',
      tags: ['events'],
      response: {
        200: z.object({
          events: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
            })
          ),
          total: z.any(),
        })
      }
    },

  }, async (request, reply) => {
    
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        select: {
          id: true,
          title: true,
        }
      }),

      prisma.event.count({
        select: {
          id: true,
        }
      })
    ])

    return reply.send({ 
      events: events.map(event => {
        return {
          id: event.id,
          title: event.title,
        }
      }),
      total,
    })
  })
}