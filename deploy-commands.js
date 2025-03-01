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
        description: '警告を通知するロールを設定',
        options: [{
            name: 'role',
            type: 8,
            description: '設定するロール',
            required: true
        }]
    },
    {
        name: 'expense',
        description: '経費を登録',
        options: [
            {
                name: 'amount',
                type: 4,
                description: '金額',
                required: true
            },
            {
                name: 'reason',
                type: 3,
                description: '理由',
                required: true
            }
        ]
    },
    {
        name: 'set_treasury',
        description: '金庫の金額を設定',
        options: [{
            name: 'amount',
            type: 4,
            description: '金額',
            required: true
        }]
    },
    {
        name: 'add_treasury',
        description: '金庫に金額を追加',
        options: [{
            name: 'amount',
            type: 4,
            description: '追加する金額',
            required: true
        }]
    },
    {
        name: 'schedule_crime',
        description: '犯罪を予約',
        options: [
            {
                name: 'crime_name',
                type: 3,
                description: '犯罪の名前',
                required: true
            },
            {
                name: 'start_time',
                type: 3,
                description: '開始時間 (HH:MM)',
                required: true
            }
        ]
    },
    {
        name: 'attendance',
        description: '出欠を登録します',
        options: [
            {
                name: 'status',
                type: 3, // STRING
                description: '参加 or 不参加',
                required: true,
                choices: [
                    { name: '参加', value: '参加' },
                    { name: '不参加', value: '不参加' }
                ]
            },
            {
                name: 'reason',
                type: 3, // STRING
                description: '理由を入力してください',
                required: false
            }
        ]
    },
    {
        name: 'event',
        description: 'イベントを作成',
        options: [
            {
                name: 'title',
                type: 3,
                description: 'イベントのタイトル',
                required: true
            },
            {
                name: 'datetime',
                type: 3,
                description: '実施日時 (YYYY/MM/DD HH:MM)',
                required: true
            },
            {
                name: 'description',
                type: 3,
                description: 'イベントの詳細',
                required: false
            },
            {
                name: 'deadline',
                type: 3,
                description: '募集締切時間 (HH:MM)',
                required: false
            }
        ]
    },
    
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

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
