import { Client as DiscordClient, ClientEvents, Events } from 'discord.js';

export interface IEvent<K> {
    /**
     * Nombre del evento
     */
    name: K,
    /**
     * Establecer función a ejecutar cuando el evento sea invocado
     * @param client Cliente de Discord
     * @param {ClientEvents[K]} args Argumentos del evento
     */
    //@ts-ignore
    execute: (client: DiscordClient<true>, ...args: ClientEvents[K]) => void
}