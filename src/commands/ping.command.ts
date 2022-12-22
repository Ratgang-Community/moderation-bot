import { Command } from '@utils/commands';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	async execute(interaction: CommandInteraction) {
		await interaction.reply({ ephemeral: false, content: 'Pong!' });
	}
};

export default pingCommand;