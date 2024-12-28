import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";
import { BadRequest } from "./_errors/bad-request";

export const createEvent = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
            message: z.string().optional(),
          })
        },
      }
    }, 
    async (request, reply) => {
    const { 
      title,
      details,
      maximumAttendees
    } = request.body;

    const slug = generateSlug(title)

    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      }
    })

    if (eventWithSameSlug !== null) {
      throw new BadRequest('Another event with same title already exists.')
      //throw new Error('Another event with same title already exists.')
    }

    const event = await prisma.event.create({
      data: {
        title: title,
        details: details,
        maximumAttendees: maximumAttendees,
        slug,
      },
    })

    return reply.code(201).send(
      {
        message: 'Event created successfully',
        eventId : event.id
      }
    )
  })
}