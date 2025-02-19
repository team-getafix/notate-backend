FROM oven/bun:latest
WORKDIR /app

COPY bun.lockb package.json bun.lockb ./
RUN bun install

COPY . .

CMD ["bun", "run", "src/server.ts"]
