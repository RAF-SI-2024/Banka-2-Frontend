import dotenv from 'dotenv';
dotenv.config();

const config = {
  e2e: {
    setupNodeEvents(on: any, config: any) {
      return config;
    },
    testIsolation: false,
    baseUrl: "http://localhost:5173", // Adjust for your Vite setup
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true, // Enable Studio
    env: {
      API_URL: process.env.CYPRESS_API_URL, // Read from .env
      API_BASE_PATH: process.env.CYPRESS_API_BASE_PATH, // Read from .env
    }
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    experimentalStudio: true
  },
};

export default config;