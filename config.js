module.exports = {
    theater: {
        host: 'http://burn-the-witch.local:8000/public/puppeteer/#/'
    },
    peerjs: {
        key: 'peerjs',
        host: 'burn-the-witch.local',
        port: 9000,
        path: '/puppets',
        config: { 'iceServers': [{ 'url': 'stun:burn-the-witch.local:1234' }] }
    }
};
