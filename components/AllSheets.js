"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllSheets({ onSelectSheet }) {
  const [sheets, setSheets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await axios.get('/api/getAllSheets');
        setSheets(response.data);
      } catch (error) {
        console.error("Error fetching sheets:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load: {error.message}</div>;

  return (
    <div>
      <h2>Select a Spreadsheet</h2>
      <select onChange={(e) => onSelectSheet(e.target.value)}>
        <option value="">Select a spreadsheet</option>
        {sheets.map(sheet => (
          <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
        ))}
      </select>
    </div>
  );
}
