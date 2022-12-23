import fs from 'fs';
import path from 'path';
import { Client, Collection, REST, Routes } from 'discord.js';

import logger from '@utils/logger';
import config from '@utils/config';
import Module from '@global/module';

export const getModuleFiles = async () => {
	const modulePath = path.join(__dirname, '../modules');
	return await fs.promises.readdir(modulePath);
};

export const registerModules = async (client: Client) => {
	logger.info('Registering modules...');
	
	client.modules = new Collection();

	const moduleFiles = await getModuleFiles();

	for await (const file of moduleFiles) {
		const filePath = path.join(__dirname, '../modules', file);

		try {
			const { default: module } = await import(filePath);

			if (!(typeof module === 'function' && module?.prototype instanceof Module)) {
				logger.warn(`Module file "${filePath}" is not a module! Skipping...`);
				logger.warn(await import(filePath));
				continue;
			}
			
			client.modules.set(module.name, new module(client));
		} catch (error) {
			if (!config.production)
				logger.error(error);
			logger.warn(`There was an error while registering module "${file}"! Skipping...`);
		}
	}

	if (client.modules.size === 0)
		logger.warn('No modules were registered!');
	else
		logger.info(`Registered modules (${client.modules.size}): ${Array.from(client.modules.keys()).join(', ')}`);
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