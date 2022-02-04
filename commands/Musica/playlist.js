const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "playlist", //the command name for the Slash Command

	category: "Musica",
	aliases: ["mixtape"],
	usage: "mix <1-15>",

	description: "Toca uma playlist padrão do bot.", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]

	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setDescription(`⛔ | Por favor entre em algum canal de voz primeiro.`)
				],

			})
			if (channel.userLimit != 0 && channel.full)
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`⛔ | Seu canal de voz está cheio, não consigo participar!`)
					],
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`⛔ | Já estou conectado em outro lugar.`)
					],
				});
			}

			let link = "https://open.spotify.com/playlist/1xnuDGuvvLyNEO0mYohbCh?si=137f4cb26d04442b";
			if (args[0]) {
				//ncs | no copyrighted music
				if (args[0].toLowerCase().startsWith("1")) link = "https://open.spotify.com/track/69ebm9wovT0UJX3vBp571J?si=1b3a07bdf56c4996";
				//pop
				if (args[0].toLowerCase().startsWith("2")) link = "";
				//default
				if (args[0].toLowerCase().startsWith("3")) link = "";
				//remixes from Magic Release
				if (args[0].toLowerCase().startsWith("4")) link = ""
				//rock
				if (args[0].toLowerCase().startsWith("5")) link = "";
				//oldgaming
				if (args[0].toLowerCase().startsWith("6")) link = ""
				//gaming
				if (args[0].toLowerCase().startsWith("7")) link = "";
				//Charts
				if (args[0].toLowerCase().startsWith("8")) link = ""
				//Chill
				if (args[0].toLowerCase().startsWith("9")) link = "";
				//Jazz
				if (args[0].toLowerCase().startsWith("10")) link = "";
				//blues
				if (args[0].toLowerCase().startsWith("11")) link = "";
				//strange-fruits
				if (args[0].toLowerCase().startsWith("12")) link = "";
				//magic-release
				if (args[0].toLowerCase().startsWith("13")) link = ""
				//metal
				if (args[0].toLowerCase().startsWith("14")) link = "";
				//heavy metal
				if (args[0].toLowerCase().startsWith("15")) link = "";
			}
			let newMsg = await message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.color).setDescription(`<a:carregando:938563758874300466> | Carregando a  **'${args[0] ? args[0] : "Playlist 0"}'** do mix.`)
					],
			});
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				await client.distube.playVoiceChannel(channel, link, options)
				//Edit the reply
				newMsg.edit({
					embeds: [
					new MessageEmbed().setColor(ee.color).setDescription(`${queue?.songs?.length > 0 ? "👍 | Carregado!" : "<a:musicq:938562102082277477> | Tocando agora"}: à **'${args[0] ? args[0] : "Playlist 0"}'**`)
          ],
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `⛔ | Ocorreu algum erro, reporte isso no meu servidor de suporte com uma print do erro.`,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
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
