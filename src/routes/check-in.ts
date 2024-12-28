import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export const checkIn = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in', {
      schema: {
        summary: 'Check-in an attendee',
        tags: ['check-ins'],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.object({
            message: z.string().optional(),
          })
        }
      }
    }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        }
      })

      if (attendeeCheckIn !== null) {
        throw new BadRequest('Attendee already checked in!')
      }

      await prisma.checkIn.create({
        data: {
          attendeeId,
        }
      })

      return reply.status(201).send({
        message: 'Attendee checked in!'
      })
    })
}