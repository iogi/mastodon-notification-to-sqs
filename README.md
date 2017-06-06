# mastodon-notification-to-sqs

This is an AWS Lambda function which receive notifications using Mastodon API.

## Environment Variables

Need to set below environment variables

- API_URL: API endpoint. i.e. `https://qiitadon.com/api/v1/`
- ACCESS_TOKEN: an access token for API
- REGION: AWS region. i.e. `us-west-2`
- QUEUE_URL: SQS Queue URL. i.e. `https://sqs.us-west-2.amazonaws.com/<account_id>/<queue_name>`

## TODO

many things...

- pagination
- save last notificaiton id
