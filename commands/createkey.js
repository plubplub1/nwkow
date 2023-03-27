const Discord = require('discord.js');
module.exports = {
    name: "createkey",
    description: "สร้าง key",
    options: [
        {
            name: "amount",
            description: "ใส่จำนวนที่ต้องการสร้าง",
            required: true,
            min_value : 1,
            max_value : 10,
            type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var optionskey = interaction.options.getNumber("amount")
        if (!interaction.member.roles.cache.some(role => role.id === AdminRole)) {
            interaction.reply("permission?", { ephemeral: true })
        } else {
            if (optionskey) {
                if (optionskey <= 10) {
                    let fuckoff = []
                    for (var i = 0; i < optionskey; i++) {
                        fuckoff.push(`${makeid(12)}`)
                    }
                    let fuck = ""
                    fuckoff.forEach(ab => {
                        fuck = fuck + ab.toString() + "\n"
                        con.query(`INSERT INTO whitelist (userkey,discord_id,hwid,ip,Blacklisted,Reason) VALUES ('${ab}','Unknown','Unknown','Unknown','False','Unknown')`, function(err, results, fields) {
                            
                        })
                    })

                    const Embed = new Discord.MessageEmbed()
                    .setColor('#d50707')
                    .setAuthor({ name: NameHub, iconURL: client.user.displayAvatarURL() })
                    .addField('**Hu Tao Whitelist Manager**', "```yaml\n"+fuck+"```", true)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setFooter({text:'Hu Tao Cute', iconURL:client.user.displayAvatarURL()})
                    .setTimestamp()
                    
                    interaction.reply({embeds : [Embed], ephemeral: true })

                } else {
                    interaction.reply("max create is 10keys", { ephemeral: true })
                }
            } else {
                interaction.reply("insert amount of keys", { ephemeral: true })
            }
        }
    }
}