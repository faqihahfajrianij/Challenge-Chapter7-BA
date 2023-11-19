require('dotenv').config();
const socketIO = require('socket.io'); 
const { google } = require('googleapis'); 

const io = socketIO(server); 
function sendWelcomeNotification(userId) {
  try {
    io.emit('welcome', {userId, message: 'Welcome to our app!'});
    console.log('Welcome notification sent');
  } catch (error) {
    throw new Error('Failed to send welcome notification');
  }
}

const calendar = google.calendar({
  auth: process.env.GOOGLE_API_TOKEN 
});
async function scheduleEvent(eventData) {
  try {
    await calendar.events.insert({
      calendarId: 'primary',
      resource: eventData
    });
    console.log('Event scheduled');
  } catch (error) {
    throw new Error('Failed to schedule event');
  }
}

module.exports = {
  sendWelcomeNotification,
  scheduleEvent,
};
