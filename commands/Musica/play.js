const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "play", //the command name for the Slash Command

	category: "Musica",
	aliases: ["p", "tocar"],
	usage: "play <nome da música ou link do youtube/spotify/soundcloud>",

	description: "Reproduza uma música/lista de reprodução em seu canal de voz", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//console.log(interaction, StringOption)

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
			if (!args[0]) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`**Use:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <nome da música ou link do youtube/spotify/soundcloud>\`\n\n**OBS:** Músicas muito explicitas não vão ser reproduzidas.`)
					],
				});
			}
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
			const Text = args.join(" ") //same as in StringChoices //RETURNS STRING 
			//update it without a response!
			let newmsg = await message.reply({
        embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`<:lupa:938601137223917629> | Pesquisando: \`${Text}\``)
        ],
			}).catch(e => {
				console.log(e)
			})
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				await client.distube.playVoiceChannel(channel, Text, options)
				//Edit the reply
				newmsg.edit({
        embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`${queue?.songs?.length > 0 ? "👍 | Adicionado!" : "<a:musicq:938562102082277477> | Tocando agora"}: \`${Text}\``)
        ],
				}).catch(e => {
					console.log(e)
				})
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
