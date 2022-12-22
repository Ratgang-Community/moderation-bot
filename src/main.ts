// register module-alias
require('module-alias/register');

import { Client, GatewayIntentBits, REST } from 'discord.js';
import { deployCommands, registerCommands } from '@utils/commands';
import { registerEvents } from '@utils/events';
import config from '@utils/config';
import logger from '@utils/logger';

const token = config.token;
const production = config.production;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const rest = new REST({version: '10'}).setToken(token);

const main = async () => {
	if (!production) logger.warn('Running in development mode!');

	// commands
	await registerCommands(client);
	await deployCommands(client, rest);

	// events
	await registerEvents(client);

	client.login(token);
};

main().catch(error => logger.error(`Unexpected error occured: ${error}`));