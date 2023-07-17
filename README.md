<div style="width:100%; ">
<img width="100%" 
src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWdwMGxwcjB5Z2Y2N2w3ODl0aDlqbngxMWw5OWs0N3pkYjNxYmloYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1jrssvSn1pxxGDlchl/giphy.gif"/>
</div>

> Un potente framework de Discord.js que te permite crear fácilmente comandos, eventos y configurar el cliente de [Discord](https://www.npmjs.com/package/discord.js). Diseñado para facilitar el desarrollo de bots, este framework ofrece una estructura flexible que permite organizar tus comandos y eventos en carpetas personalizadas. Además, proporciona funcionalidades avanzadas, como la capacidad de cambiar dinámicamente los 'presence' del bot en un orden específico definido por el usuario, permitiendo una mayor personalización y respuesta a las necesidades de tu comunidad. Con el control total sobre el tiempo de frecuencia deseado, puedes mantener actualizada la presencia del bot de acuerdo con tus preferencias. ¡Simplifica y acelera la creación de bots de Discord con este framework versátil y poderoso!

## 🔍 Por qué usar este framework

* **Mayor productividad**: Con este framework, puedes crear fácilmente comandos, eventos y configurar el cliente de Discord. Ahorrarás tiempo en la configuración básica y podrás desarrollar bots de Discord de manera más eficiente.

* **Organización mejorada**: El framework ofrece una estructura flexible que te permite organizar tus comandos y eventos en carpetas personalizadas, incluso con la capacidad de crear ramas de carpetas. Esto te brinda una mayor organización y experiencia al programar, permitiéndote estructurar tu código de manera lógica y escalable.

* **Funcionalidades avanzadas**: Podrás aprovechar funcionalidades avanzadas, como cambiar dinámicamente los estados de presencia del bot en un orden específico definido por ti. Esto te permitirá personalizar la apariencia y la respuesta del bot según las necesidades de tu comunidad.

* **Mayor personalización**: Tendrás control total sobre el tiempo de frecuencia para actualizar la presencia del bot. Podrás ajustar y configurar el tiempo de actualización según tus preferencias, manteniendo así la información de presencia del bot siempre actualizada.

* **Soporte para Discord.js**: Este framework se integra con la biblioteca Discord.js, lo que te brinda acceso a todas las funcionalidades y características de Discord.js y te permite aprovechar su potencia y flexibilidad en el desarrollo de bots de Discord.

* **Versatilidad y potencia**: Este framework es versátil y poderoso, lo que te brinda herramientas y recursos para crear bots de Discord altamente personalizados y con funcionalidades avanzadas, adaptados a las necesidades específicas de tu comunidad.

## 📚 Índice

Bienvenido/a, esta es la guía para navegación en la página.

> * [Historial de cambios](#📜-Historial-de-cambios)
> * [Instalación](#⤵️-Instalación)
> * [Crear instancia de  un nuevo cliente](#🆕-Instanciar-un-nuevo-cliente)
> * [Creación de comandos](#💬-Creación-de-comandos)
> * [Creación de eventos](#⚡-Creación-de-eventos)
> * [Estructuras de archivos](#📁-Estructura-de-carpetas-para-eventos-y-comandos)
> * [Desarrollo](#🛠️-Desarrollo)

## 📜 Historial de cambios
* Para acceder al historial de cambios completo del paquete, consulta [este enlace]((https://github.com/AndyRuix1/discord-kenway-framework/blob/main/CHANGELOG.md)).


## ⤵️ Instalación

```console
$ npm i discord-kenway-framework
```

## 📦 Requerimiento del paquete

#### ES Import: 

```js
import kenwayDiscord from 'discord-kenway-framework';
```

#### CJS:

```js
const kenwayDiscord = require('discord-kenway-framework');
```

## 🆕 Instanciar un nuevo cliente

#### Para realizar una nueva instancia de un cliente tienes las siguientes opciones para asignar:

* <small>(*)</small> - Token - [<small>Obtener</small>](https://discord.com/developers/applications)
* <small>(*)</small> - ID de cliente - [<small>Obtener</small>](https://discord.com/developers/applications)
* <small>(?)</small> - Ruta para tus comandos
* <small>(?)</small> - Ruta para tus eventos
* <small>(?)</small> - Intents
* <small>(?)</small> - Partials
* <small>(?)</small> - Presence

#### Hay dos formas de configurar estos valores:

* Desde el constructor con un objeto de configuraciones
* Con encadenamiento de métodos

### 🌟 Ejemplos

#### Instancia con lo esencial:

```js
import { Client } from 'discord-kenway-framework';

// Por medio un objeto de ajustes en el constructor
// De este modo no hay necesidad de utilizar el método .start()
new Client({
    token: 'TOKEN',
    clientId: 'CLIENT_ID'
});

// Encadenando métodos
// De este modo es necesario utilizar .start() para iniciar
new Client()
    .setToken('TOKEN')
    .setClientId('CLIENT_ID')
    .start();
```

#### Instancia con más ajustes:

```js
import { join } from 'path';
import { Client, GatewayIntentBits, Partials } from 'discord-kenway-framework';

// Por medio del constructor
new Client({
    token: 'YOUR_TOKEN',
    clientId: 'YOUR_CLIENT_ID',
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.Message]
});

// Encadenamiento de métodos
new Client()
    .setToken('YOUR_TOKEN')
    .setClientId('YOUR_TOKEN')
    .setCommandsPath(join(__dirname, 'commands'))
    .setEventsPath(join(__dirname, 'events'))
    .setIntents([GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent])
    .setPartials([Partials.Message, Partials.Channel])
    .start();
```

#### Uso del presence dinámico

> #### Los presence dinámicos se refieren a la capacidad de cambiar automáticamente el estado o la presencia de un bot en Discord. Esto permite que el bot muestre diferentes estados (por ejemplo, "Jugando a un juego", "Escuchando música", "Viendo un video") a intervalos regulares.
> #### Con los presence dinámicos, puedes configurar el tiempo de frecuencia en milisegundos para cambiar el estado del bot. Por ejemplo, puedes establecer que el estado se actualice cada 5 minutos o cada hora, según tus preferencias, también, puedes establecer el orden de actualización, puedes optar por un orden aleatorio (sin repetir el estado anterior), donde los estados se cambian en forma aleatoria, o mantener el orden original en el que fueron ingresados.

#### Creación de cliente con presence dinámico:

```js
import { PresenceUpdateStatus, EPresenceUpdateStatus } from 'discord-kenway-framework';

const activities = [{
        status: PresenceUpdateStatus.Online,
        name: 'GTA V',
        type: ActivityType.Playing
    },
    {
        status: PresenceUpdateStatus.Idle,
        name: 'Streamings, ocupado.',
        type: ActivityType.Watching
    }];

// Desde el constructor
new Client({
    (...) //otros ajustes
    presence: activities,
    presenceUpdateChangeOrder: EPresenceUpdateStatus.OriginalOrder, // Respetar orden original
    presenceUpdateFrequency: 5000 // Frecuencia de cambio en ms
});

// Encadenando métodos
new Client()
    .setPresence({
        presenceActivities: activities,
        updateOrder: EPresenceUpdateStatus.Random, //Al azar
        presenceUpdateFrequency: 8000 // Frecuencia de cambio en MS
    }).start();
```

## 💬 Creación de comandos

#### Para crear un nuevo comando tienes las siguientes opciones para asignar:

* (<small>*</small>) - Nombre
* (<small>*</small>) - Descripción
* (<small>?</small>) - Opciones
* (<small>?</small>) - Subcomandos
* (<small>?</small>) - Grupo de subcomandos
* (<small>?</small>) - Estado NSFW
* (<small>*</small>) - Función a ejecutar cuando se invoque el comando.

#### Hay dos formas de configurar estos valores:

* Desde el constructor con un objeto de configuraciones
* Con encadenamiento de métodos

##### Recuerda que para crear un comando, previamente debes crear una carpeta contenedora de estos y configurarla en el cliente.

### 🌟 Ejemplos

> #### Ruta de ejemplo: /mi-bot/comandos/comando.js
> ##### Puedes usar extensión .ts y .js

#### En caso de utilizar ESM puedes usar `export default`

```js
import { Command } = from 'discord-kenway-framework';
export default new Command()...
```

#### En caso de cjs usas `module.exports`

```js
const { Command } = require('discord-kenway-framework');
module.exports = new Command()...
```

#### Creación de un comando `ping-pong` con lo esencial

```js
// Con objeto de configuraciones
import { Command } from 'discord-kenway-framework';

export default new Command({
    name: 'ping',
    description: 'Responder "pong"!',
    execute: (client, interaction) => {
        interaction.reply({ content: 'Pong!' });
    }
});

// Con encadenamiento de métodos

export default new Command()
    .setName('ping')
    .setDescription('Responder "pong"!')
    .setExecutable((client, interaction) => {
        interaction.reply({ content: 'Pong!' })
    })
```

#### Uso de opciones en el comando

 >##### Para utilizar las opciones en un comando debes crearlas con los constructores de Discord JS los cuales son exportados nativamente por el framework

```js
import { Command, SlashCommandStringOption } from 'discord-kenway-framework';

const pongTypeOption = new SlashCommandStringOption()
    .setName('pong-type')
    .setDescription('Responder "pong" de distintas formas')
    .setRequired(true)
    .addChoices({
        name: 'normal',
        value: 'normal'
    })
    .addChoices({
        name: 'grande',
        value: 'big'
    });

// Con objeto de configuraciones
export default new Command({
    name: 'ping',
    description: 'Responder "pong" de dos formas',
    options: pongTypeOption,
    execute: (client, interaction) => {
        const pongType = interaction.options.get('pong-type', true).value;
        if (pongType === 'big') return interaction.reply({
            content: 'Pooooonggg!'
        });
        else if (pongType === 'normal') return interaction.reply({
            content: 'Pong!'
        });
    }
})

// Encadenando métodos
export default new Command()
    .setName('ping')
    .setDescription('responder "pong" de dos formas')
    .setOptions(pongTypeOption)
    .setExecutable((client, interaction) => {
        const pongType = interaction.options.get('pong-type', true).value;
        if (pongType === 'big') return interaction.reply({ content: 'Pooooonggg!' });
        else if (pongType === 'normal') return interaction.reply({ content: 'Pong!' });
    })
```

🔸 **Nota**: Las opciones ingresadas pueden ser un arreglo de distintas opciones.

#### Uso de subcomandos y grupos de subcomandos en el comando

 >#### Para utilizar subcomandos y grupos de subcomandos en un comando debes crearlas con los constructores de Discord JS los cuales son exportados nativamente por el framework.
 

#### Subcomandos:

```js
import { Command, SlashCommandSubcommandBuilder, SlashCommandChannelOption, SlashCommandUserOption } from 'discord-kenway-framework';

const channelOption = new SlashCommandChannelOption()
    .setName('canal')
    .setDescription('canal a obtener información');

const mentionOption = new SlashCommandUserOption()
    .setName('user')
    .setDescription('usuario a obtener información');

const subcommand = new SlashCommandSubcommandBuilder()
    .setName('info')
    .setDescription('Obtener información')
    .addUserOption(mentionOption)
    .addChannelOption(channelOption);

// Con objeto de configuraciones
export default new Command({
    name: 'get',
    description: 'Obtener datos',
    subcommands: subcommand,
    execute: (client, interaction) => {
        const subCommand = interaction.options.getSubcommand(true);
        if (subCommand === 'info') {
            const user = interaction.options.getUser('user');
            const channel = interaction.options.getChannel('canal');
            let response = '';
            if (user) response += `Usuario: ${user.tag} (${user.id})\n`;
            if (channel) response += `Canal: ${channel.name} (${channel.id})\n`;
            if (!user && !channel) response = 'No se ha ingresado ninguna información a obtener';
            interaction.reply({ content: response });
        }
    }
})

// Encadenando métodos
export default new Command()
    .setName('get')
    .setDescription('Obtener datos')
    .setSubcommands(subcommand)
    .setExecutable((client, interaction) => {
        const subCommand = interaction.options.getSubcommand(true);
        if (subCommand === 'info') {
            const user = interaction.options.getUser('user');
            const channel = interaction.options.getChannel('canal');
            let response = '';
            if (user) response += `Usuario: ${user.tag} (${user.id})\n`;
            if (channel) response += `Canal: ${channel.name} (${channel.id})\n`;
            if (!user && !channel) response = 'No se ha ingresado ninguna información a obtener';
            interaction.reply({ content: response });
        }
    })
```

 🔸 **Nota**: Los subcomandos ingresados pueden ser un arreglo de varios subcomandos.

#### Grupo de subcomandos:

```js
import { Command, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord-kenway-framework';

const image100x100Subcommand = new SlashCommandSubcommandBuilder()
    .setName('100x100')
    .setDescription('Obtener imagen de 100x100');

const image200x200Subcommand = new SlashCommandSubcommandBuilder()
    .setName('200x200')
    .setDescription('Obtener imagen de 200x200');

const customImageChoice = new SlashCommandStringOption()
    .setName('custom-size')
    .setDescription('Ingrese el tamaño, ejemplo: 100x100')
    .setRequired(true);

const customImageSubcommand = new SlashCommandSubcommandBuilder()
    .setName('custom')
    .setDescription('Imagen con tamaño personalizado')
    .addStringOption(customImageChoice);

const subCommandGroup = new SlashCommandSubcommandGroupBuilder()
    .setName('get-image')
    .setDescription('get random image')
    .addSubcommand(image100x100Subcommand)
    .addSubcommand(image200x200Subcommand)
    .addSubcommand(customImageSubcommand);

// Con objeto de configuraciones
export default new Command({
    name: 'picsum',
    description: 'Obtener una imagen aleatoria de internet',
    subcommandsGroup: subCommandGroup,
    execute: (client, interaction) => {
        const subCommand = interaction.options.getSubcommand(true);
        const customSize = interaction.options.getString('size');
        if (customSize) return interaction.reply({
            content: `https://picsum.photos/${customSize.split('x')[0]}/${customSize.split('x')[1]}`,
            ephemeral: true
        });
        interaction.reply({
            content: `https://picsum.photos/${subCommand.split('x')[0]}/${subCommand.split('x')[1]}`,
            ephemeral: true
        });
    }
})

// Encadenando métodos
export default new Command()
    .setName('picsum')
    .setDescription('Obtener una imagen aleatoria de internet')
    .setSubcommandsGroup(subCommandGroup)
    .setExecutable((client, interaction) => {
        const subCommand = interaction.options.getSubcommand(true);
        const customSize = interaction.options.getString('size');
        if (customSize) return interaction.reply({
            content: `https://picsum.photos/${customSize.split('x')[0]}/${customSize.split('x')[1]}`,
            ephemeral: true
        });
        interaction.reply({
            content: `https://picsum.photos/${subCommand.split('x')[0]}/${subCommand.split('x')[1]}`,
            ephemeral: true
        });
    });
```

🔸 **Nota**: Los grupos de subcomandos ingresados pueden ser un arreglo de distintos grupos de subcomandos.

#### ⚠️ Advertencia:

* No se pueden usar opciones si tienes subcomandos o grupos de subcomandos.
* El nombre del comando no puede contener espacios ni mayúsculas.
* El máximo de caracteres establecido por discord es de 4.000, es decir, entre opciones o grupo subcomandos/subcomandos, titulo y descripción, el máximo de caracteres es de 4000.

## ⚡ Creación de eventos

#### Para crear un nuevo evento tienes las siguientes opciones para asignar:

* (<small>*</small>) - Nombre.
* (<small>*</small>) - Función a ejecutar cuando se invoque el evento.

#### Hay dos formas de configurar estos valores:

* Desde el constructor con un objeto de configuraciones
* Con encadenamiento de métodos

##### Recuerda que para crear un evento, previamente debes crear una carpeta contenedora de estos y configurarla en el cliente.

### 🌟 Ejemplos

> #### Ruta de ejemplo: /mi-bot/eventos/mi_evento.js
> ##### Puedes usar extensión .ts y .js

#### En caso de utilizar ESM puedes usar `export default`

```js
import { Event } = from 'discord-kenway-framework';
export default new Event()...
```

#### En caso de cjs usas `module.exports`

```js
const { Command } = require('discord-kenway-framework');
module.exports = new Event()...
```

#### Evento 'messageCreate'

```js
import { Event, Events } from 'discord-kenway-framework';

// Con objeto de configuraciones
export default new Event({
    name: Events.MessageCreate,
    execute: async (client, message) => {
        if (message.author.bot) return;
        if (message.content.includes('!hola')) message.channel.send({
            content: 'Hola!'
        });
    }
})

// Encadenando métodos
export default new Event()
    .setName(Events.MessageCreate)
    .setExecute((client, message) => {
        if (message.author.bot) return;
        if (message.content.includes('!hola')) message.channel.send({
            content: 'Hola!'
        });
    });
```

#### 🔸 Notas

* ##### Puedes utilizar un string en vez de un enum. ejemplo: `messageCreate`
* ##### Cada evento en su primer argumento es el cliente discord, luego, los argumentos originales del evento
<small>Ejemplo con evento `messageUpdate`</small>
 `(client, oldMessage, newMessage) => ...`

## 📁 Estructura de carpetas para eventos y comandos 

Se ha diseñado una estructura de carpetas jerárquica para facilitar la organización y escalabilidad del código en los comandos y eventos. Esta estructura en forma de árbol te ayudará a mantener tu proyecto ordenado y permitirá un desarrollo más eficiente a medida que agregas nuevas funcionalidades.

### Organización de Comandos

Si estableces tu ruta de comandos, por ejemplo, `commands` destinada a almacenar todos los archivos relacionados con los comandos. Dentro de esta carpeta, puedes crear subcarpetas adicionales para organizar tus comandos de acuerdo con su funcionalidad o categoría específica. Por ejemplo, puedes tener una subcarpeta llamada `admin` para los comandos de administración, otra llamada `utilidades` para los comandos de utilidad, y así sucesivamente.

### Organización de Eventos

Del mismo modo, si estableciste una carpeta para tus eventos, llamada por ejemplo `events` para almacenar todos los archivos relacionados con los eventos. Al igual que en la carpeta `commands` , puedes crear subcarpetas dentro de `events` para clasificar los eventos según su tipo o categoría. Por ejemplo, puedes tener una subcarpeta llamada `informacion` para los eventos relacionados con informaciones del bot, otra `channels` para los eventos relacionados con canales, y así sucesivamente.

Esta estructura de carpetas jerárquica proporciona una manera eficiente de gestionar tus clases eventos y comandos. Te permitirá localizar fácilmente los archivos relevantes y mantener un código limpio y organizado a medida que tu proyecto crece.


### Ignorar archivos

Si quieres tener una estructura más compleja, puedes usar el sistema de ignorar archivos dentro las rutas asignadas previamente en la creación del cliente. Para esto, debes agregar `ignore` antes de la extensión de tu archivo, por ejemplo: `comando.ignore.ts` o `comando.ignore.js`. Recuerda que puedes utilizar archivos en formato `js` y `ts`.

Por ejemplo, si tienes un módulo de comandos relacionado con usuarios, puedes organizar tu estructura de la siguiente manera:

```
├── comandos
│   ├── usuario
│   │   ├── perfil.js
│   │   ├── perfil.ignore.js
│   │   ├── estadisticas.js
│   │   ├── estadisticas.ignore.js
```

En este ejemplo, la carpeta `usuario` contiene diferentes archivos de comandos relacionados con usuarios. Los archivos `perfil.js` y `estadisticas.js` son los comandos principales para mostrar el perfil de un usuario y las estadísticas respectivamente. Los archivos `perfil.ignore.js` y `estadisticas.ignore.js` son archivos de ayuda que proporcionan funciones o lógica adicional para el manejo de perfiles y estadísticas, pero no se cargan como comandos independientes, pues son ignorados.

Esta estructura modular te permite separar la funcionalidad principal de un comando de los archivos de ayuda asociados a dicho comando, manteniendo tu código organizado y modularizado.

Recuerda que los archivos con la extensión `.ignore.(js|ts)` no se cargarán automáticamente como comandos, pero aún estarán disponibles para su uso dentro del comando principal correspondiente o pueden ser importados desde otros sitios de tu proyecto sin ningún inconveniente.

#### Ejemplo de una estructura de archivos completa:

```
├── comandos
│   ├── admin
│   │   ├── ban.js
│   │   ├── alert.ignore.js
│   │   └── kick.js
│   └── entretenimiento
│       ├── meme.js
│       └── musica.js
└── eventos
    ├── actualizaciones
    │   ├── messageUpdate.js
    │   ├── guildUpdate.ignore.js
    │   └── channelUpdate.js
    └── bot-info
        ├── error.js
        └── shardError.js
```

## 🛠️ Desarrollo

El framework se encuentra actualmente en desarrollo y es de código abierto. ¡Nos encanta la colaboración de la comunidad! Si deseas contribuir, puedes hacerlo de las siguientes maneras:

#### Contribuciones

* Si encuentras un error o tienes una sugerencia, por favor, abre un [issue](https://github.com/AndyRuix1/discord-kenway-framework/issues).
* Si quieres realizar mejoras o cambios en el código, eres bienvenido/a a hacer un [fork](https://github.com/AndyRuix1/discord-kenway-framework/fork) del repositorio, hacer tus modificaciones y enviar un [pull request](https://github.com/AndyRuix1/discord-kenway-framework/pulls).

#### Desarrolladores

* [Andy Kenway](https://discordapp.com/users/340757879915151361)

<hr/>

###### <span style="text-align:center !important; ">Basado en DiscordJS</span>.
<div style="width:100%; ">
<img width="100%" style="margin-left:auto; margin-right:auto; " 
src="https://media.giphy.com/media/caD7wkiDRP307AY9Bb/giphy.gif"/>
</div>
