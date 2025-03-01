module.exports = function setPresence(client) {
    client.user.setPresence({
        activities: [{
            name: 'RPサーバーに参加中',
            type: 'COMPETING'
        }],
        status: 'online'
    });
};
