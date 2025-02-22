FROM oven/bun:latest
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client curl

COPY .env bun.lockb package.json bun.lockb prisma ./
RUN bun install
RUN bun prisma generate

EXPOSE 4003

COPY . .

CMD ["sh", "-c", "bun prisma migrate deploy && bun run src/server.ts"]