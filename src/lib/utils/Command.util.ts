import { stringPropertyAreValid } from './index';
import { debugError, ErrorMessages } from '../Debug';
import { SlashCommandAttachmentOption, SlashCommandStringOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { TCommand$Options, TCommand } from '../Commands';


export const isInstanceOfTCommandOptions = (obj: any): obj is TCommand$Options => {
    return obj instanceof SlashCommandAttachmentOption ||
        obj instanceof SlashCommandStringOption ||
        obj instanceof SlashCommandBooleanOption ||
        obj instanceof SlashCommandChannelOption ||
        obj instanceof SlashCommandIntegerOption ||
        obj instanceof SlashCommandMentionableOption ||
        obj instanceof SlashCommandNumberOption ||
        obj instanceof SlashCommandRoleOption;
}

export const validateCommandOptions = (options: TCommand) => {
    if ('name' in options && (!stringPropertyAreValid(options.name) || options.name.includes(' ') || /(A-Z)/gi.test(options.name))) debugError(ErrorMessages.Command.Name);
    if ('description' in options && !stringPropertyAreValid(options.description)) debugError(ErrorMessages.Command.Description(options.name));
    if ('options' in options && options.options && (!Array.isArray(options.options) || (options.options.length > 0 && !options.options.some(o => isInstanceOfTCommandOptions(o))))) debugError(ErrorMessages.Command.Options(options.name));
    if ('subcommands' in options && options.subcommands && (!Array.isArray(options.subcommands) || (options.subcommands.length > 0 && !options.subcommands.some(s => s instanceof SlashCommandSubcommandBuilder)))) debugError(ErrorMessages.Command.Subcommand(options.name));
    if ('subcommandsGroup' in options && options.subcommandsGroup && (!Array.isArray(options.subcommandsGroup) || (options.subcommandsGroup.length > 0 && !options.subcommandsGroup.some(s => s instanceof SlashCommandSubcommandGroupBuilder)))) debugError(ErrorMessages.Command.SubcommandGroup(options.name));
    if ('isNSFW' in options && typeof options.isNSFW !== 'boolean') debugError(ErrorMessages.Command.NSFW(options.name))
    if ('executable' in options && typeof options.executable !== 'function') debugError(ErrorMessages.Command.Executable(options.name));

}