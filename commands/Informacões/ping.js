const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "ping", //the command name for the Slash Command

  category: "Informacões",
  usage: "ping",
  aliases: ["latencia"],

  description: "Fornece informações sobre o quão rápido o bot é", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]

  run: async (client, message, args) => {
    try {
      const {
        member,
        guildId,
        guild
      } = message;
      const {
        channel
      } = member.voice;
      await message.reply({
          embeds: [
          new MessageEmbed().setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setDescription(`<:ping:938872236553695262> | Ping: \`${Math.floor((Date.now() - message.createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\`\n\n<:ping:938872236553695262> | Ping da API: \`${Math.floor(client.ws.ping)} ms\``)
        ]
        })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
