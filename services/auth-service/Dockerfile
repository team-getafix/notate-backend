FROM oven/bun:latest
WORKDIR /app

COPY .env bun.lockb package.json bun.lockb prisma ./
RUN bun install
RUN bun prisma generate

EXPOSE 4001

COPY . .

CMD ["sh", "-c", "bun prisma migrate deploy && bun run src/server.ts"]