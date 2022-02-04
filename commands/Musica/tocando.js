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
	name: "tocando", //the command name for the Slash Command
	category: "Musica",
	usage: "tocando",
	aliases: ["tocandoagora"],
	description: "Faça o bot te enviar os dados da música que está tocando atualmente no seu privado.", //the command description for Slash Command Overview
	cooldown: 10,
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
				let newTrack = newQueue.songs[0];
				member.send({
					content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
					embeds: [
						new MessageEmbed().setColor(ee.color)
            .setDescription(`Veja a fila no website clicando [aqui](https://web.neskapp.live/queue/${newQueue.id}).`)
            .addField(`Solicitado por:`, `${newTrack.user}`, true)
            .addField(`Duração:`, `\`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
            .addField(`Fila de músicas:`, `\`${newQueue.songs.length} musica(s)\`\n\`${newQueue.formattedDuration}\``, true)
            .addField(`Volume:`, `\`${newQueue.volume} %\``, true)
            .addField(`Loop:`, `${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `<:correto:938637347048796190>\` Fila\`` : `<:correto:938637347048796190> \`Música\`` : `<:errado:938638337072300103>`}`, true)
            .addField(`R. Automática:`, `${newQueue.autoplay ? `<:correto:938637347048796190>` : `<:errado:938638337072300103>`}`, true)
            .addField(`Baixar música:`, `[\`Clique aqui\`](${newTrack.streamURL})`, true)
            .setTitle(`<:musica2:938638011162296390> ${newTrack.name}`)
            .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
						.setFooter(`Tocando em: ${guild.name}`, guild.iconURL({
							dynamic: true
						})).setTimestamp()
					]
				}).then(() => {
					message.reply({
            embeds: [
						new MessageEmbed().setColor(ee.color).setDescription(`<:correto:938637347048796190> | Informações desta música enviada! Confira suas mensagens privadas!`)
            ]
            })
				}).catch(() => {
					message.reply({
            embeds: [
						new MessageEmbed().setColor(ee.color).setDescription(`<:errado:938638337072300103> | Não consegui enviar as informações da música atual, por favor, ative suas mensagens privadas!`)
            ]
					})
				})
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
