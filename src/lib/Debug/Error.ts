import { ETerminalColors } from './index';
export const ErrorMessages = {
    Client: {
        ClientId: 'El ID de cliente ingresado es inválido',
        ClientToken: 'El token ingresado es inválido',
        EventsPath: 'La ruta de eventos ingresada es inválida',
        CommandsPath: 'La ruta de comandos ingresado es inválido',
        Intents: 'Uno o más "intents" ingresados son inválidos',
        Partials: 'Uno o más "partials" ingresados son inválidos',
        Presence: 'Uno o más elementos de "presence" ingresados son inválidos',
        PresenceUpdateFrequency: 'El tiempo de intervalo para los "presence" es inválido',
        PresenceUpdateStatus: 'El orden de actualización para los "presence" es inválido'
    },
    Command: {
        Name: 'El nombre de un comando ingresado es inválido o inexistente',
        NSFW: (commandName = 'Desconocido') => `El valor "NSFW" del comando "${commandName}" es inválido`,
        Description: (commandName = 'Desconocido') => `La descripción del comando "${commandName}" es inválida.`,
        Options: (commandName = 'Desconocido') => `La propiedad "options" del comando "${commandName}" es inválido o contiene elementos inválidos`,
        Subcommand: (commandName = 'Desconocido') => `Los sub-comandos del comando "${commandName}" son inválido o contiene elementos inválidos`,
        SubcommandGroup: (commandName = 'Desconocido') => `El grupo de sub-comandos del comando "${commandName}" son inválidos o contiene elementos inválidos`,
        Executable: (commandName = 'Desconocido') => `La función a ejecutar tras la invocación del comando "${commandName}" es inválida`
    },
    Event: {
        Name: `El nombre de un comando no es válido`,
        Executable: (eventName = 'Desconocido') => `La función a ejecutar tras la invocación del evento "${eventName}" es inválida`
    }
}

export default class extends Error {
    constructor(message: string) {
        super(`${ETerminalColors.BrightRed}ERROR:${ETerminalColors.BrightWhite} ${message}${ETerminalColors.Reset}`);
    }
}