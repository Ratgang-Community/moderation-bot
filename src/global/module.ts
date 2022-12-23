import fs from 'fs';
import path from 'path';

import { Client, Collection } from 'discord.js';
import { Logger as LoggerType } from 'pino';

import config from '@utils/config';
import logger from '@utils/logger';
import Command from '@global/command';
import Event from '@global/event';

declare module 'discord.js' {
    interface Client {
        modules: Collection<string, Module>;
    }
}

const getCommandFiles = async (dir: string): Promise<string[]> => {
	const commandPath = path.join(dir, 'commands');

	// check if the commands folder exists
	if (!fs.existsSync(commandPath)) {
		return [];
	}

	const commandFiles = await fs.promises.readdir(commandPath);
	return commandFiles.filter(file => file.endsWith('.command.js'));
};


const getEventFiles = async (dir: string): Promise<string[]> => {
	const eventPath = path.join(dir, 'events');

	// check if the events folder exists
	if (!fs.existsSync(eventPath)) {
		return [];
	}

	const eventFiles = await fs.promises.readdir(eventPath);
	return eventFiles.filter(file => file.endsWith('.event.js'));
};

export class Module {
	public readonly client: Client;
	public readonly name: string;
	public readonly dir: string;
	public readonly commands: Collection<string, Command>;
	public readonly events: Collection<string, Event>;
	public readonly logger: LoggerType;

	constructor(client: Client, name: string, dir: string) {
		this.client = client;
		this.name = name;
		this.dir = dir;

		this.commands = new Collection();
		this.events = new Collection();

		this.logger = logger.child({ name: this.name });

		this.registerCommands();
		this.registerEvents();
	
	}

	protected async registerCommands() {
		try {
			const commandFiles = await getCommandFiles(this.dir);
			
			for await (const file of commandFiles) {
				try {
					const { default: command }: { default: Command } = await import(path.join(this.dir, 'commands', file));
	
					// check if it is really a command interface
					if (!command.data || !command.execute) {
						this.logger.error(`Invalid command interface in file ${file}`);
						continue;
					}
				
					// check if the command name is already registered
					if (this.client.commands.has(command.data.name)) {
						this.logger.warn(`Command name ${command.data.name} is already registered in the client!`);
						continue;
					}

					// saving the command in the collections
					this.commands.set(command.data.name, command);
					this.client.commands.set(command.data.name, command);
				} catch (error) {
					if (config.meta.development)
						this.logger.error(error);
					this.logger.warn(`Error while registering command ${file}, Skiping...`);
				}
			}
		} catch (error) {
			this.logger.error('Error while registering commands!', error);
		}
	}

	protected async registerEvents() {
		try {
			const eventFiles = await getEventFiles(this.dir);

			for await (const file of eventFiles) {
				try {
					const { default: event }: { default: Event } = await import(path.join(this.dir, 'events', file));
	
					// check if it is really a event interface
					if (!event.name || !event.execute) {
						this.logger.error(`Invalid event interface in file ${file}`);
						continue;
					}

					// saving the event in the collections
					this.events.set(event.name, event);
					this.client.events.set(event.name, event);

					if (event.once) {
						this.client.once(event.name, (...args) => event.execute(this.logger, ...args));
						continue;
					}

					this.client.on(event.name, (...args) => event.execute(this.logger, ...args));
				} catch (error) {
					if (config.meta.development)
						this.logger.error(error);
					this.logger.warn(`Error while registering event ${file}, Skiping...`, error);
				}
			}	
		} catch (error) {
			this.logger.error('Error while registering events!', error);
		}
	}
}

export default Module;