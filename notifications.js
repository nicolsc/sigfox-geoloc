var notifications = {enabled:true, channel:'twilio'};
if (!process.env.TWILIO_SID || ! process.env.TWILIO_TOKEN || !process.env.TWILIO_FROM || !process.env.PHONE){
  console.warn("⚠️  No Twilio credentials (TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE & PHONE required)\n No notifications will be sent");
  notifications.enabled = false;
}


const sendPositionMsg = (payload, locations) => {
  console.log("sendPosition",locations);
  if (!notifications.enabled){
    return;
  }
  if (locations && locations.length){
    var position = locations[0];
    var msg = `[Sigfox geoloc - device ${payload.device}]\n
    Last message sent from in ${position.city}, ${position.state})\n\n
    Within ${payload.radius} meters of ${position.formattedAddress} (${payload.lat}° ${payload.lng}°)`
    console.log("about to send SMS", msg);
    return sendSMS(msg);
  }
  else{
    console.warn("⚠️  No geocoding response");
    return sendErrorMsg("⚠️ Unable to get a location for this message");
  }
};

const sendErrorMsg = (payload, err) => {
  var msg = `[Sigfox device ${payload.device}]⚠️  An error occurred\n${err.status}: ${err.message}`;

  if (notifications.enabled){
    sendSMS(msg);
  }
  else {
    console.warn(msg);
  }
};
const sendSMS = txt => {
  const twilio = require('twilio');
  const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  client.messages.create({
      body: txt,
      to: process.env.PHONE,  // Text this number
      from: process.env.TWILIO_FROM // From a valid Twilio number
  })
  .then((message) => console.log("Twilio OK",message.sid);)
  .catch(err => console.log("Twilio err", err););
};

module.exports  ={
  sendError : sendErrorMsg,
  sendPosition : sendPositionMsg
};
