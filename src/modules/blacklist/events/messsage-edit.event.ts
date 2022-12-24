import { Events, Message } from 'discord.js';
import { Logger } from 'pino';
import Event from '@global/event';

import { isLinkBlacklisted } from '../services/blacklist-link.service';

const onMessageEvent: Event = {
	name: Events.MessageUpdate,
	once: false,
	async execute(logger: Logger, message: Message<true>) {
		const { content } = message;

		// Get all links from the content
		const links = content.match(/https?:\/\/[^\s]+/g);
		if (!links) return;

		// check if links are blacklisted
		for await (const link of links) {
			const isBlacklisted = await isLinkBlacklisted(link, true) || await isLinkBlacklisted(link, false);
			if (!isBlacklisted) continue;

			// Delete the message
			await message.delete();
			await message.author.send(`Your message was deleted because it contained a blacklisted link: ${link}`);
		}
	}
};

export default onMessageEvent;