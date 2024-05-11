import {
    Client as DiscordClient,
    REST,
    GatewayIntentBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
    Partials,
    Events,
    PresenceUpdateStatus,
    ActivityType
} from 'discord.js';
import { TCommand, Command, createSlashCommand } from '../Commands';
import { EPresenceUpdateStatus, IActivities, IClient, IClient$Presence, IClient$SetPresence } from './Client.types';
import fs from 'fs';

import { debugError, ErrorMessages, debugCommand, debugEvent, debugBot, ETerminalColors, debugSuccess, debugInfo, debugCommandLoaded, debugEventLoaded, highlight } from '../Debug';

import { getFiles } from '../utils';
import { join as pathJoin, basename, dirname } from 'path';
import { stringPropertyAreValid, validateCommandOptions } from '../utils';
import { startPresenceService } from './Client.presence';

export default class Client {
    private clientId: string = '';
    private clientToken: string = '';
    private commandsPath: string = '';
    private eventsPath: string = '';
    private intents: GatewayIntentBits[] = [];
    private partials: Partials[] = [];
    private presences: IClient$Presence = {
        activities: [],
        presenceUpdateFrequency: 0,
        updateOrder: EPresenceUpdateStatus.OriginalOrder
    }

    private commands: TCommand[] = [];
    private events: { name: string; execute: (...args: any) => void; }[] = [];

    /**
     * Crear nueva instancia de un cliente Discord
     * @param {IClient} options - Opciones para crear nueva instancia de un nuevo cliente
     */
    constructor(options?: IClient) {
        //. Asignación de propiedades privadas por medio de objeto en constructor
        if (typeof options === 'object') {
            if ('clientId' in options && typeof options.clientId === 'string' && !stringPropertyAreValid(options.clientId)) debugError(ErrorMessages.Client.ClientId);
            if ('token' in options && typeof options.token === 'string' && !stringPropertyAreValid(options.token)) debugError(ErrorMessages.Client.ClientToken);
            if ('eventsPath' in options && typeof options.eventsPath === 'string' && !stringPropertyAreValid(options.eventsPath)) debugError(ErrorMessages.Client.CommandsPath);
            if ('commandsPath' in options && typeof options.commandsPath === 'string' && !stringPropertyAreValid(options.commandsPath)) debugError(ErrorMessages.Client.EventsPath);
            if ('intents' in options && options.intents && !this.areIntentsValid(options.intents)) debugError(ErrorMessages.Client.Intents);
            if ('partials' in options && options.partials && !this.arePartialsValid(options.partials)) debugError(ErrorMessages.Client.Partials)
            if ('presence' in options && options.presence && !this.arePresenceValid(options.presence)) debugError(ErrorMessages.Client.Presence);
            if ('presenceUpdateFrequency' in options && options.presenceUpdateFrequency && typeof options.presenceUpdateFrequency !== 'number') debugError(ErrorMessages.Client.PresenceUpdateFrequency);
            if ('presenceUpdateChangeOrder' in options && options.presenceUpdateChangeOrder && !Object.keys(EPresenceUpdateStatus).includes(options.presenceUpdateChangeOrder)) debugError(ErrorMessages.Client.PresenceUpdateStatus);

            if (options?.clientId) this.clientId = options.clientId;
            if (options?.token) this.clientToken = options.token;
            if (options?.commandsPath) this.commandsPath = options.commandsPath;
            if (options?.eventsPath) this.eventsPath = options.eventsPath;
            if (options?.intents) this.intents = options.intents;
            if (options?.partials) this.partials = options.partials;
            if (options?.presence) this.presences.activities = [options.presence].flatMap(x => x);
            if (options?.presenceUpdateFrequency) this.presences.presenceUpdateFrequency = options.presenceUpdateFrequency;
            if (options?.presenceUpdateChangeOrder) this.presences.updateOrder = options.presenceUpdateChangeOrder;
            this.start();
        }
    }

    //. Asignación de propiedades privadas por medio de métodos

    /**
     * Establecer ID del cliente Discord
     * @param clientId ID del cliente Discord
     */
    public setClientId(clientId: string): this {
        if (!stringPropertyAreValid(clientId)) return debugError(ErrorMessages.Client.ClientId);
        this.clientId = clientId;
        return this;
    }

