# pass.in
O pass.in é uma aplicação de gestão de participantes em eventos presenciais.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Tecnologias/Ferramentas utilizadas
- Nodejs
- Typescript
- Fastify
- Prisma
  `npx prisma init --datasource-provider SQLite`
- SQLite
- Seed - `npx prisma db seed` 
## Requisitos
### Requisitos funcionais
 - [x] - O organizador deve poder cadastrar um novo evento;
 - [x] - O organizador deve poder visualizar dados de um evento;
 - [x] - O organizador deve poser visualizar a lista de participantes;
 - [x] - O participante deve poder se inscrever em um evento;
 - [x] - O participante deve poder visualizar seu crachá de inscrição;
 - [x] = O participante deve poder realizar check-in no evento;
Regras de negócio
 - [x] - O participante só pode se inscrever em um evento uma única vez;
 - [x] - O participante só pode se inscrever em eventos com vagas disponíveis;
 - [x] - O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais
 - [] - O check-in no evento será realizado através de um QRCode;
 - [] - Documentação da API (Swagger)
 - [] - Para documentação da API, acesse o link: https://nlw-unite-nodejs.onrender.com/docs

## Banco de dados
Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

## SQL
```sql
-- CreateTable for events
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateTable for attendees
CREATE TABLE "attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable for check_ins
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendeeId" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex for events slug
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex for attendees event_id and email
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");

-- CreateIndex for check_ins attendeeId
CREATE UNIQUE INDEX "check_ins_attendeeId_key" ON "check_ins"("attendeeId");
```