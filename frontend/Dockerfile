# FROM node:22-bookworm-slim
# WORKDIR /app

# COPY package.json package-lock.json* ./
# RUN npm ci || npm install --include=optional
# RUN npm install lightningcss-linux-x64-gnu

# COPY . .

# ENV WATCHPACK_POLLING=true

# EXPOSE 3000
# CMD ["npm","run","dev","--","--port","3000"]

FROM node:22-bookworm-slim
WORKDIR /app

EXPOSE 3000
ENV WATCHPACK_POLLING=true

CMD ["npm","run","dev","--","--hostname","0.0.0.0","--port","3000"]
