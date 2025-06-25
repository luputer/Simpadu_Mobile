import Constants from 'expo-constants';

type Environment = 'dev' | 'prod';

interface EnvConfig {
    API_URL: string;
    NGROK_URL: string;
}

// Get the environment variables from app.config.js
const ENV: Record<Environment, EnvConfig> = {
    dev: {
        // API_URL: 'https://ti054d01.agussbn.my.id',
        API_URL: 'https://ti054d02.agussbn.my.id',
        NGROK_URL: 'https://083e-2001-448a-60c0-7810-b863-c566-4cf8-8473.ngrok-free.app/ '
    },
    prod: {
        API_URL: 'https://ti054d01.agussbn.my.id/',
        NGROK_URL: 'https://1eee-2404-c0-4ca0-00-1127-dda3.ngrok-free.app'
    }
};

const getEnvVars = (): EnvConfig => {
    // Get the current environment
    const env = (Constants.expoConfig?.extra?.ENV || 'dev') as Environment;
    return ENV[env];
};

export default getEnvVars(); 