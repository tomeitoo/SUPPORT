module.exports = function(client) {
    try {
        client.user.setPresence({
            status: 'online',
            activities: [{ name: 'サポート中', type: 'PLAYING' }]
        });
        console.log("Presence updated!");
    } catch (error) {
        console.error("Error updating presence:", error);
    }
};
