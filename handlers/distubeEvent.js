const PlayerMap = new Map()
const Discord = require(`discord.js`);
const {
    KSoftClient
} = require('@ksoft/api');
const config = require(`../botconfig/config.json`);
const ksoft = new KSoftClient(config.ksoftapi);
const ee = require(`../botconfig/embed.json`);
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed
} = require(`discord.js`);
const { 
  lyricsEmbed, check_if_dj
} = require("./functions");
let songEditInterval = null;
module.exports = (client) => {
  try {
    client.distube
      .on(`playSong`, async (queue, track) => {
        try {
          client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        } catch (error) {
          console.log(error)
        }
        try {
          var newQueue = client.distube.getQueue(queue.id)
          var newTrack = track;
          var data = receiveQueueData(newQueue, newTrack)
          //Send message with buttons
          let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
            PlayerMap.set(`currentmsg`, msg.id);
            return msg;
          })
          //create a collector for the thinggy
          var collector = currentSongPlayMsg.createMessageComponentCollector({
            filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
            time: track.duration > 0 ? track.duration * 1000 : 600000
          }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          let lastEdited = false;

          /**
           * @INFORMATION - EDIT THE SONG MESSAGE EVERY 10 SECONDS!
           */
          try{clearInterval(songEditInterval)}catch(e){}
          songEditInterval = setInterval(async () => {
            if (!lastEdited) {
              try{
                var newQueue = client.distube.getQueue(queue.id)
                var newTrack = newQueue.songs[0];
                var data = receiveQueueData(newQueue, newTrack)
                await currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }catch (e){
                clearInterval(songEditInterval)
              }
            }
          }, 10000)

          collector.on('collect', async i => {
            if(i.customId != `10` && check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])) {
              return i.reply({embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
							  .setTitle(`⛔ | Você não é um DJ e nem o solicitante de música!`)
                .setDescription(`**Cargos de DJ:**\n${check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])}`)
              ],
              ephemeral: true});
            }
            lastEdited = true;
            setTimeout(() => {
              lastEdited = false
            }, 7000)
            //skip
            if (i.customId == `1`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //get the player instance
              const queue = client.distube.getQueue(i.guild.id);
              //if no player available return aka not playing anything
              if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                return i.reply({
                  content: `⛔ | Não estou tocando nada no momento.`,
                  ephemeral: true
                })
              }
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              //if ther is nothing more to skip then stop music and leave the Channel
              if (newQueue.songs.length == 0) {
                //if its on autoplay mode, then do autoplay before leaving...
                  i.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setDescription(`⏹ | Como a música foi parada eu tive que sair do canal :(.`)]
                  })
                  clearInterval(songEditInterval);
                  //edit the current song message
                  await client.distube.stop(i.guild.id)
                return
              }
              //skip the track
              await client.distube.skip(i.guild.id)
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏭ | Música pulada com sucesso!`)]
              })
            }
            //stop
            if (i.customId == `2`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
                //stop the track
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setDescription(`⏹ | Como a música foi parada eu tive que sair do canal.`)
                    ]
                })
                clearInterval(songEditInterval);
                //edit the current song message
                await client.distube.stop(i.guild.id)
            }
            //pause/resume
            if (i.customId == `3`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              if (newQueue.playing) {
                await client.distube.pause(i.guild.id);
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setDescription(`⏸ | Música pausada.`)]
                })
              } else {
                //pause the player
                await client.distube.resume(i.guild.id);
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setDescription(`▶️ | Música resumida.`)]
                })
              }
            }
            //autoplay
            if (i.customId == `4`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              //pause the player
              await newQueue.toggleAutoplay()
              if (newQueue.autoplay) {
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              } else {
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setDescription(`${newQueue.autoplay ? `<:correto:938637347048796190> | Reprodução automática ativada.`: `<:errado:938638337072300103> | Reprodução automática desativada.`}`)]
                })
            }
            //Shuffle
            if(i.customId == `5`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              //pause the player
              await newQueue.shuffle()
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setDescription(`<:correto:938637347048796190> | ${newQueue.songs.length} músicas embaralhadas!`)]
              })
            }
            //Songloop
            if(i.customId == `6`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content:  `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 1){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(1)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setDescription(`${newQueue.repeatMode == 1 ? `<:correto:938637347048796190> | Loop de música ativado`: `<:errado:938638337072300103> | Loop de fila desabilitado`}`)]
              })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Queueloop
            if(i.customId == `7`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro.`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `⛔ | Por favor entre em algum canal de voz primeiro! <#${channel.id}>`,
                  ephemeral: true
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 2){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(2)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setDescription(`${newQueue.repeatMode == 2 ? `<:correto:938637347048796190> | Loop de fila ativado`: `<:errado:938638337072300103> | Loop de fila desabilitado`}`)]
                })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Forward
            if(i.customId == `8`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              let seektime = newQueue.currentTime + 10;
              if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏩ **Forwarded the song for \`10 Seconds\`!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Rewind
            if(i.customId == `9`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              let seektime = newQueue.currentTime - 10;
              if (seektime < 0) seektime = 0;
              if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏪ **Rewinded the song for \`10 Seconds\`!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Lyrics
            if(i.customId == `10`){let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
                return i.reply({
                  content: `${client.allEmojis.x} **Lyrics are disabled!**\n> *Due to legal Reasons, Lyrics are disabled and won't work for an unknown amount of time!* :cry:`,
                  ephemeral: true
                });
              let embeds = [];
              await ksoft.lyrics.get(newQueue.songs[0].name).then(
                async track => {
                    if (!track.lyrics) return i.reply({content: `${client.allEmojis.x} **No Lyrics Found!** :cry:`, ephemeral: true});
                    lyrics = track.lyrics;
                embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
              }).catch(e=>{
                console.log(e)
                return i.reply({content: `${client.allEmojis.x} **No Lyrics Found!** :cry:\n${String(e).substr(0, 1800)}`, ephemeral: true});
              })
              i.reply({
                embeds: embeds, ephemeral: true
              })
            }
          });
        } catch (error) {
          console.error(error)
        }
      })
      .on(`addSong`, (queue, song) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter("💯 " + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`<a:musicq:938562102082277477> | Música adicionada na fila!`)
          .setDescription(`Música: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
          .addField(`Tempo estimado:`, `\`${queue.songs.length - 1} música${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`Duração da fila:`, `\`${queue.formattedDuration}\``)
        ]
      }))
      .on(`addList`, (queue, playlist) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
          .setFooter("💯" + playlist.user.tag, playlist.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`<a:musicq:938562102082277477> | Playlist adicionada na fila!`)
          .setDescription(`Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} música${playlist.songs.length > 0 ? "s" : ""}\``)
          .addField(`Tempo estimadao:`, `\`${queue.songs.length - - playlist.songs.length} música${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`Duração da fila:`, `\`${queue.formattedDuration}\``)
        ]
      }))
      // DisTubeOptions.searchSongs = true
      .on(`searchResult`, (message, result) => {
        let i = 0
        message.channel.send(`Escolha uma opção abaixo \n${result.map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join(`\n`)}\n Digite qualquer outra coisa ou espere 60 segundos para cancelar.`)
      })
      // DisTubeOptions.searchSongs = true
      .on(`searchCancel`, message => message.channel.send(`Pesquisa cancelada.`).catch((e)=>console.log(e)))
      .on(`error`, (channel, e) => {
        channel.send(`An error encountered: ${e}`).catch((e)=>console.log(e))
        console.error(e)
      })
      .on(`empty`, channel => channel.send(`<:picapau:938641765219565568> | Não há mais músicas restantes, tive que sair do canal :(.`).catch((e)=>console.log(e)))
      .on(`searchNoResult`, message => message.channel.send(`Nenhum resultado encontrado!`).catch((e)=>console.log(e)))
      .on(`finishSong`, (queue, song) => {
        var embed = new MessageEmbed().setColor(ee.color)
        .setAuthor(`${song.name}`, "🔇", song.url)
        .setDescription(`<:correto:938637347048796190> | Música finalizada!`)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`);
        queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
          currentSongPlayMsg.edit({embeds: [embed], components: []}).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      })
      .on(`finish`, queue => {
        queue.textChannel.send({
          embeds: [
            new MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
            .setDescription("<:picapau:938641765219565568> | Não há mais músicas restantes, tive que sair do canal :(.")
            .setTimestamp()
          ]
        })
      })
      .on(`initQueue`, queue => {
        try {
          client.settings.ensure(queue.id, {
            defaultvolume: 50,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`]
          })
          let data = client.settings.get(queue.id)
          queue.autoplay = Boolean(data.defaultautoplay);
          queue.volume = Number(data.defaultvolume);
          queue.setFilter(data.defaultfilters);
        } catch (error) {
          console.error(error)
        }
      });
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }

  function receiveQueueData(newQueue, newTrack) {
    var djs = client.settings.get(newQueue.id, `djroles`);
    if(!djs || !Array.isArray(djs)) djs = [];
    else djs = djs.map(r => `<@&${r}>`);
    if(djs.length == 0 ) djs = "`not setup`";
    else djs.slice(0, 15).join(", ");
    if(!newTrack) return new MessageEmbed().setColor(ee.wrongcolor).setTitle("NO SONG FOUND?!?!")
    var embed = new MessageEmbed().setColor(ee.color)
      .setDescription(`Veja a fila no website clicando [aqui](${require("../dashboard/settings.json").website.domain}/queue/${newQueue.id}).`)
      .addField(`Solicitado por:`, `${newTrack.user}`, true)
      .addField(`Duração:`, `\`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
      .addField(`Fila de músicas:`, `\`${newQueue.songs.length} música(s)\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`Volume:`, `\`${newQueue.volume} %\``, true)
      .addField(`Loop:`, `${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `<:correto:938637347048796190>\` Fila\`` : `<:correto:938637347048796190> \`Música\`` : `<:errado:938638337072300103>`}`, true)
      .addField(`R. Automática:`, `${newQueue.autoplay ? `<:correto:938637347048796190>` : `<:errado:938638337072300103>`}`, true)
      .addField(`Baixar música:`, `[\`Clique aqui\`](${newTrack.streamURL})`, true)
      .setTitle(`<:musica2:938638011162296390> ${newTrack.name}`)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`);
    let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Pular`)
    let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`🏠`).setLabel(`Parar`)
    let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Pausar`)
    let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('🔁').setLabel(`Reprodução automática`)
    let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Embaralhar fila`)
    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
    }
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
    let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Música`)
    let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Fila`)
    if (newQueue.repeatMode === 0) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 1) {
      songloop = songloop.setStyle('SECONDARY')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 2) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SECONDARY')
    }
    const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
    const row2 = new MessageActionRow().addComponents([songloop, queueloop]);
    return {
      embeds: [embed],
      components: [row, row2]
    };
  }
};
/**
 * 
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
