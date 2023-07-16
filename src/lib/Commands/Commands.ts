import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandAttachmentOption, SlashCommandStringOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, ChatInputCommandInteraction, SlashCommandUserOption } from "discord.js";
import { debugError, ErrorMessages } from "../Debug";
import { stringPropertyAreValid, isInstanceOfTCommandOptions } from "../utils";
import { TCommand, TCommand$Options } from "./Commands.types";


export default class Command {
    private _name: string = '';
    private _description: string = '';
    private _options: TCommand$Options[] = [];
    private _subcommands: SlashCommandSubcommandBuilder[] = [];
    private _subcommandsGroup: SlashCommandSubcommandGroupBuilder[] = [];
    private _isNSFW: boolean = false;
    private _execute: TCommand['execute'] = () => null;

    //.Getters Start
    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get options(): TCommand$Options[] {
        return this._options;
    }

    get subcommands(): SlashCommandSubcommandBuilder[] {
        return this._subcommands;
    }

    get subcommandsGroup(): SlashCommandSubcommandGroupBuilder[] {
        return this._subcommandsGroup;
    }

    get isNSFW(): boolean {
        return this._isNSFW;
    }

    get execute(): TCommand['execute'] {
        return this._execute;
    }
    //. Getters End


    /**
     * Crear nueva instancia de un nuevo comando para el cliente Discord
     * @param options Opciones para crear un nuevo bot
     */
    constructor(options?: TCommand) {
        if (typeof options === 'object') {
            this.validateCommandOptions(options);
            if ('name' in options && typeof options.name === 'string') this._name = options.name;
            if ('description' in options && typeof options.description === 'string') this._description = options.description;
            if ('isNSFW' in options) this._isNSFW = options.isNSFW ?? false;
            if ('execute' in options) this._execute = options.execute;
            if ('options' in options) this._options = [options.options ?? []].flatMap(x => x);
            if ('subcommands' in options) this._subcommands = [options.subcommands ?? []].flatMap(x => x);
            if ('subcommandsGroup' in options) this._subcommandsGroup = [options.subcommandsGroup ?? []].flatMap(x => x);
        }
    }

    /**
     * Establecer nombre del comando
     * @param commandName Nombre del comando
     */
    public setName(commandName: string): this {
        if (!stringPropertyAreValid(commandName) || /(A-Z)/gi.test(commandName) || commandName.includes(' ')) debugError(ErrorMessages.Command.Name);
        this._name = commandName;
        return this;
    }

    /**
     * Establecer descripción del comando
     * @param commandDescription Descripción del comando 
     */
    public setDescription(commandDescription: string): this {
        if (!stringPropertyAreValid(commandDescription)) debugError(ErrorMessages.Command.Description(this._name));
        this._description = commandDescription;
        return this;
    }

    /**
     * Establecer opciones para el comando
     * @param options Opciones del comando
     */
    public setOptions(options: TCommand$Options | TCommand$Options[]): Omit<this, 'setSubcommands' | 'setSubcommandsGroup'> {
        options = [options].flatMap(x => x);
        if (!options.some(o => isInstanceOfTCommandOptions(o))) debugError(ErrorMessages.Command.Options(this._name));
        this._options = options;
        return this;
    }

    /**
     * Establecer subcomandos al comando
     * @param subcommands Arreglo de Subcomandos
     */
    public setSubcommands(subcommands: SlashCommandSubcommandBuilder | SlashCommandSubcommandBuilder[]): Omit<this, 'setOptions'> {
        subcommands = [subcommands].flatMap(x => x);
        if (!subcommands.some(s => s instanceof SlashCommandSubcommandBuilder)) debugError(ErrorMessages.Command.Subcommand(this._name));
        this._subcommands = subcommands;
        return this;
    }

