FROM node:20.11-alpine AS base

ARG BACKEND_PORT
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm prisma generate
RUN pnpm build
ENV NODE_ENV=production
EXPOSE $BACKEND_PORT
CMD [ "pnpm", "start:prod" ]
