const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Informacões",
  usage: "help <nome do comando>",
  aliases: ["h", "ajuda"],

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Veja as informações de todos os comandos ou de algum específico.", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      let prefix = client.settings.get(message.guild.id, "prefix")
      if (args[0] && args[0].length > 0) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          return message.reply({
            embeds: [embed.setColor(ee.wrongcolor).setDescription(`Nenhuma informação encontrada para: **${args.toLowerCase()}**`)]
          });
        }
        if (cmd.name) embed.setDescription(`Informações detalhados do comando:\`${cmd.name}\``);
        if (cmd.name) embed.addField("Nome do comando", `\`${cmd.name}\``);
        if (cmd.description) embed.addField("Descrição", `\`${cmd.description}\``);
        if (cmd.aliases) embed.addField("Modos", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        if (cmd.cooldown) embed.addField("Cooldown", `\`${cmd.cooldown} Segundos\``);
        else embed.addField("Cooldown", `\`${settings.default_cooldown_in_sec} Segundo\``);
        if (cmd.usage) {
          embed.addField("Use", `\`${prefix}${cmd.usage}\``);
        }
        return message.reply({
          embeds: [embed.setColor(ee.color)]
        });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(ee.footericon)
          .setTitle("Menu de ajuda | NeskMusic")
          .setDescription(`Você gosta das minhas funções? Clique [aqui](https://discord.com/oauth2/authorize?client_id=920706767200088074&scope=bot+identify+guilds+email&permissions=2080374975&response_type=code&redirect_uri=https://web.neskapp.live/callback) para me adicionar no seu servidor. \n\n> Confira o [**painel de controle**](${websiteSettings.website.domain}/dashboard/${message.guild.id}) e também a [**fila de músicas**](${websiteSettings.website.domain}/queue/${message.guild.id}).\n\n\nPara ver a lista de comandos basta acessar o seguinte link: ${websiteSettings.website.domain}/comandos`)
          .setFooter(`Para ver a descrição e ás informações de um comando, digite: ${prefix}help [comando]`, ee.footericon);
        message.reply({
          embeds: [embed]
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} Um erro foi encontrado, reporte isso no meu servidor de suporte.`)
        ]
      });
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
