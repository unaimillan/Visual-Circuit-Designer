FROM node:20-alpine

WORKDIR /UI
COPY . .

RUN npm install
RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "4173"]