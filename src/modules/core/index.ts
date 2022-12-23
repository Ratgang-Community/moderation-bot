import Module from '@global/module';
import { Client } from 'discord.js';

export class CoreModule extends Module {
	constructor(client: Client) {
		super(client, 'core', __dirname);
	}
}

export default CoreModule;