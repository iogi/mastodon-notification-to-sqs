const Mastdon = require('mastodon-api');
const AWS = require('aws-sdk');
const util = require('util');

const accessToken = process.env.ACCESS_TOKEN;
const ApiUrl = process.env.API_URL;
const region = process.env.REGION;
const queueUrl = process.env.QUEUE_URL;

AWS.config.update({ region });

exports.handler = (event, context, callback) => {
  const config = {
    api_url: ApiUrl,
    access_token: accessToken,
  };
  let messageCount = 0;
  const qiitadon = new Mastdon(config);
  const sqs = new AWS.SQS();

  qiitadon.get('notifications', (err, data) => {
    if (err) {
      throw err;
    }
    messageCount = data.length;

    while (data.length) {
      const messages = [];
      data.splice(0, 10).forEach((item) => {
        const message = {
          Id: item.id.toString(),
          MessageBody: JSON.stringify(item),
          MessageAttributes: {
            type: {
              DataType: 'String',
              StringValue: item.type,
            },
          },
        };
        messages.push(message);
      });

      const params = {
        QueueUrl: queueUrl,
        Entries: messages,
      };

      sqs.sendMessageBatch(params, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    callback(null, util.format('%d notifications queued', messageCount));
  });
};
