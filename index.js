const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        // Add other necessary intents here
    ]
});

const fs = require('fs');
const exec = require('child_process').exec;
const lineReader = require('line-reader');
const randomColor = require('randomcolor');
const readline = require('readline');
const dataFilePath = 'online.txt';
const configFilePath = 'conf.json';
const reset = '\x1b[0m';
const black = '\x1b[30m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const white = '\x1b[37m';
const bgBlack = '\x1b[40m';
const bgRed = '\x1b[41m';
const bgGreen = '\x1b[42m';
const bgYellow = '\x1b[43m';
const bgBlue = '\x1b[44m';
const bgMagenta = '\x1b[45m';
const bgCyan = '\x1b[46m';
const bgWhite = '\x1b[47m';

console.clear();
console.log("Bot By pixky");

const config = require("./conf.json");
const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';

    switch (platform) {
        case 'win32':
            cmd = `tasklist`;
            break;
        case 'darwin':
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux':
            cmd = `ps -A`;
            break;
        default:
            break;
    }

    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
};

client.on('ready', () => {
    console.log(`Bot is ready!`);
    console.log(`Bot Created by pixky`);
    console.log(`--------------[Bot Status]---------------`);
    console.log(`${bgGreen}${white} ONLINE!!${reset} `);
    console.log(`${green}-----------------------------------------`);

    setInterval(() => {
        updateActivityFromFile();
    }, 1000);
    //START EMBED MSG
    function updateActivityFromFile() {
        if (client.user) {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                client.user.setActivity(`With: ${data} Online Player`, { type: 'PLAYING' });
            });
        } else {
            console.error('Client is not ready yet. Waiting for the client to be ready...');
        }
    }

    const statusz = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor('StarTopia Private Server')
        .addFields('**Server Status:**', '**DOWN**')
        .addFields('Players Online:', 'Please wait.')
        .setTimestamp()
        .setFooter('Last Updated');

    client.channels.cache.get(config.channel).send(statusz).then((msg) => {
        setInterval(() => {
            var color = randomColor();
            isRunning(config.exegtps, (status) => {
                let uptimeData = '';
                if (status == true) {
                    if (!fs.existsSync(config.onlineplayer)) {
                        const statuszz = new Discord.MessageEmbed()
                            .setColor(color)
                            .setAuthor(msg.guild.name, msg.guild.iconURL())
                            .addFields('**Server Status:**', '**UP**')
                            .setTimestamp()
                            .setFooter('Last Updated');

                        msg.edit(statuszz);

                    } else {
                        uptimeData = fs.readFileSync('DATABASE\\uptime.txt', 'utf8');
                        lineReader.eachLine(config.onlineplayer, function (line) {
                            const statuszz = new Discord.MessageEmbed()
                                .setColor(color)
                                .setAuthor(msg.guild.name, msg.guild.iconURL())
                                .addFields('**Server Status:**', '**UP**')
                                .addFields('**Players Online:**', line)
                                .addFields('**Server UP Time:**', uptimeData)
                                .setTimestamp()
                                .setFooter('Last Updated');

                            msg.edit(statuszz);
                        });
                    }
                } else {
                    const statusz = new Discord.MessageEmbed()
                        .setColor(color)
                        .setAuthor(msg.guild.name, msg.guild.iconURL())
                        .addFields('**Server Status:**', '**DOWN**')
                        .addFields('**Players online:**', '0')
                        .addFields('Please Wait Until The Server Up. Thank You!')
                        .setTimestamp()
                        .setFooter('Last Updated');

                    msg.edit(statusz);
                }
            });
        }, 1000);
    });
});

//END EMBED MSG

//START AUTO BACKUP


client.login(config.token);
