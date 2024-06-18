"use client";
import { useState } from 'react';
import AllSheets from '../components/AllSheets';
import TabsWithColumns from '../components/TabsWithColumns';

export default function Home() {
  const [selectedSheetId, setSelectedSheetId] = useState("");

  return (
    <div>
      <AllSheets onSelectSheet={setSelectedSheetId} />
      {selectedSheetId && <TabsWithColumns spreadsheetId={selectedSheetId} />}
    </div>
  );
}
