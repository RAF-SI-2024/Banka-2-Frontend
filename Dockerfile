FROM node:22.14.0-alpine AS build

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json package-lock.json pnpm-lock.yaml ./

ARG APP_ENV=build-prod

# Install dependencies with legacy-peer-deps flag to bypass dependency conflicts
RUN pnpm install

# Copy the rest of the app
COPY . .

# Run the build
RUN pnpm run $APP_ENV --emptyOutDir

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]