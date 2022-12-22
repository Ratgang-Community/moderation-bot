import fs from 'fs';
import path from 'path';
import config from '@utils/config'; 
import logger from '@utils/logger';

import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, Collection, CommandInteraction, REST, Routes } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

const getCommandFiles = async (commandPath: string) => {
	const commandFiles = await fs.promises.readdir(commandPath);
	return commandFiles.filter(file => file.endsWith('.command.js'));
};

export const registerCommands = async (client: Client) => {
	logger.info('Registering commands...');

	client.commands = new Collection(); 

	const commandPath = path.join(__dirname, '../commands');
	const commandFiles = await getCommandFiles(commandPath);

	for await (const file of commandFiles) {
		const filePath = path.join(commandPath, file);
		const { default: command }: { default: Command } = await import(filePath);

		if (!command?.data || !command?.execute) {
			logger.warn(`Command file "${file}" is missing data or execute! Skipping...`);
			continue;
		}

		client.commands.set(command.data.name, command);
	}

	logger.info(`Registered ${client.commands.size} commands!`);
};

export const deployCommands = async (client: Client, rest: REST) => {
	logger.info('Deploying commands to REST...');
	
	try {
		const commands = client.commands.map(command => command.data.toJSON());

		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands }
		);
	} catch (error) {
		logger.warn('There was an error while deploying commands to REST!', error);
	}
};