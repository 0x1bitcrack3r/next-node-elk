FROM node:18.17.0

ENV PATH /nextapp/node_modules/.bin:$PATH

USER root

RUN mkdir -p /nextapp

WORKDIR /nextapp

# Adding application specific group and user
RUN groupadd -g 1999 nxtjs-grp && useradd -r -u 1999 -d /nextapp -m -s /bin/bash -g nxtjs-grp -g root nxtjs

COPY package*.json ./ 

RUN npm install

COPY . .

# Changing the user and/or group ownership of an app directory
RUN chown nxtjs:nxtjs-grp /nextapp

RUN chown nxtjs:nxtjs-grp /nextapp/run.sh

# Switching user to application user from root
USER nxtjs

# Build the Next.js app  
RUN npm run build

EXPOSE 3000

RUN chmod +x run.sh

CMD [ "/bin/sh", "run.sh"]
