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
        description: '警告を通知するロールを設定します。',
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
                description: '経費を申請する理由を教えてください。',
                required: true
            }
        ]
    },
    {
        name: 'set_treasury',
        description: '金庫内の金額を設定します。',
        options: [{
            name: 'amount',
            type: 4,
            description: '金庫へ追加する金額を入力してください。',
            required: true
        }]
    },
    {
        name: 'add_treasury',
        description: '金庫内に金額を追加します。',
        options: [{
            name: 'amount',
            type: 4,
            description: '追加する金額を入力してください。',
            required: true
        }]
    },
    {
        name: 'schedule_crime',
        description: '犯罪を予約します。',
        options: [
            {
                name: 'crime_name',
                type: 3,
                description: '犯罪の名前を入力してください。',
                required: true
            },
            {
                name: 'start_time',
                type: 3,
                description: '開始時間 (HH:MM)を入力してください。',
                required: true
            }
        ]
    },
    {
        name: 'attendance',
        description: '出欠を登録します。',
        options: [
            {
                name: 'status',
                type: 3, // STRING
                description: '参加 or 不参加',
                required: true,
                choices: [
                    { name: '参加', value: '参加します。' },
                    { name: '不参加', value: '不参加です。' }
                ]
            },
            {
                name: 'reason',
                type: 3, 
                description: '理由を入力してください',
                required: false
            }
        ]
    },
    {
        name: 'event',
        description: 'イベントを作成します。',
        options: [
            {
                name: 'title',
                type: 3,
                description: 'イベントのタイトルを入力してください。',
                required: true
            },
            {
                name: 'datetime',
                type: 3,
                description: '実施日時 (YYYY/MM/DD HH:MM)を入力してください。',
                required:false 
            },
            {
                name: 'deadline',
                type: 3,
                description: '募集締切時間 (HH:MM)を入力してください。',
                required: true
            },
            {
                name: 'description',
                type: 3,
                description: 'イベントの詳細を入力してください。',
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
