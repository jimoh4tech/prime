# Add node docker image
FROM node:alpine

# Create directory that runs the app on docker
WORKDIR /app

# Copy the neccessary files to /app
COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

COPY tsconfig.json ./

COPY . .

# Install package.json dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Run and expose the sever on port 3000
EXPOSE 4000


# Start the server
CMD npm run dev