// setPresence.js
module.exports = function(client) {
    client.user.setPresence({
        status: 'online',
        activities: [{ name: 'サポート中', type: 'PLAYING' }]
    })
    console.log("Presence updated!"))
    .catch(console.error);
};
