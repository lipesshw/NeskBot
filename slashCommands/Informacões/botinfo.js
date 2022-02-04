const {
    MessageEmbed
} = require("discord.js");
const Discord = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
let cpuStat = require("cpu-stat");
let os = require("os");
module.exports = {

    name: "botinfo", //the command name for execution & for helpcmd [OPTIONAL]
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Mostra as informações do bot.", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, interaction) => {
        try {

            cpuStat.usagePercent(function (e, percent, seconds) {
                try {
                    if (e) return console.log(String(e.stack).red);

                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;

                    const botinfo = new MessageEmbed()
                        .setDescription(`🛠️ Olá sou o Nesk, sou um Bot simples de música! Caso queria saber mais dos meus comandos, basta digitar **-help** para mais informações.\n`)
                        .setColor("#4593ff")
                        .addField(`💿 Status do NeskMusic: `, `Uso de mémoria: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\`   \nUptime: ${duration(client.uptime).map(i=>`\`${i}\``).join(", ")}\nUso de CPU:\`${percent.toFixed(2)}%\` \nLatência da API: \`${client.ws.ping}ms\`  `, true)
                        .addField(`Criador:`, `:flag_br: <@918291110143614976>`, true)
                        .addField("📁 Informações", `Usúarios totais:\` ${client.users.cache.size} Usuários\`\nServidores totais: \`${client.guilds.cache.size} servidores.\``)
                        .addField("🔊 Estou conectado em:", `\`${connectedchannelsamount} canais atualmente\``, true)
                        .addField("👾 Discord.js", `\`v13.6.0\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .setFooter("NeskMusic - Um bot de música super legal e com alta qualidade para o seu servidor!", "https://cdn.discordapp.com/attachments/926313247148245045/934655528733405184/My_project_1.png?size=512");
                    interaction.reply({
                        embeds: [botinfo]
                    });

                } catch (e) {
                    console.log(e)
                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
                    const botinfo = new MessageEmbed()
                        .setDescription(`🛠️ Olá sou o Nesk, sou um Bot simples de música! Caso queria saber mais dos meus comandos, basta digitar **-help** para mais informações.\n`)
                        .setColor("#4593ff")
                        .addField(`💿 Status do NeskMusic: `, `Uso de mémoria: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\`   \nUptime: ${duration(client.uptime).map(i=>`\`${i}\``).join(", ")}\nUso de CPU:\`${percent.toFixed(2)}%\` \nLatência da API: \`${client.ws.ping}ms\`  `, true)
                        .addField(`Criador:`, `:flag_br: <@918291110143614976>`, true)
                        .addField("📁 Informações", `Usúarios totais:\` ${client.users.cache.size} Usuários\`\nServidores totais: \`${client.guilds.cache.size} servidores.\``)
                        .addField("🔊 Estou conectado em:", `\`${connectedchannelsamount} canais atualmente\``, true)
                        .addField("👾 Discord.js", `\`v13.6.0\``, true)
                        .addField("🤖 Node", `\`${process.version}\``, true)
                        .setFooter("NeskMusic - Um bot de música super legal e com alta qualidade para o seu servidor!", "https://cdn.discordapp.com/attachments/926313247148245045/934655528733405184/My_project_1.png?size=512");
                        interaction.reply({
                        embeds: [botinfo]
                    });
                }
            })

            function duration(duration, useMilli = false) {
                let remain = duration;
                let days = Math.floor(remain / (1000 * 60 * 60 * 24));
                remain = remain % (1000 * 60 * 60 * 24);
                let hours = Math.floor(remain / (1000 * 60 * 60));
                remain = remain % (1000 * 60 * 60);
                let minutes = Math.floor(remain / (1000 * 60));
                remain = remain % (1000 * 60);
                let seconds = Math.floor(remain / (1000));
                remain = remain % (1000);
                let milliseconds = remain;
                let time = {
                    days,
                    hours,
                    minutes,
                    seconds,
                    milliseconds
                };
                let parts = []
                if (time.days) {
                    let ret = time.days + ' Dia'
                    if (time.days !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.hours) {
                    let ret = time.hours + ' Hr'
                    if (time.hours !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.minutes) {
                    let ret = time.minutes + ' Min'
                    if (time.minutes !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)

                }
                if (time.seconds) {
                    let ret = time.seconds + ' Seg'
                    if (time.seconds !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (useMilli && time.milliseconds) {
                    let ret = time.milliseconds + ' ms'
                    parts.push(ret)
                }
                if (parts.length === 0) {
                    return ['instantly']
                } else {
                    return parts
                }
            }
            return;
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */