FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm run build
COPY . .
EXPOSE 3005
CMD ["npm", "run", "start"]
