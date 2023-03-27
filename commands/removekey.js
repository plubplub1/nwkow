const Discord = require('discord.js');

module.exports = {
    name: "removekey",
    description: "ลบ Key ที่เลือก",
    options: [
        {
            name: "key",
            description: "ใส่ key ที่ต้องการลบ",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var optionskey = interaction.options.getString("key")
        if (!interaction.member.roles.cache.some(role => role.id === AdminRole)) {
            interaction.reply("not acces noob permission", { ephemeral: true })
        } else {
            if (optionskey) {
                con.query(`SELECT discord_id,Blacklisted,Reason FROM whitelist WHERE userkey = ?`,[optionskey], function(err, results, fields) {
                    if (err) throw err;
                    if (results.length > 0) {
                        con.query(`DELETE FROM whitelist WHERE userkey = ?`,[optionskey] , function (err , res) {
                            if (err) throw err;
                            if (res.warningCount === 0 ) {
                                interaction.reply("delete key succes", { ephemeral: true })
                            }
                        })
                    } else {
                        interaction.reply("dont have key in database", { ephemeral: true })
                    }
                })
            } else {
                interaction.reply("insert key", { ephemeral: true })
            }
        }
    }
}