// register module-alias
require('module-alias/register');

import { Client, GatewayIntentBits, REST } from 'discord.js';
import { deployCommands, registerModules } from '@utils/module';
import config from '@utils/config';
import logger from '@utils/logger';

const token = config.token;

logger.info('Starting bot...');
logger.info(`Version: ${config.meta.version}`);
logger.info(`Ref: ${config.meta.commitSha}`);
logger.info(`Environment: ${config.meta.development ? 'Development': 'Production'}`);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const rest = new REST({ version: '10' }).setToken(token);

const main = async () => {
	if (config.meta.development) logger.warn('Running in development mode!');

	// register modules
	await registerModules(client);
	await deployCommands(client, rest);

	client.login(token);
};

main().catch(error => logger.error(`Unexpected error occured: ${error}`));