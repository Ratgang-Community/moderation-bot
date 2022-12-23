import { CommandInteraction, Events } from 'discord.js';
import { Logger } from 'pino';
import Event from '@global/event';
import Module from '@global/module';

const onCommandEvent: Event = {
	name: Events.InteractionCreate,
	once: false,
	async execute(logger: Logger, interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const { client } = interaction;
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			logger.warn(`Command ${interaction.commandName} not found! Are you sure it's registered?`);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			return;
		}

		// find the command's module
		const module = client.modules.find(module => module.commands.has(command.data.name)) as Module;

		try {
			await command.execute(module.logger, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};

export default onCommandEvent;