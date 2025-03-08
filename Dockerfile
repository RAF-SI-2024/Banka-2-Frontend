FROM node:22.14.0-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json package-lock.json pnpm-lock.yaml ./

# Install dependencies with legacy-peer-deps flag to bypass dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Run the build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]