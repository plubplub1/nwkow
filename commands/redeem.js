const Discord = require('discord.js');

module.exports = {
    name: "redeem",
    description: "redeem key",
    options: [
        {
            name: "key",
            description: "press your key",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var selectkey = interaction.options.getString("key")
        if (selectkey) {
            con.query(`SELECT discord_id , Blacklisted,Reason FROM whitelist WHERE discord_id = '${interaction.user.id}'`, function(err, results) {
                if (err) throw err;
                if (results.length > 0) { //results > 0 = wl
                    if (results[0].Blacklisted === "True") {
                        interaction.reply("you got blacklist", { ephemeral: true })
                    } else {
                        interaction.reply("you already have whitelist", { ephemeral: true })
                    }
                } else { 
                    con.query(`SELECT userkey , discord_id FROM whitelist WHERE userkey = ?`,[selectkey], function(err, res) {
                        if (res.length > 0) {
                            if (res[0].discord_id === "Unknown") {
                                con.query(`UPDATE whitelist SET discord_id = '${interaction.user.id}' WHERE userkey = ?`,[selectkey], function(err, res) {
                                    if (err) throw err;
                                    if (res.warningCount === 0) {
                                        const Embed = new Discord.MessageEmbed()
                                        .setColor('#33FC9E')
                                        .setTitle('Mob | Whitelist Manager')
                                        .setImage('https://i.pinimg.com/originals/e8/06/52/e80652af2c77e3a73858e16b2ffe5f9a.gif')
                                        .setFooter({text:'Mob', iconURL:client.user.displayAvatarURL()})
                                        .setTimestamp()
                                        
                                        interaction.reply({embeds : [Embed], ephemeral: true })

                                        const rolese = interaction.guild.roles.cache.find(role => role.id === '997764242272956426') // get role

                                        if (rolese) { interaction.member.roles.add(rolese) }
                                    }
                                })
                            } else {
                                interaction.reply("key already use", { ephemeral: true })
                            }
                        } else {
                            interaction.reply("wrong key", { ephemeral: true })
                        }
                    })
                }
            })
        } else {
            interaction.reply("please insert key", { ephemeral: true })
        }
    }
}