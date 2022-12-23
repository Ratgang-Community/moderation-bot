import { Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

interface Command {
    data: SlashCommandBuilder;
    execute(logger: Logger, interaction: CommandInteraction): Promise<void>;
}

export default Command;