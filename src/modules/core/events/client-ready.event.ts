import { Client, Events } from 'discord.js';
import { Logger } from 'pino';
import Event from '@global/event';

const ClientReadyEvent: Event = {
	name: Events.ClientReady,
	once: true,
	async execute(logger: Logger, client: Client<true>) {
		logger.info('Client ready! Logged in as ' + client.user?.tag + ' (' + client.user?.id + ')');

		const guilds = Array.from(client.guilds.cache.values());
		logger.info(`Guilds (${guilds.length}): ${guilds.map(guild => guild.name).join(', ')}`);
	}
};

export default ClientReadyEvent;