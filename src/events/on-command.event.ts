import { CommandInteraction, Events } from 'discord.js';
import { Event } from '@utils/events';
import logger from '@utils/logger';

const onCommandEvent: Event = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const { client } = interaction;
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			logger.warn(`Command ${interaction.commandName} not found! Are you sure it's registered?`);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};

export default onCommandEvent;