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