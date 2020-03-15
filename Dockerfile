FROM node:12.0-slim
COPY . .
RUN npm install --loglevel=warn;
CMD [ "node", "server.js" ]