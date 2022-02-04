const fs = require("fs");
const allevents = [];
module.exports = async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log("\n")
        } catch {
            /* */ }
        let amount = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                    amount++;
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await ["client", "guild"].forEach(e => load_dir(e));
        console.log(`${amount} Eventos carregados`.brightGreen);
        try {
            const stringlength2 = 69;
            console.log("\nConectando com a api do discord/bot..")
        } catch {
            /* */ }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */