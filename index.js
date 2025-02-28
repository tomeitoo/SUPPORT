require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// クライアントの初期化
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// グローバル変数の初期化
let treasuryData = new Map(); // サーバーごとの金庫データ
let alertRoleData = new Map(); // サーバーごとの警告ロール
let scheduledCrimes = new Map(); // サーバーごとの予約された犯罪

client.once('ready', () => {
    console.log(`${client.user.tag} がオンラインになりました！`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, guildId } = interaction;

    // サーバーごとのデータ初期化
    if (!treasuryData.has(guildId)) {
        treasuryData.set(guildId, 0);
    }
    if (!scheduledCrimes.has(guildId)) {
        scheduledCrimes.set(guildId, []);
    }

    // コマンド処理
    switch (commandName) {
        case 'set_alert_role':
            const role = options.getRole('role');
            alertRoleData.set(guildId, role.id);
            
            const roleEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('👨‍💻 金庫の残高減少を警告するロールを設定しました。')
                .setDescription(`設定されたロール: ${role.name}`);
            
            await interaction.reply({ embeds: [roleEmbed] });
            break;

        case 'expense':
            const amount = options.getInteger('amount');
            const reason = options.getString('reason');
            const currentTreasury = treasuryData.get(guildId);
            
            if (amount > currentTreasury) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('エラー')
                    .setDescription('⚠︎ 金庫の残高が不足しています。');
                
                await interaction.reply({ embeds: [errorEmbed] });
                return;
            }

            const newBalance = currentTreasury - amount;
            treasuryData.set(guildId, newBalance);
            
            const expenseEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🪙 経費を請求しました')
                .addFields(
                    { name: '金額', value: `${amount.toLocaleString()}円`, inline: true },
                    { name: '理由', value: reason, inline: true },
                    { name: '使用者', value: interaction.user.tag, inline: true },
                    { name: '使用日時', value: new Date().toLocaleString('ja-JP'), inline: false },
                    { name: '残高', value: `${newBalance.toLocaleString()}円`, inline: true }
                );

            if (newBalance < 10000000 && alertRoleData.has(guildId)) {
                expenseEmbed.addFields({
                    name: '⚠️ 警告',
                    value: `<@&${alertRoleData.get(guildId)}> 残高が1000万円を下回りました！`,
                    inline: false
                });
            }
            
            await interaction.reply({ embeds: [expenseEmbed] });
            break;
        case 'set_treasury':
            const newAmount = options.getInteger('amount');
            treasuryData.set(guildId, newAmount);
            
            const treasuryEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🏦 金庫の金額を設定しました')
                .addFields(
                    { name: '現在の残高', value: `${newAmount.toLocaleString()}円` }
                );
            
            await interaction.reply({ embeds: [treasuryEmbed] });
            break;

        case 'add_treasury':
            const addAmount = options.getInteger('amount');
            const currentAmount = treasuryData.get(guildId);
            const updatedAmount = currentAmount + addAmount;
            treasuryData.set(guildId, updatedAmount);
            
            const addEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('💳 金庫に金額を追加しました')
                .addFields(
                    { name: '追加金額', value: `${addAmount.toLocaleString()}円`, inline: true },
                    { name: '現在の残高', value: `${updatedAmount.toLocaleString()}円`, inline: true }
                );
            
            await interaction.reply({ embeds: [addEmbed] });
            break;

        case 'schedule_crime':
            const crimeName = options.getString('crime_name');
            const startTime = options.getString('start_time');
            
            if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
                const timeErrorEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('エラー')
                    .setDescription('時間形式が正しくありません (HH:MM)');
                
                await interaction.reply({ embeds: [timeErrorEmbed] });
                return;
            }

            const [hours, minutes] = startTime.split(':').map(Number);
            const scheduleTime = new Date();
            scheduleTime.setHours(hours, minutes, 0);

            if (scheduleTime < new Date()) {
                scheduleTime.setDate(scheduleTime.getDate() + 1);
            }

            const serverCrimes = scheduledCrimes.get(guildId);
            serverCrimes.push({
                name: crimeName,
                time: scheduleTime,
                channelId: interaction.channelId
            });
            scheduledCrimes.set(guildId, serverCrimes);

            const crimeEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚔️ 犯罪を予約しました')
                .addFields(
                    { name: '犯罪名', value: crimeName, inline: true },
                    { name: '開始時間', value: startTime, inline: true }
                );

            await interaction.reply({ embeds: [crimeEmbed] });
            break;
            case 'attendance':
    const attendanceStatus = interaction.options.getString('status');
    const attendanceReason = interaction.options.getString('reason');
    
    const attendanceEmbed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('出欠登録')
        .addFields(
            { name: '出欠', value: attendanceStatus, inline: true },
            { name: '理由', value: attendanceReason, inline: true },
            { name: '登録者', value: interaction.user.tag, inline: true },
            { name: '登録日時', value: new Date().toLocaleString('ja-JP'), inline: false }
        );
    
    await interaction.reply({ embeds: [attendanceEmbed] });
    break;
    }
});

// 犯罪通知の定期チェック
setInterval(async () => {
    const now = new Date();
    
    for (const [guildId, crimes] of scheduledCrimes.entries()) {
        for (let i = crimes.length - 1; i >= 0; i--) {
            const crime = crimes[i];
            const timeDiff = crime.time - now;

            try {
                const channel = await client.channels.fetch(crime.channelId);

                // 30分前の通知
                if (timeDiff <= 1800000 && timeDiff > 1740000) {
                    const notifyEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('⏰ 犯罪開始30分前')
                        .setDescription(`${crime.name}が30分後に開始されます`);
                    
                    await channel.send({ embeds: [notifyEmbed] });
                }

                // 開始時間の通知
                if (crime.time <= now) {
                    const startEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('🔫 犯罪開始')
                        .setDescription(`${crime.name}の開始時間です`);
                    
                    await channel.send({ embeds: [startEmbed] });
                    crimes.splice(i, 1);
                }
            } catch (error) {
                console.error(`通知エラー: ${error}`);
                crimes.splice(i, 1);
            }
        }
        scheduledCrimes.set(guildId, crimes);
    }
}, 60000);
// HTTPサーバーの追加
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running!');
});
server.listen(8000);

// 既存のDiscordボットコード
client.once('ready', () => {
    console.log(`${client.user.tag} がオンラインになりました！`);
    // その他の設定
});


// 環境変数からトークンを読み込んでボットを起動
client.login(process.env.DISCORD_TOKEN);
