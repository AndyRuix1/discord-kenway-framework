import {
    GatewayIntentBits,
    Partials,
    ActivitiesOptions,
    PresenceUpdateStatus
} from "discord.js";


export interface IActivities extends ActivitiesOptions {
    /**
     * Estado que se mostrara del cliente Discord
     */
    status?: PresenceUpdateStatus
    _id?: Symbol;
}

export enum EPresenceUpdateStatus {
    /**
     * Se elige cualquier elemento al azar sin repetir el anterior
     */
    Random = 'random',
    /**
     * El orden original, cuando llega al final, regresa al principio
     */
    OriginalOrder = 'original'
}

export interface IClient$Presence {
    activities: IActivities[];
    presenceUpdateFrequency: number;
    updateOrder: EPresenceUpdateStatus;
}

export interface IClient$SetPresence {
    /**
     * Actividades del cliente Discord
     */
    presenceActivities: Omit<IActivities, '_id'> | Omit<IActivities, '_id'>[];
    /**
     * Frecuencia de actualización de los presence (en MS)
     */
    presenceUpdateFrequency?: number;
    /**
     * Order de actualización de los presence
     */
    updateOrder?: EPresenceUpdateStatus;
}


export interface IClient {
    /**
     * Token de cliente Discord.
     */
    token?: string;

    /**
     * ID de cliente Discord.
     */
    clientId?: string;

    /**
     * Ruta contenedora de los comandos [.js, .ts].
     */
    commandsPath?: string;

    /**
     * Ruta contenedora de los eventos [.js, .ts].
     */
    eventsPath?: string;

    /**
     * Intents del cliente Discord.
     */
    intents?: GatewayIntentBits[];

    /**
     * Partials del cliente Discord.
     */
    partials?: Partials[];

    /**
     * Estados que mostrará el cliente Discord.
     */
    presence?: Omit<IActivities, '_id'>[] | Omit<IActivities, '_id'>;

    /**
     * Frecuencia de tiempo con la que debe cambiarse el presence, en ms.
     */
    presenceUpdateFrequency?: number;

    /**
     * Orden en el que debe cambiarse los presence previamente ingresados.
     */
    presenceUpdateChangeOrder?: EPresenceUpdateStatus;
}
