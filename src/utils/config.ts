import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    production: boolean;
    token: string;
    clientId: string;
    guildId: string;
}

export const get = (key: string, defaultValue?: string): string => {
	if (defaultValue === undefined && process.env[key] === undefined)
		throw new Error(`Missing config value for key: ${key}`);

	return (process.env[key] ?? defaultValue) as string;
};

export const getNumber = (key: string, defaultValue?: number) => {
	const value = get(key, defaultValue?.toString());
	const number = parseInt(value || '');

	if (isNaN(number))
		throw new Error(`Config value for key: ${key} is not parsable`);

	return number;
};

const config: Config = {
	production: get('NODE_ENV') === 'production',
	token: get('TOKEN'),
	clientId: get('CLIENT_ID'),
	guildId: get('GUILD_ID')
};

export default config;