import { SlashCommandAttachmentOption, SlashCommandStringOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, ChatInputCommandInteraction, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, Client as DiscordClient, SlashCommandUserOption, Partials } from "discord.js";

export type TCommand$Options = SlashCommandAttachmentOption | SlashCommandStringOption | SlashCommandBooleanOption | SlashCommandChannelOption | SlashCommandIntegerOption | SlashCommandMentionableOption | SlashCommandNumberOption | SlashCommandRoleOption | SlashCommandUserOption;

interface ICommand$Base {
    /**
     * Nombre del comando
     */
    name?: string;
    /**
     * Descripción del comando
     */
    description?: string;
    /**
     * Establecer estado NSFW del comando
     */
    isNSFW?: boolean;
    /**
     * Función a ejecutar cuando el comando sea invocado
     * @param client Cliente de Discord
     * @param interaction Interacción del comando
     */
    execute: (client: DiscordClient<true>, interaction: ChatInputCommandInteraction) => void;
}

interface ICommand$WithOptions extends ICommand$Base {
    /**
     * Opciones del comando
     */
    options?: TCommand$Options | TCommand$Options[];
}

interface ICommand$WithSubcommands extends ICommand$Base {
    /**
     * Arreglo de subcomandos del comando
     */
    subcommands?: SlashCommandSubcommandBuilder | SlashCommandSubcommandBuilder[];
    /**
     * Arreglo de grupo de subcomandos del comando
     */
    subcommandsGroup?: SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandGroupBuilder[];
}


export type TCommand = ICommand$WithOptions | ICommand$WithSubcommands;