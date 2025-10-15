FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ENV WATCHPACK_POLLING=true

EXPOSE 3000
CMD ["npm","run","dev","--","--port","3000"]
