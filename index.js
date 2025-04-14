import 'dotenv/config';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { createServer } from 'http';


// クライアントの初期化
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// グローバル変数の初期化（ここに全ての Map を定義）
let treasuryData = new Map();
let alertRoleData = new Map();
const eventResponses = new Map();

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
                .setTitle('💸 経費を請求しました')
                .addFields(
                    { name: '金額', value: `${amount.toLocaleString()}円`, inline: true },
                    { name: '理由', value: reason, inline: true },
                    { name: '使用者', value: interaction.user.tag, inline: true },
                    { name: '使用日時', value: new Date().toLocaleString('ja-JP',{
                        timeZone: 'Asia/Tokyo',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }), inline: false },
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
            }
    switch (commandName) {
        case 'reset_crime': {
                const crimeName = options.getString('crime_name');
            
                const resetEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('🔁 リセット通知')
                    .addFields(
                        { name: '対象の犯罪', value: crimeName, inline: true },
                        { name: '通知者', value: interaction.user.tag, inline: true }
                    );
            
            await interaction.reply({ embeds: [resetEmbed] });
            break;
            }
        }
        
    });

// HTTPサーバーの追加
const server = createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running!');
});

server.listen(8000, () => {
    console.log("Server is running on port 8000");
});

// 環境変数からトークンを読み込んでボットを起動
client.login(process.env.DISCORD_TOKEN);
