const Discord = require('discord.js');

module.exports = {
    name: "script",
    description: "get your script",
    options: [
        {
            name: "game",
            description: "ใส่ game ที่มี",
            required: true,
            choices:[
                {
                    name:"Blox Fruit",
                    value:"Blox Fruit"
                }
            ],
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    async execute(client, interaction,AdminRole,ResetHwid,con,log,makeid,CooldownTime,NameHub) {
        var Game = interaction.options.getString("game")
        if (Game == "Blox Fruit") {
            con.query(`SELECT discord_id,Blacklisted,userkey,Reason FROM whitelist WHERE discord_id = '${interaction.user.id}'`, function(err, results, fields) {
                if (results.length > 0) {
                    if (results[0].Blacklisted === "True") {
                        interaction.reply("you got blacklist", { ephemeral: true })
                    } else {
                        const Embed = new Discord.MessageEmbed()
                        .setColor('#33FC9E')
                        .addField('Mob | Whitelist Manager', '```lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/hajigay/gay/main/Script.gay")){97370,86291,74761,09081,77809,15376}```', true)
                        .setFooter({text:'Mob', iconURL:client.user.displayAvatarURL()})
                        .setTimestamp()
                        
                        interaction.reply({embeds : [Embed], ephemeral: true })
                    }
                } else {
                    interaction.reply("you are not whitelisted", { ephemeral: true })
                }
            })
        } else {
            interaction.reply("you are not buyer this game", { ephemeral: true })
        }
    }
}