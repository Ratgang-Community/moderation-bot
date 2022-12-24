import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Logger } from 'pino';
import Command from '@global/command';

const urlOption = new SlashCommandStringOption()
	.setRequired(true)
	.setName('url')
	.setDescription('The URL for the blacklist file.');

const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('blacklist-links')
		.setDescription('Blacklists a link from being used in the server.')
		.addStringOption(urlOption)
		.setDMPermission(false),

	async execute(logger: Logger, interaction: CommandInteraction) {
		await interaction.reply({ ephemeral: false, content: 'Pong!' });
	}
};

export default pingCommand;