const { MessageEmbed } = require("discord.js");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["me"],
    name: "rank"
  },

  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
    const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    let tagged;
    if (conf.tag && conf.tag.length > 0) tagged = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.username.includes(conf.tag)).size : 0;
    else tagged = 0;

    const embed = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
      .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setDescription(` 
      Şu ana kadar toplamda **${total}** davetin bulunuyor. Yetki gözetleminde artış sağlamak istiyorsan sunucumuza daha fazla kullanıcı çekebilirsin.

      <:1984:832278576346562590> Davet Bilgilerin:
      • Gerçek: **${regular}**
      • Bonus: **${bonus}** 
      • Sunucudan Ayrılan: **${leave}**
      • Token Kullanıcı: **${fake}**
      • Günlük: \`${daily}\`
      • Haftalık: \`${weekly}\`
      • Taglı: \`${tagged}\`
      `);

    message.channel.send(embed);
  },
};
