const AWS = require("aws-sdk");

if (!AWS.config.region) {
  AWS.config.update({
    region: "us-east-1"
  });
}

const ses = new AWS.SES();

exports.handler = (event, context, callback) => {
  const response = {
      statusCode: 200,
      body: JSON.stringify({
          message: 'SQS event processed.',
          input: event,
      }),
  };
  
  console.log("data: ", JSON.stringify(event));

  const { name, email, message } = JSON.parse(event.Records[0].body);
  const emailParams = {
    Source: 'test@email.com',
    Destination: {
      ToAddresses: ['test@email.com'],
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Name: ${name}<p/> Email: ${email}<p/> Message: ${message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: "Customer Inquiry"
      }
    }
  };

  console.log("emailParams: ", JSON.stringify(emailParams));

  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      response.statusCode = 402
      response.body.message = `${err} ${err.stack}`
    }
    if (data) {
      response.body.message = 'SQS Event processed, Data:' + data
      console.log(data);
    }
  });

  callback(null, response);
};
