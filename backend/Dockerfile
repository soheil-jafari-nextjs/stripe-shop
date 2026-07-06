FROM node:24
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"