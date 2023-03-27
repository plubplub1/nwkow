const Discord = require('discord.js');

module.exports = {
    name: "resethwid",
    description: "รีเซ็ต Hwid ของ User ที่เลือก",
    options: [
        {
            name: "user",
            description: "เลือก User ที่ต้องการ",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.USER
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var selectuser = interaction.options.getUser("user")
        if (!interaction.member.roles.cache.some(role => role.id === ResetHwid || role.id === AdminRole)) {
            interaction.reply("you dont have perms", { ephemeral: true })
        } else {
            if (selectuser.id) {
                con.query(`SELECT discord_id,Blacklisted,Reason FROM whitelist WHERE discord_id = '${selectuser.id}'`, function(err, results, fields) {
                    if (err) throw err;
                    if (results.length > 0) {
                        if (results[0].Blacklisted === "True") {
                            interaction.reply("this user got blacklist", { ephemeral: true })
                        } else {
                            con.query(`UPDATE whitelist SET hwid = 'Unknown' WHERE discord_id = '${selectuser.id}'`, function(err, res) {
                                interaction.reply("succesfully", { ephemeral: true })
                            })
                        }
                    } else {
                        interaction.reply("this user not whitelisted", { ephemeral: true })
                    }
                })
            } else {
                interaction.reply("selected user plsssss", { ephemeral: true })
            }
        }
    }
}