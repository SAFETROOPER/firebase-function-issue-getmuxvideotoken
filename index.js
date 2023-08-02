const {onCall} = require('firebase-functions/v2/https');
const {JWT} = require('@mux/mux-node');

exports.getmuxvideotoken = onCall({
    region: 'europe-west3',
    timeoutSeconds: 60,
    minInstances: 1,
    maxInstances: 10,
    concurrency: 100,
}, (req, res) => {
    let token = '';
    try {
        const playbackId = req.data.playbackId

        let baseOptions = {
            keyId: process.env.MUX_SIGNING_KEY,
            keySecret: process.env.MUX_PRIVATE_KEY,
            expiration: '1h'
        };
        token = JWT.signPlaybackId(playbackId, {...baseOptions, type: 'video'});
    } catch (e) {
        return {
            status: 'error',
            code: 500,
            message: 'Token creation failed'
        }
    }
    return {
        status: 'success',
        code: 200,
        token: token
    }
});