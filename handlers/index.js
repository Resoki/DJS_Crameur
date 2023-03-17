const fs = require("fs");
const chalk = require("chalk");
const global = require('../config')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(process.env.DJS_TOKEN || global.token);

/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log(chalk.bgBlueBright.black(` ✔️ => Event ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => Event ${file} missing a help.name or help.name is not in string `));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load Prefix Commands
 */
const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalk.bgBlueBright.black(` ✔️ => Prefix Command ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => Prefix Command ${file} missing a help.name or help.name is not in string `));
                continue;
            }
            
            if (command.aliases && Array.isArray(command))
            command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
}

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../slashCommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                console.log(chalk.bgBlueBright.black(` ✔️ => SlashCommand ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => SlashCommand ${file} missing a help.name or help.name is not in string `));
                continue;
            }
        }
    }

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
    
            await rest.put(
                Routes.applicationGuildCommands(global.botClientID, global.guildID),
                { body: client.slash },
            );
    
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(`erreur lors du load des commandes: ${error}`);
        }
    })();

}

//INITIALISE DATABASE
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b305c4bf57d5eb',
    password: '966c0324',
    database: 'heroku_2f251a5b0a27e4e'
});

const connectDb = async function () {
    await db.connect((err)=> {
        if(err) console.log('err',err);
        if(!err) {
             console.log(`Connecté à la base de données: ${db.config.database} !\nHost: ${db.config.host}`);
        }
    })
}

module.exports = {
    loadEvents,
    loadCommands,
    loadSlashCommands,
    connectDb,
    db
}
