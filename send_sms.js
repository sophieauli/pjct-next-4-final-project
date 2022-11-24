// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'You are invited! Please click here to let the host know whether you can make it.',
    from: '+13469109159',
    to: '+436641133183',
  })
  .then((message) => console.log(message.sid));

export async function getServerSideProps() {
  // const guestPhoneNumer = await?
  //
}
