import { Command } from '../Commands';
import Error from './Error';
export { ErrorMessages } from './Error';
export enum ETerminalColors {
    Reset = '\x1b[0m',
    Black = '\x1b[30m',
    Red = '\x1b[31m',
    Green = '\x1b[32m',
    Yellow = '\x1b[33m',
    Blue = '\x1b[34m',
    Magenta = '\x1b[35m',
    Cyan = '\x1b[36m',
    White = '\x1b[37m',
    BrightBlack = '\x1b[30;1m',
    BrightRed = '\x1b[31;1m',
    BrightGreen = '\x1b[32;1m',
    BrightYellow = '\x1b[33;1m',
    BrightBlue = '\x1b[34;1m',
    BrightMagenta = '\x1b[35;1m',
    BrightOrange = '\x1b[38;5;202m',
    BrightCyan = '\x1b[36;1m',
    BrightWhite = '\x1b[37;1m',
    Orange = '\x1b[38;5;208m',
    Maroon = '\x1b[38;5;52m'
}

export const debug = (text: string): void => console.debug(text);

export const debugError = (errorMessage: string) => {
    throw new Error(errorMessage);
}
export const highlight = (text: string|number, color = ETerminalColors.BrightYellow) => `${color}${text}${ETerminalColors.BrightWhite}`;

export const debugSuccess = (message: string) => debug(`${ETerminalColors.BrightGreen}ÉXITO:${ETerminalColors.BrightWhite} ${message} ${ETerminalColors.Reset}`);
export const debugBot = (message: string) => debug(`${ETerminalColors.BrightCyan}BOT:${ETerminalColors.BrightWhite} ${message} ${ETerminalColors.Reset}`);
export const debugCommand = (message: string) => debug(`${ETerminalColors.BrightOrange}COMANDO:${ETerminalColors.BrightWhite} ${message}${ETerminalColors.Reset}`);
export const debugEvent = (message: string) => debug(`${ETerminalColors.BrightYellow}EVENTO:${ETerminalColors.BrightWhite} ${message}${ETerminalColors.Reset}`);
export const debugInfo = (message: string) => debug(`${ETerminalColors.BrightBlue}INFORMACIÓN:${ETerminalColors.BrightWhite} ${message}${ETerminalColors.Reset}`);
export const debugCommandLoaded = (command: Command) => debug(`${ETerminalColors.BrightOrange}COMANDO:${ETerminalColors.BrightWhite} ${highlight(command.name)} cargado. | [${highlight(command.options.length)}] Opción(es) cargada(s) | [${highlight(command.subcommands.length)}] Subcomando(s) cargado(s) | [${highlight(command.subcommandsGroup.length)}] Grupo Subcommando(s) cargado(s)${ETerminalColors.Reset}`)
export const debugEventLoaded = (event:any) => debug(`${ETerminalColors.BrightYellow}EVENTO:${ETerminalColors.BrightWhite} ${highlight(event.name, ETerminalColors.BrightMagenta)} cargado ${ETerminalColors.Reset}`);