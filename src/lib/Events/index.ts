import type { IEvent } from "./Events.types";
import { type ClientEvents, Client as DiscordClient, Events } from "discord.js";
import { debugError, ErrorMessages } from "../Debug";
import { stringPropertyAreValid } from "../utils";


export default class Event<K extends keyof ClientEvents> {
    //@ts-ignore
    private _name: K = Events.ClientReady;
    private _execute: (client: DiscordClient<true>, ...args: ClientEvents[K]) => void = () => null;

    get name() {
        return this._name;
    }

    get execute() {
        return this._execute;
    }

    /**
     * Crear nueva instancia de un evento para el cliente Discord
     * @param options Opciones del evento
     */
    constructor(options?: IEvent<K>) {
        if (typeof options === 'object') {
            if ('name' in options && typeof options.name === 'string' && !stringPropertyAreValid(options.name)) debugError(ErrorMessages.Event.Name);
            if ('execute' in options && typeof options.execute !== 'function') debugError(ErrorMessages.Event.Executable(this.name));
            this._name = options.name;
            this._execute = options.execute;
        }
    }

    /**
     * Establecer nombre del evento
     * @param name Nombre del evento a ejecutar
     */
    public setName<E extends keyof ClientEvents>(name: E) {
        if (typeof name !== 'string') debugError(ErrorMessages.Event.Name);
        this._name = name as unknown as K;
        return {
            /**
             * Establecer función a ejecutar cuando el evento sea invocado
             * @param execute Función a ejecutar
             */
            setExecute: (execute: (client: DiscordClient<true>, ...args: ClientEvents[E]) => void) => {
                if (typeof execute !== 'function') debugError(ErrorMessages.Event.Executable(this.name));
                this._execute = execute as any;
            }
        };
    }

}
