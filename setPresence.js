// setPresence.js
module.exports = function(client) {
    client.user.setPresence({
        status: 'online',
        activities: [{ name: 'サポート中', type: 'PLAYING' }]
    })
    .then(() => console.log("Presence updated!"))
    .catch(console.error);
};
