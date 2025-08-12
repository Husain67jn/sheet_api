import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const {
      BookingID, CreatedAt, Status, CustomerName, Phone, Service, Date,
      StartTime, EndTime, Staff, Channel, Notes, CalendarEventID, ConfirmationSMSSent
    } = req.body;

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Bookings!A:N",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          BookingID, CreatedAt, Status, CustomerName, Phone, Service, Date,
          StartTime, EndTime, Staff, Channel, Notes, CalendarEventID, ConfirmationSMSSent
        ]],
      },
    });

    res.status(200).json({ success: true, result: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
