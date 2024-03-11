# Pull Alpine Linux Image with node 18 LTS
FROM node:18.1.0-alpine

# Creating and setting app dir
RUN mkdir /snowcapped
WORKDIR /snowcapped

# Copy all elements to the image see .dockerignore
COPY . .

# Exposing app port
EXPOSE 5005

# Install dependencies and start the app
ENTRYPOINT [ "sh", "-c" ]
CMD [ "yarn && yarn start" ]
