// pages/api/fetchSpreadsheet.js
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

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = req.query.spreadsheetId;
    if (!spreadsheetId) {
      console.error("No spreadsheet ID provided");
      return res.status(400).json({ error: "No spreadsheet ID provided" });
    }

    // Fetch spreadsheet metadata to get sheet names
    const metaDataResponse = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetsInfo = metaDataResponse.data.sheets;
    const sheetDataPromises = sheetsInfo.map(async (sheet) => {
      const sheetName = sheet.properties.title;

      // Fetch the first row (column headers) for each sheet
      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!1:1`,
      });

      return {
        sheetName,
        headers: dataResponse.data.values[0] || [],
      };
    });

    const sheetsData = await Promise.all(sheetDataPromises);

    const result = sheetsData.reduce((acc, { sheetName, headers }) => {
      acc[sheetName] = headers;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ error: "Error fetching spreadsheet data" });
  }
}
