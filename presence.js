module.exports = (client) => {
    client.user.setPresence({
        activities: [{ name: "RPサーバーに参加中", type: 5 }],
        status: "online" // online, idle, dnd, invisible
    });
};
