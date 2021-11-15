# use this base image
FROM node:17

# set the working directory
WORKDIR /app

# copy the package.json
COPY package.json .

# run npm install when building the image
RUN npm install

# copy everything
COPY . ./

# run when running the container
CMD ["npm", "index.js"]  # run time
