import { User } from 'discord.js';
import { URL } from 'url';
import prisma from '@utils/prisma';

export const transformLink = async (link: string, blacklistPath: boolean) => {
	const url = new URL(link);
	const { origin, pathname } = url;

	if (blacklistPath) {
		return origin + pathname;
	}

	return origin.toString();
};

export const isLinkBlacklisted = async (raw: string, blacklistPath: boolean) => {
	const link = await transformLink(raw, blacklistPath);

	const blacklistedLink = await prisma.blacklistedLink.findUnique({
		where: {
			link
		}
	});

	return blacklistedLink !== null;
};


export const blockLink = async (raw: string, blacklistPath: boolean, blacklistedBy: User) => {
	const link = await transformLink(raw, blacklistPath);

	await prisma.blacklistedLink.create({
		data: {
			link,
			blacklistedBy: blacklistedBy.id
		}
	});

	return link;
};

export const unblockLink = async (raw: string, blacklistPath: boolean) => {
	const link = await transformLink(raw, blacklistPath);

	await prisma.blacklistedLink.delete({
		where: {
			link
		}
	});

	return link;
};