    /**
     * Establecer Token del cliente Discord
     * @param token Token del cliente Discord
     */
    public setToken(token: string): this {
        if (!stringPropertyAreValid(token)) return debugError(ErrorMessages.Client.ClientToken);
        this.clientToken = token;
        return this;
    }

    /**
     * Establecer rutas para comandos
     * @param path Ruta de los comandos
     */
    public setCommandsPath(path: string): this {
        if (!stringPropertyAreValid(path)) return debugError(ErrorMessages.Client.EventsPath);
        this.commandsPath = path;
        return this;
    }

    /**
     * Establecer rutas para eventos
     * @param path Ruta de los eventos
     */
    public setEventsPath(path: string): this {
        if (!stringPropertyAreValid(path)) return debugError(ErrorMessages.Client.CommandsPath);
        this.eventsPath = path;
        return this;
    }

    /**
     * Establecer intents del cliente Discord.
     * @param intents Arreglo de intents del cliente Discord
     */
    public setIntents(intents: GatewayIntentBits[]): this {
        if (!this.areIntentsValid(intents)) return debugError(ErrorMessages.Client.Intents);
        this.intents = intents;
        return this;
    }

    /**
     * Establecer partials del cliente Discord
     * @param partials - Arreglo de partials del cliente Discord
     * @returns 
     */
    public setPartials(partials: Partials[]) {
        if (!this.arePartialsValid(partials)) debugError(ErrorMessages.Client.Partials);
        this.partials = partials;
        return this;
    }

    /**
     * Establecer presence dinámicos para el cliente Discord
     * @param options Opciones para crear presence dinámicos para el cliente Discord
     */
    public setPresence(options: IClient$SetPresence) {

        const { presenceActivities, presenceUpdateFrequency = 10000, updateOrder = EPresenceUpdateStatus.OriginalOrder } = options;
        if (!this.arePresenceValid(presenceActivities)) debugError(ErrorMessages.Client.Presence);
        if (typeof presenceUpdateFrequency != 'number') debugError(ErrorMessages.Client.PresenceUpdateFrequency);
        if (Object.keys(EPresenceUpdateStatus).includes(updateOrder)) debugError(ErrorMessages.Client.PresenceUpdateStatus);
        const activities = !Array.isArray(presenceActivities) ? [presenceActivities] : presenceActivities;
        const activitiesWithId = activities.map(activity => ({ ...activity, _id: Symbol('activity_id') }));
        this.presences = { activities: activitiesWithId, presenceUpdateFrequency, updateOrder };
        return this;
    }

