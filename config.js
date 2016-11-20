module.exports = {
    theater: {
        host: 'http://localhost:8000/public/puppeteer/#/'
    },
    peerjs: {
        key: 'peerjs',
        host: 'localhost',
        port: 9000,
        path: '/puppets',
        config: { 'iceServers': [{ 'url': 'stun:127.0.0.1:1234' }] }
    }
};
