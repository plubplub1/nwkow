const Discord = require('discord.js');

module.exports = {
    name: "blacklist",
    description: "Blacklist User ที่เลือก",
    options: [
        {
            name: "user",
            description: "เลือก User ที่ต้องการ",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.USER
        },
        {
            name: "reason",
            description: "ใส่เหตุผลที่ทำผิด",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var optionsuser = interaction.options.getUser("user")
        var optionsReason = interaction.options.getString("reason")
        if (!interaction.member.roles.cache.some(role => role.id === AdminRole)) {
            interaction.reply("permission?", { ephemeral: true })
        } else {
            if (optionsuser.id) {
                if (optionsReason) {
                    con.query(`SELECT discord_id,Blacklisted FROM whitelist WHERE discord_id = '${optionsuser.id}'`, function(err, results, fields) {
                        if (err) throw err;
                        if (results.length > 0) {
                            if (results[0].Blacklisted === "True") {
                                interaction.reply("already blacklist", { ephemeral: true })
                            } else {
                                con.query(`UPDATE whitelist SET Blacklisted = 'True',Reason = '${optionsReason}' WHERE discord_id = '${optionsuser.id}'`, function(err, res) {
                                    interaction.reply("succesfully", { ephemeral: true })
                                })
                            }
                        } else {
                            interaction.reply("this user not whitelist", { ephemeral: true })
                        }
                    })
                } else {
                    interaction.reply("insert reason", { ephemeral: true })
                }
            } else {
                interaction.reply("select user", { ephemeral: true })
            }
        }
    }
}