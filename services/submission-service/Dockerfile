FROM oven/bun:latest
WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client curl

COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

COPY .env bun.lockb package.json bun.lockb prisma ./
RUN bun install
RUN bun prisma generate

EXPOSE 4003

COPY . .

CMD ["sh", "-c", "/wait-for.sh postgres timeout 30 bun prisma migrate deploy && bun run src/server.ts"]