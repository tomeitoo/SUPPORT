require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// 環境変数の設定
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// 環境変数の検証
console.log('環境変数チェック:');
console.log('DISCORD_TOKEN:', TOKEN ? '設定済み' : '未設定');
console.log('CLIENT_ID:', CLIENT_ID ? '設定済み' : '未設定');

if (!TOKEN || !CLIENT_ID) {
    console.log('環境変数を設定してください！');
    process.exit(1);
}

const commands = [
    {
        name: 'set_alert_role',
        description: '警告を通知するロールを設定します',
        options: [{
            name: 'role',
            type: 8,
            description: '設定するロールを選択してください。',
            required: true
        }]
    },
    {
        name: 'expense',
        description: '経費を登録します。',
        options: [
            {
                name: 'amount',
                type: 4,
                description: '金額を入力してください。',
                required: true
            },
            {
                name: 'reason',
                type: 3,
                description: '理由を記入してください。',
                required: true
            }
        ]
    },
    {
        name: 'set_treasury',
        description: '金庫の金額を設定します。',
        options: [{
            name: 'amount',
            type: 4,
            description: '金額を入力してください。',
            required: true
        }]
    },
    {
        name: 'add_treasury',
        description: '金庫に金額を追加します。',
        options: [{
            name: 'amount',
            type: 4,
            description: '追加する金額を指定してください。',
            required: true
        }]
    },
    {
        name: 'reset_crime',
        description: 'リセット通知を出します。',
        options: [
            {
                name: 'crime_name',
                type: 3,
                description: '犯罪を選択してください。(コマンドは複数サーバーで共通です。サーバーにあったコマンドを使用してください。)',
                required: true,
                choices: [
                    { name: 'コンビニ強盗', value: 'convenience_store_robbery' },
                    { name: '金庫強盗', value: 'safecracker' },
                    { name: '客船強盗', value: 'yacht robbery' },
                    { name: 'オイルリグヘイスト', value: 'oil_rig_heist' },
                    { name: '飛行場襲撃', value: 'airfield_assault' },
                    { name: 'ユニオン銀行襲撃', value: 'union_robbery' },
                    { name: 'ボブキャット襲撃', value: 'Bobcat_raid' },
                    { name: 'アーティファクト', value: 'artifact' },
                    { name: 'バージ', value: 'barge' },
                ]
            }
        ]
    }
    

];

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('コマンドの登録に成功しました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();

(async () => {
    try {
        console.log('グローバルスラッシュコマンドの登録を開始します...');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('全サーバーでスラッシュコマンドの登録が完了しました！');
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
