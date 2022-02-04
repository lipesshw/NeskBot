const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "addrelacionada", //the command name for the Slash Command
	description: "Adicione uma música semelhante/relacionada à música atual!", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL
	run: async (client, interaction) => {
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
			} = interaction;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return interaction.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setDescription(`⛔ | Por favor entre em algum canal de voz primeiro.`)
				],
				ephemeral: true
			})
			if (channel.userLimit != 0 && channel.full)
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`⛔ | Seu canal de voz está cheio, não consigo participar!`)
					],
					ephemeral: true
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setDescription(`⛔ | Já estou conectado em outro lugar.`)
					],
					ephemeral: true
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setDescription(`⛔ | Não estou tocando nada no momento.`)
					],
					ephemeral: true
				})
				//update it without a response!
				await interaction.reply({
          embeds: [
            new MessageEmbed().setColor(ee.color).setDescription(`🔍 | Pesquisando músicas relacionadas à:  **${newQueue.songs[0].name}**`)
          ],
					ephemeral: true
				});
				await newQueue.addRelatedSong();
				await interaction.reply({
          	embeds: [
						new MessageEmbed().setColor(ee.color).setDescription(`🎶 | Adicionado: **${newQueue.songs[newQueue.songs.length - 1].name}**`)
					],
					ephemeral: true
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `⛔ | Ocorreu algum erro, reporte isso no meu servidor de suporte com uma print do erro.`,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],
					ephemeral: true
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
