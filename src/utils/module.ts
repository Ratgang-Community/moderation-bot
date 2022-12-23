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
	client.events = new Collection();
	client.commands = new Collection();

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
			
			const instance = new module(client);
			await instance.load();
			
			client.modules.set(module.name, instance);
		} catch (error) {
			if (config.meta.development) logger.error(error);
			logger.warn(`There was an error while registering module "${file}"! Skipping...`);
		}
	}
	logger.info('Deploying commands to REST...');
	if (client.modules.size === 0)
		logger.warn('No modules were registered!');
	else
		logger.info(`Registered modules (${client.modules.size}): ${Array.from(client.modules.keys()).join(', ')}`);
};

export const deployCommands = async (client: Client, rest: REST) => {
	
	try {
		const commands = client.commands.map(command => command.data.toJSON());
		logger.info(`Deploying ${commands.length} commands to REST...`);

		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands }
		);
	} catch (error) {
		logger.warn('There was an error while deploying commands to REST!', error);
	}
};