    /**
     * Establecer grupo de subcomandos 
     * @param subcommandsGroup Arreglo de grupo de subcommandos
     */
    public setSubcommandsGroup(subcommandsGroup: SlashCommandSubcommandGroupBuilder[] | SlashCommandSubcommandGroupBuilder) {
        subcommandsGroup = [subcommandsGroup].flatMap(x => x);
        if (!Array.isArray(subcommandsGroup) || !subcommandsGroup.some(s => s instanceof SlashCommandSubcommandGroupBuilder)) debugError(ErrorMessages.Command.SubcommandGroup(this._name));
        this._subcommandsGroup = subcommandsGroup;
        return this as Omit<this, 'setOptions'>;
    }

    /**
     * Método para establecer la función a ejecutar cuando el comando sea invocado
     * @param executable Función a ejecutar 
     */
    public setExecutable(executable: TCommand['execute']): this {
        if (typeof executable !== 'function') debugError(ErrorMessages.Command.Executable(this._name));
        this._execute = executable;
        return this;
    }

    /**
     * Establecer si el comando es NSFW
     * @param isNSFW Estado NSFW del comando
     */
    public setIsNSFW(isNSFW: boolean): this {
        if (typeof isNSFW !== 'boolean') debugError(ErrorMessages.Command.NSFW(this._name));
        this._isNSFW = isNSFW;
        return this;
    }

    //. Validadores simples
    private validateCommandOptions(options: TCommand) {
        if ('name' in options && (!stringPropertyAreValid(options.name) || options.name.includes(' ') || /(A-Z)/gi.test(options.name))) debugError(ErrorMessages.Command.Name);
        if ('description' in options && !stringPropertyAreValid(options.description)) debugError(ErrorMessages.Command.Description(this._name));
        if ('options' in options && options.options && (!Array.isArray(options.options) || options.options.some(o => !isInstanceOfTCommandOptions(o)))) debugError(ErrorMessages.Command.Options(this._name));
        if ('subcommands' in options && options.subcommands && (!Array.isArray(options.subcommands) || options.subcommands.some(s => s instanceof SlashCommandSubcommandBuilder))) debugError(ErrorMessages.Command.Subcommand(this._name));
        if ('subcommandsGroup' in options && options.subcommandsGroup && (!Array.isArray(options.subcommandsGroup) || options.subcommandsGroup.some(s => s instanceof SlashCommandSubcommandGroupBuilder))) debugError(ErrorMessages.Command.SubcommandGroup(this._name));
        if ('isNSFW' in options && typeof options.isNSFW !== 'boolean') debugError(ErrorMessages.Command.NSFW(this._name))
        if ('executable' in options && typeof options.executable !== 'function') debugError(ErrorMessages.Command.Executable(this._name));
    }

}

export const createSlashCommand = (command: Command): SlashCommandBuilder => {
    const slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setNSFW(command.isNSFW);

    if (command.options.length > 0) for (const commandOption of command.options) {
        if (commandOption instanceof SlashCommandAttachmentOption) slashCommand.addAttachmentOption(commandOption);
        else if (commandOption instanceof SlashCommandStringOption) slashCommand.addStringOption(commandOption);
        else if (commandOption instanceof SlashCommandBooleanOption) slashCommand.addBooleanOption(commandOption);
        else if (commandOption instanceof SlashCommandChannelOption) slashCommand.addChannelOption(commandOption);
        else if (commandOption instanceof SlashCommandIntegerOption) slashCommand.addIntegerOption(commandOption);
        else if (commandOption instanceof SlashCommandMentionableOption) slashCommand.addMentionableOption(commandOption);
        else if (commandOption instanceof SlashCommandNumberOption) slashCommand.addNumberOption(commandOption);
        else if (commandOption instanceof SlashCommandRoleOption) slashCommand.addRoleOption(commandOption);
        else if (commandOption instanceof SlashCommandUserOption) slashCommand.addUserOption(commandOption);
    }

    if (command.subcommands.length > 0) for (const subcommand of command.subcommands) {
        slashCommand.addSubcommand(subcommand);
    }

    if (command.subcommandsGroup.length > 0) for (const subcommandGroup of command.subcommandsGroup) {
        slashCommand.addSubcommandGroup(subcommandGroup);
    }

    return slashCommand;
}