FROM public.ecr.aws/docker/library/node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --ignore-scripts

COPY . .

RUN npm run build || echo "Build step failed, but continuing..."

RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

RUN chown -R mcp:nodejs /app

USER mcp

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "dist/marketplace.js"]
