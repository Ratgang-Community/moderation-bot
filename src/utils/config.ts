import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    token: string;
    clientId: string;
    guildId: string;
	meta: Meta;
}

interface Meta {
	env: string;
	development: boolean;
	version: string;
	commitSha: string;
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

const nodeEnv = get('NODE_ENV', 'development');

const config: Config = {
	token: get('TOKEN'),
	clientId: get('CLIENT_ID'),
	guildId: get('GUILD_ID'),
	meta: {
		env: nodeEnv,
		development: nodeEnv.toLowerCase() === 'development',
		version: get('VERSION', 'development'),
		commitSha: get('COMMIT_SHA', 'unknown'),
	}
};

export default config;