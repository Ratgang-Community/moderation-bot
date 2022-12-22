import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

import { Client, Collection } from 'discord.js';

export interface Event {
    name: string;
    once: boolean;
    execute(...args: unknown[]): Promise<void>;
}

declare module 'discord.js' {
    interface Client {
        events: Collection<string, Event>;
    }
}

export const registerEvents = async (client: Client) => {
	logger.info('Registering events...');

	client.events = new Collection();

	const eventPath = path.join(__dirname, '../events');
	const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.event.js'));
	
	for (const file of eventFiles) {
		const filePath = path.join(eventPath, file);
		const { default: event } = await import(filePath) as { default: Event };

		if (!event?.name || !event?.execute) {
			logger.warn(`Event file "${file}" is missing name or execute! Skipping...`);
			continue;
		}

		client.events.set(event.name, event);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
			continue;
		}

		client.on(event.name, (...args) => event.execute(...args));
	}

	logger.info(`Registered ${client.events.size} events!`);
};