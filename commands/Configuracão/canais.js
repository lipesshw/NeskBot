const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "canais", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Configuracão",
  aliases: ["canalcomandos"],
  usage: "canais <add ou remove> <#canal>",

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Gerencia os canais de comandos do bot.", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
      } = message;
      const {
        guild
      } = member;

      if (!args[0]) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`⛔ | Você precisa adicionar algum canal.\n\n**Use:** \`${client.settings.get(message.guild.id, "prefix")}canais <add ou remove> <#canal>\``)
          ],
        });
      }
      let add_remove = args[0].toLowerCase();
      if (!["add", "remove"].includes(add_remove)) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`⛔ | Você precisa adicionar algum canal.\n\n**Use:** \`${client.settings.get(message.guild.id, "prefix")}canais <add **ou** remove> <#canal>\``)
          ],
        });
      }
      let Channel = message.mentions.channels.first();
      if (!Channel) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`⛔ | Você precisa adicionar algum canal.\n\n**Use:** \`${client.settings.get(message.guild.id, "prefix")}canais <add **ou** remove> <#canal>\``)
          ],
        });
      }
      client.settings.ensure(guild.id, {
        botchannel: []
      });

      if (add_remove == "add") {
        if (client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`✅ | Este canal já está na lista de \`canais de comandos\`.`)
            ],
          })
        }
        client.settings.push(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`Não configurado`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`✅ | O canal \`${Channel.name}\` foi **adicionado** como um canal de comando!\n\nCanal de comando${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""} adicionados atualmente: \n>>> ${djs}\n\n**OBS:** a partir de agora o bot só responderá comandos nos canais acima.`)
          ],
        })
      } else {
        if (!client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setDescription(`⛔ | Este canal não está na lista de \`canais de comandos\`.`)
            ],
          })
        }
        client.settings.remove(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`Não configurado`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`✅ | O canal \`${Channel.name}\` foi **removido** dos canais de comandos!\n\nCanal de comando${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""} adicionados atualmente: \n>>> ${djs}\n\n**OBS:** a partir de agora o bot só responderá comandos nos canais acima.`)
          ],
        })
      }

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
