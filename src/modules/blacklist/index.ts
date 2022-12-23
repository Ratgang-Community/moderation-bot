import Module from '@global/module';
import { Client } from 'discord.js';

export class BlacklistModule extends Module {
	constructor(client: Client) {
		super(client, 'blacklist', __dirname);
	}
}

export default BlacklistModule;