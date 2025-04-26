import dotenv from 'dotenv';
dotenv.config();

const config = {
  e2e: {
    setupNodeEvents(on: any, config: any) {
      on('before:browser:launch', (browser: any, launchOptions: any) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-features=PasswordCheck,AutofillKeyBoardAccessoryView,Autofill');
          launchOptions.args.push('--disable-save-password-bubble');
          launchOptions.args.push('--disable-translate');
          launchOptions.args.push('--disable-credentials-enable-service');
          launchOptions.args.push('--disable-password-manager-reauthentication');
          launchOptions.args.push('--guest');
          launchOptions.args.push('--user-data-dir=/tmp/chrome-test-profile');

        }
        return launchOptions;
      });

      return config;
    },
    testIsolation: false,
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true,
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
