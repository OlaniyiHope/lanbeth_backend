// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // "whatsapp:+14155238886"

// const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// export async function sendSms(to, body) {
//   console.log("📤 [twilioService] Attempting to send WhatsApp message");
//   console.log("📤 [twilioService] to:", to);
//   console.log("📤 [twilioService] from:", whatsappFrom);
//   console.log("📤 [twilioService] body:", body);

//   if (!client) {
//     console.error("❌ [twilioService] Twilio client not initialized — check TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in .env");
//     throw new Error(
//       "Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env"
//     );
//   }
//   if (!to) {
//     console.error("❌ [twilioService] No 'to' phone number provided");
//     throw new Error("No guardian phone number on file");
//   }

//   const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

//   try {
//     const message = await client.messages.create({
//       body,
//       from: whatsappFrom,
//       to: formattedTo,
//     });
//     console.log("✅ [twilioService] Message sent! SID:", message.sid, "| status:", message.status);
//     return message;
//   } catch (err) {
//     console.error("❌ [twilioService] Twilio API error:", err.code, "-", err.message);
//     throw err;
//   }
// }
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const templateSid = process.env.TWILIO_WHATSAPP_TEMPLATE_SID;
console.log("🔧 [twilioService] Loaded templateSid from .env:", templateSid);
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(to, contentVariables) {
  console.log("📤 [twilioService] to:", to);
  console.log("📤 [twilioService] contentVariables:", contentVariables);

  if (!client) throw new Error("Twilio is not configured.");
  if (!to) throw new Error("No guardian phone number on file");
  if (!templateSid) throw new Error("TWILIO_WHATSAPP_TEMPLATE_SID is not set in .env");

  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const message = await client.messages.create({
      from: whatsappFrom,
      to: formattedTo,
      contentSid: templateSid,
      contentVariables: JSON.stringify(contentVariables),
    });
    console.log("✅ [twilioService] Sent! SID:", message.sid, "status:", message.status);
    return message;
  } catch (err) {
    console.error("❌ [twilioService] Twilio API error:", err.code, "-", err.message);
    throw err;
  }
}