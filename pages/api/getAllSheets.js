// pages/api/getAllSheets.js
import { getSession } from "next-auth/react";
import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      console.error("No session found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { accessToken } = session;
    if (!accessToken) {
      console.error("No access token found in session");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth });

    // Fetch all spreadsheets
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: "files(id, name)",
    });

    const spreadsheets = response.data.files;

    res.status(200).json(spreadsheets);
  } catch (error) {
    console.error("Error fetching spreadsheets:", error);
    res.status(500).json({ error: "Error fetching spreadsheets" });
  }
}
