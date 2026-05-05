import twilio from 'twilio';

/**
 * WhatsApp Notification Service
 */

const getTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
};

const formatWhatsAppNumber = (phone) => {
  if (!phone) return null;
  let cleanPhone = phone.replace(/\D/g, ''); 
  if (!phone.startsWith('+')) {
    cleanPhone = `+91${cleanPhone}`;
  } else {
    cleanPhone = `+${cleanPhone}`;
  }
  return `whatsapp:${cleanPhone}`;
};

export const sendCustomerNotification = async (booking, taxi, driver) => {
  const client = getTwilioClient();
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;
  const toWhatsApp = formatWhatsAppNumber(booking.phone);
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  const message = `
🚖 *Trip Allocation Confirmed!*

Hello *${booking.customer}*, your taxi is on the way.

*Taxi Details:*
🚗 Model: ${taxi.model}
🔢 Number: ${taxi.taxiNumber}
👤 Driver: ${driver.name} (${driver.phone})

*Update Trip Status (Tap below):*

📍 [ I AM PICKED UP ]
${baseUrl}/api/trips/${booking._id}/update-status?status=On%20Trip

🏁 [ TRIP COMPLETED ]
${baseUrl}/api/trips/${booking._id}/update-status?status=Completed

Thank you!
  `.trim();

  if (client && fromWhatsApp && toWhatsApp) {
    try {
      await client.messages.create({ body: message, from: fromWhatsApp, to: toWhatsApp });
    } catch (err) {
      console.error(`[Twilio Error] Customer: ${err.message}`);
    }
  } else {
    console.log(`[MOCK Customer]:\n${message}\n`);
  }
  return true;
};

export const sendDriverNotification = async (booking, taxi, driver) => {
  const client = getTwilioClient();
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;
  const toWhatsApp = formatWhatsAppNumber(driver.phone);
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  const message = `
📱 *New Trip Assigned!*

Hello *${driver.name}*, you have a new assignment.

*Trip Details:*
👤 Customer: ${booking.customer}
📞 Phone: ${booking.phone}
📍 Pickup: ${booking.pickup}
🏁 Drop: ${booking.drop}

*Manage Trip (Tap below):*

🚖 [ START TRIP ]
${baseUrl}/api/trips/${booking._id}/update-status?status=On%20Trip

✅ [ FINISH TRIP ]
${baseUrl}/api/trips/${booking._id}/update-status?status=Completed

Drive safe!
  `.trim();

  if (client && fromWhatsApp && toWhatsApp) {
    try {
      await client.messages.create({ body: message, from: fromWhatsApp, to: toWhatsApp });
    } catch (err) {
      console.error(`[Twilio Error] Driver: ${err.message}`);
    }
  } else {
    console.log(`[MOCK Driver]:\n${message}\n`);
  }
  return true;
};
