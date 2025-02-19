FROM oven/bun:latest
WORKDIR /app

COPY swagger-config.json bun.lockb package.json bun.lockb ./
RUN bun install

COPY . .

CMD ["bun", "run", "src/server.ts"]
