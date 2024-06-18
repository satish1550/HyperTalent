"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SpreadsheetData({ spreadsheetId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/fetchSpreadsheet?spreadsheetId=${spreadsheetId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching spreadsheet data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spreadsheetId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load: {error.message}</div>;

  return (
    <div>
      {Object.keys(data).map((sheetName) => (
        <div key={sheetName}>
          <h2>{sheetName}</h2>
          <table>
            <thead>
              <tr>
                {data[sheetName].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      ))}
    </div>
  );
}
