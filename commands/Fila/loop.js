const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "loop", //the command name for the Slash Command

	category: "Fila",
	aliases: ["repeat"],
	usage: "loop <song/queue/off>",

	description: "Habilite/desabilite o loop de música/fila.", //the command description for Slash Command Overview
	cooldown: 5,
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
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`⛔ | Por favor entre em algum canal de voz primeiro.`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setDescription(`⛔ | Não estou tocando nada no momento.`)
					],

				})
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`⛔ | Você não é um DJ e nem o solicitante de música!`)
							.setDescription(`**Cargos de DJ:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}
				if (!args[0]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setDescription(`<:errado:938638337072300103> | Por favor, adicione um método.\n\n**Use:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
						],
					});
				}
				let loop = String(args[0])
				if (!["off", "song", "queue"].includes(loop.toLowerCase())) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setDescription(`<:errado:938638337072300103> | Por favor, adicione um método válido.\n\n**Use:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
						],
					});
				}
				if (loop.toLowerCase() == "off") loop = 0;
				else if (loop.toLowerCase() == "song") loop = 1;
				else if (loop.toLowerCase() == "queue") loop = 2;
				await newQueue.setRepeatMode(loop);
				if (newQueue.repeatMode == 0) {
					message.reply({
						embeds: [new MessageEmbed()
						  .setColor(ee.color)
						  .setTimestamp()
						  .setTitle(`<:correto:938637347048796190> | \`${member.user.tag}\` desabilitou o loop!`)]
					})
				} else if (newQueue.repeatMode == 1) {
					message.reply({
						embeds: [new MessageEmbed()
						  .setColor(ee.color)
						  .setTimestamp()
						  .setTitle(`🔁 | \`${member.user.tag}\` habilitou o loop de música.`)]
						})
				} else {
					message.reply({
						embeds: [new MessageEmbed()
						  .setColor(ee.color)
						  .setTimestamp()
						  .setTitle(`🔁 | \`${member.user.tag}\` habilitou o loop de fila.`)]
						})
				}
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
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
