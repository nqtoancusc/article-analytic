const mongodb = require('mongodb');
const Channel = require('../../models/channel');

exports.getChannels = (req, res, next) => {
    Channel.fetchAll()
        .then(channels => {
            res.json({
                "message":"success",
                "channels":channels
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postGetChannelByName = (req, res, next) => {
    const name = req.body.name;
    Channel.findByName(name)
        .then(channel => {
            res.json({
                "message":"success",
                "channel":channel
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postAddChannel = (req, res, next) => {
    console.log('Start inserting a new channel');
    const name = req.body.name;
    const channel = new Channel(name);
    channel
        .save()
        .then(result => {
            console.log(result);
            console.log('Created Channel');
            res.json({
                "message": "success",
                "result": result
            });
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error": err.message})
            return;
        });
};

exports.postUpdateChannel = (req, res, next) => {
    const channelId = req.body.channelId;
    const updatedChannelName = req.body.channelName;

    const channel = new Channel(updatedChannelName, channelId);

    channel
        .save()
        .then(channel => {
            res.json({
                "message": "success",
                "channel": channel
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postDeleteChannel = (req, res, next) => {
    const channelId = req.body.channelId;
    Channel
        .deleteById(channelId)
        .then(channel => {
            res.json({
                "message": "success",
                "channel": channel
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};