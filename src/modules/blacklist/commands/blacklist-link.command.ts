import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Logger } from 'pino';
import Command from '@global/command';

import { blockLink, isLinkBlacklisted, unblockLink } from '../services/blacklist-link.service';

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


const blacklistLinkCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('blacklist-link')
		.setDescription('Blacklists a link from being used in the server.')
		.addStringOption(linkOption)
		.addBooleanOption(removeOption)
		.addBooleanOption(pathOption)
		.setDMPermission(false),

	async execute(logger: Logger, interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const link = interaction.options.getString('link') as string;
		const remove = interaction.options.getBoolean('remove') || false;
		const blacklistPath = interaction.options.getBoolean('blacklist-path') || false;
	
		const exists = await isLinkBlacklisted(link, blacklistPath);
	
		if (exists && !remove) {
			await interaction.editReply({ content: 'That link is already blacklisted!' });
			return;
		}
	
		if (!exists && remove) {
			await interaction.editReply({ content: 'That link is not blacklisted!' });
			return;
		}
	
		if (remove) {
			await unblockLink(link, blacklistPath);
			await interaction.editReply({ content: 'Link removed from blacklist.' });
			return;
		}

		await blockLink(link, blacklistPath, interaction.user.id);
		await interaction.editReply({ content: 'Link was added to the blacklist!' });
	}
};

export default blacklistLinkCommand;