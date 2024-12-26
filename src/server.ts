import fastifyCors from "@fastify/cors"
import fastify from "fastify"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import { checkIn } from "./routes/check-in"
import { createEvent } from "./routes/create-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"
import { getEvent } from "./routes/get-event"
import { getEventAttendees } from "./routes/get-event-attendees"
import { getAllEvents } from "./routes/get-events"
import { registerForEvent } from "./routes/register-for-event"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)

app.register(getEvent)
app.register(getAllEvents)
app.register(getEventAttendees)
app.register(getAttendeeBadge)
app.register(checkIn)

app.listen({ 
  port: 3333, 
  host: '0.0.0.0' 
}).then(() => {
  console.log(`HTTP server running at PORT 3333!`)
})