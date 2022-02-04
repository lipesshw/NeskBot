const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "painel", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Informacões",
  usage: "painel",
  aliases: ["painel"],

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Link do painel de controle do bot.", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      message.reply({
        embeds: [
          new MessageEmbed()
          .setColor("#4593ff")
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`> Algumas destas páginas só podem ser acessadas pelo computador.\n\n**Site do Nesk:** ${websiteSettings.website.domain}/\n **Dashboard:** ${websiteSettings.website.domain}/dashboard\n **Filas dos Servidores::** ${websiteSettings.website.domain}/fila\n **Fila atual deste servidor** ${websiteSettings.website.domain}/queue/${message.guild.id}`)
        ]
      });
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
