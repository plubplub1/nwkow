const Discord = require('discord.js');

module.exports = {
    name: "unblacklist",
    description: "unBlacklist User ที่เลือก",
    options: [
        {
            name: "user",
            description: "เลือก User ที่ต้องการ",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.USER
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var optionsuser = interaction.options.getUser("user")
        if (!interaction.member.roles.cache.some(role => role.id === AdminRole)) {
            interaction.reply("you dont have perms", { ephemeral: true })
        } else {
            if (optionsuser.id) {
                con.query(`SELECT discord_id,Blacklisted FROM whitelist WHERE discord_id = '${optionsuser.id}'`, function(err, results, fields) {
                    if (err) throw err;
                    if (results.length > 0) {
                        if (results[0].Blacklisted === "False") {
                            interaction.reply("this user not blacklist", { ephemeral: true })
                        } else {
                            con.query(`UPDATE whitelist SET Blacklisted = 'False',Reason = 'Unknown' WHERE discord_id = '${optionsuser.id}'`, function(err, res) {
                                interaction.reply("succesfully", { ephemeral: true })
                            })
                        }
                    } else {
                        interaction.reply("this user not whitelisted", { ephemeral: true })
                    }
                })
            } else {
                interaction.reply("select user", { ephemeral: true })
            }
        }
    }
}