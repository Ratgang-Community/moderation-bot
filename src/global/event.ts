import { Collection } from 'discord.js';
import { Logger } from 'pino';

declare module 'discord.js' {
    interface Client {
		events: Collection<string, Event>;
    }
}

interface Event {
    name: string;
    once: boolean;
    execute(logger: Logger, ...args: unknown[]): Promise<void>;
}

export default Event;