    /**
     * Iniciar ejecución posterior a la configuración del cliente
     */
    public async start(): Promise<void> {

        debugInfo('Iniciando...');
        await this._loadCommands();
        this._loadEvents();
        debugBot(`[${highlight(this.intents.length)}] intent(s) cargado(s) | [${highlight(this.partials.length)}] partial(s) cargado(s)`);
        debugBot(`[${highlight(this.presences.activities.length)}] presence(s) cargados | cambio automático: ${highlight(`${this.presences.presenceUpdateFrequency / 1000}s`)}`);

        const client = new DiscordClient<true>({ intents: this.intents, partials: this.partials });

        if (this.events.length > 0) for (const event of this.events) {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        client.on(Events.InteractionCreate, interaction => {
            if (!interaction.isChatInputCommand()) return;
            const command = this.commands.find(x => x.name === interaction.commandName);
            if (command) command.execute(client, interaction);
        });

        client.on(Events.ClientReady, (client) => {
            debugBot(`Iniciado satisfactoriamente como ${ETerminalColors.BrightYellow}${client.user.tag}${ETerminalColors.Reset}`);
            debugSuccess('Carga finalizada.');
        });


        await client.login(this.clientToken).then(() => {
            if (this.presences.activities.length > 0) startPresenceService(client, this.presences);
        }).catch((reason) => {
            if (typeof reason !== 'string') reason = JSON.stringify(reason, null, 2);
            debugError(`Problema al iniciar el servicio del bot: ${reason}`);
        });
    }


    //* Cargadores

    private async _loadCommands() {
        debugCommand(`Iniciando carga de comandos...`);
        if (this.commandsPath.length === 0) debugCommand('No se ha establecido una ruta de comandos');
        if (!fs.existsSync(this.commandsPath)) debugError(`La ruta establecida para comandos es inválida: ${this.commandsPath}`);

        const slashCommandsBody: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        if (this.commandsPath.length > 0) {
            const commandsLoaded = getFiles(this.commandsPath, ['.js', '.ts']);
            if (commandsLoaded.length > 0) {
                for (const commandLoaded of commandsLoaded) {
                    const filename = basename(commandLoaded);
                    if (filename.endsWith('.ignore.ts') || filename.endsWith('ignore.js')) {
                        debugCommand(`ignorado: ${highlight(filename, ETerminalColors.BrightCyan)}`);
                        continue;
                    }
                    const filepath = dirname(commandLoaded);
                    const requiredFile = require(pathJoin(filepath, filename));
                    const command: Command = requiredFile?.default ? requiredFile.default : requiredFile;
                    validateCommandOptions(command);
                    debugCommandLoaded(command);
                    const slashCommand = createSlashCommand(command);
                    slashCommandsBody.push(slashCommand.toJSON());
                    this.commands.push(command);
                }
                debugCommand('Todos los comandos han sido cargados');
            } else debugCommand('No se han encontrado archivos de comandos');

        }

        debugCommand(`Actualizando slash commands...`);
        const rest = new REST({ version: '10' }).setToken(this.clientToken);

        const slashCommandsUpdateStatus = await rest.put(Routes.applicationCommands(this.clientId), { body: slashCommandsBody }).catch((e) => e);
        if (slashCommandsUpdateStatus === false) debugError('Ha ocurrido un error al actualizar los slash commands. Verifica los comandos');
        debugCommand('Los slash commands han sido actualizados correctamente');
    }

    private _loadEvents() {
        debugEvent('Iniciando carga de eventos...');
        if (this.eventsPath.length === 0) return debugEvent('No se ha establecido una ruta de eventos');
        if (!fs.existsSync(this.eventsPath)) debugError(`La ruta establecida para eventos es inválida: ${this.eventsPath}`);

        const eventsLoaded = getFiles(this.eventsPath, ['.js', '.ts']);
        if (eventsLoaded.length === 0) return debugEvent('No se han encontrado archivos de eventos en la ruta asignada');
        for (const eventLoaded of eventsLoaded) {
            const filepath = dirname(eventLoaded);
            const filename = basename(eventLoaded);
            if (filename.endsWith('.ignore.ts') || filename.endsWith('ignore.js')) {
                debugEvent(`ignorado: ${highlight(filename, ETerminalColors.BrightCyan)}`);
                continue;
            }
            const fileRequired = require(pathJoin(filepath, filename));
            const event = fileRequired?.default ? fileRequired.default : fileRequired;
            debugEventLoaded(event);
            this.events.push(event);
        }
        debugEvent('Todos los eventos han sido cargados');
    }

    //. Validaciones simples de la creación de cliente

    private areIntentsValid(intents: GatewayIntentBits[]): boolean {
        const validIntents = Object.values(GatewayIntentBits);
        if (!Array.isArray(intents) || !intents.some(i => validIntents.includes(i))) return false;
        return true;
    }

    private arePartialsValid(partials: Partials[]) {
        const validPartials = Object.values(Partials);
        if (!Array.isArray(partials) || !partials.some(p => validPartials.includes(p))) return false;
        return true;
    }

    private arePresenceValid(presenceList: IActivities[] | IActivities): boolean {
        const validPresenceStatus = Object.values(PresenceUpdateStatus);
        const validPresenceActivity = Object.values(ActivityType);
        if (!Array.isArray(presenceList) && typeof presenceList !== 'object' && presenceList === null) return false;
        presenceList = [presenceList].flatMap(x => x);
        for (const presence of presenceList) {
            if (typeof presence.status === 'string' && !validPresenceStatus.includes(presence.status)) return false;
            if (typeof presence.type === 'string' && !validPresenceActivity.includes(presence.type)) return false;
        }
        return true;
    }

}