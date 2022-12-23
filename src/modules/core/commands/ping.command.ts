import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';
import Command from '@global/command';

const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	async execute(logger: Logger, interaction: CommandInteraction) {
		await interaction.reply({ ephemeral: false, content: 'Pong!' });
	}
};

export default pingCommand;