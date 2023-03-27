const { Client, Intents, Collection, MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const colors = require("colors");
const mysql = require("mysql");

const AdminRole = config.Bot.AdminRole;
const ResetHwid = config.Bot.ResetHwid;
const NameHub = config.Bot.NameHub;
const CooldownTime = new Set();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

// const LogExecute = client.user.cache.find(channel => channel.id === ExecuteId);
// const LogCrack = client.user.cache.find(channel => channel.id === CrackId);

function log(text, color) {
    let d = new Date(),
        h = d.getHours(),
        m = d.getMinutes(),
        ap = "AM"
    if (h > 12) { h -= 12; ap = "PM" }
    if (m < 10) { m = "0" + m }
    time = h + ":" + m + " " + ap

    if (typeof(color) == "undefined") { console.log(colors.grey(time) + " : " + text) }
    if (typeof(color) != "undefined") { console.log(colors.grey(time) + " : " + colors[color](text)) }
}
function handleConnection() {
    con = mysql.createConnection(config.sql);

    con.connect(function(err) {
        if (err) {
            log("[ERROR] An error has occurred while connection: " + err, "red");
            log("[INFO] Attempting to establish connection with SQL database.", "yellow");
            setTimeout(handleConnection, 2000);
        } else {
            log("[SUCCESS] SQL database connection established successfully.", "blue");
        }
    });

    con.on("error", function(err) {
        console.log("Error: " + err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleConnection();
        } else {
            throw err;
        }
    });
}

con = mysql.createConnection(config.sql);

con.connect(function(err) {
    if (err) {
        log("[ERROR] An error has occurred while connection: " + err, "red");
        log("[INFO] Attempting to establish connection with SQL database.", "yellow");
        setTimeout(handleConnection, 2000);
    } else {
        log("[SUCCESS] SQL database connection established successfully.", "blue");
    }
});

con.on("error", function(err) {
    console.log("Error: " + err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        handleConnection();
    } else {
        throw err;
    }
});

function fetch_hwid(gethan) {
    const allowedHeaders = ["syn-fingerprint","exploit-guid","krnl-hwid","ElectronID","Flux-Fingerprint","requester"]

    let exploit
    for (const header of allowedHeaders) {
        if (gethan.headers[header]) {
            exploit = gethan.headers[header]
        }
    }
    if (!exploit) {
        return null
    } else {
        if (exploit == "Client") {
            let forwarded = gethan.headers['x-forwarded-for']
            let ip = forwarded ? forwarded.split(/, /)[0] : gethan.connection.remoteAddress;
            ip2 = ip.split(":")[3] 
            if (!ip2) {
                ip2 = ip.split(":")[2] 
            }
            if (ip2 == "1") {
                ip2 = "127.0.0.1"
            }
            return ip2
        } else {
            return exploit
        }
    }
}

function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function reverseString(str){
    let revstr = "";
    for(let i = str.length-1; i>=0; i--){
        revstr = revstr+ str[i];
    }
    return revstr;
}

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

function parseCommand() {
    let commands = []
    for (let obj of client.commands) {
        commands.push(obj[1])
    }
    return commands
}

client.on('ready', () => {
    console.log('[BOT]: ' + client.user.username, 'Is Online!');
    client.user.setUsername("Mob");
    client.guilds.cache.forEach(async guild => {
        await guild.commands.set(parseCommand())
    })
})

client.on("guildCreate", async guild => {
    await guild.commands.set(parseCommand())
})

client.on("guildDelete", async guild => {
    await guild.commands.delete();
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (!client.commands.has(interaction.commandName)) return;
        try {
            await client.commands.get(interaction.commandName).execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});


client.login(config.Bot.Token)