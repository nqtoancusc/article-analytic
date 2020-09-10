const Channel = require('../../models/channel');

exports.getAddChannel = (req, res, next) => {
    res.render('admin/channels/add-channel', {
        pageTitle: 'Add new channel',
        path: '/admin/channels/add-channel',
        editing: false
    });
};

exports.getChannel = (req, res, next) => {
    const channelId = req.params.id
    Channel.findById(channelId)
      .then(channel => {
        console.log(channel);
        res.render('admin/channels/channel', {
          channel: channel,
          pageTitle: 'Channel',
          path: '/admin/channels/channel',
          editing: true
        });
      }).catch(err => {
        console.log(err);
      });
};

exports.getChannels = (req, res, next) => {
    Channel.fetchAll()
      .then(channels => {
        res.render('admin/channels/channels', {
          channels: channels,
          pageTitle: 'Channels',
          path: '/admin/channels/channels'
        });
      }).catch(err => {
        console.log(err);
      });
};