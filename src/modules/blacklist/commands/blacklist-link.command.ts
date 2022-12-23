import { CommandInteraction, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Logger } from 'pino';
import Command from '@global/command';

const linkOption = new SlashCommandStringOption()
	.setRequired(true)
	.setName('link')
	.setDescription('The link to blacklist.');

const removeOption = new SlashCommandBooleanOption()
	.setRequired(false)
	.setName('remove')
	.setDescription('Whether to remove the link from the blacklist.');

const pathOption = new SlashCommandBooleanOption()
	.setRequired(false)
	.setName('blacklist-path')
	.setDescription('Whether to blacklist the path of the link.');


const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('blacklist-link')
		.addStringOption(linkOption)
		.addBooleanOption(removeOption)
		.addBooleanOption(pathOption)
		.setDescription('Blacklists a link from being used in the server.')
		.setDMPermission(false),

	async execute(logger: Logger, interaction: CommandInteraction) {
		await interaction.reply({ ephemeral: false, content: 'Pong!' });
	}
};

export default pingCommand;