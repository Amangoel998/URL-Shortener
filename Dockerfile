FROM node:12
WORKDIR /app
COPY package*.json /app/
RUN npm install --loglevel=warn;
RUN ls
CMD npm start