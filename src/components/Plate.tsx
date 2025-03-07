// src/components/Plate.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileData, combineDataByHand, HandCellData } from "../utils/utils";
import ColorKey from "./ColorKey";
import DecisionMatrix from "./DecisionMatrix";

interface PlateProps {
  folder: string;
  file: string;
  onSelectAction: (parentPrefix: string, action: string) => void;
  randomFillEnabled?: boolean;
}

const Plate: React.FC<PlateProps> = ({ folder, file, onSelectAction, randomFillEnabled }) => {
  const [rawData, setRawData] = useState<FileData | null>(null);
  const [combinedData, setCombinedData] = useState<HandCellData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file data when folder/file changes
  useEffect(() => {
    setLoading(true);
    axios
      .get<FileData>(`https://gtotest1.azurewebsites.net/api/Files/${folder}/${file}`)
      .then((response) => {
        setRawData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching file data");
        setLoading(false);
      });
  }, [folder, file]);

  // Process file data into grid data
  useEffect(() => {
    if (!rawData) return;
    const data = combineDataByHand(rawData);
    setCombinedData(data);
  }, [rawData]);

  // Get parent prefix from file name
  const parentPrefix = file.replace(".json", "");

  return (
    <div
      className="mb-0 mx-auto border rounded-[6px] shadow-md p-1 bg-white
                 w-full transition-all duration-200 text-base"
    >
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && rawData && (
        <>
          {/* Header: Position, BB Info and ColorKey */}
          <div className="select-none flex w-full items-center justify-between">
            <h2 className="whitespace-nowrap font-bold text-lg max-[440px]:text-[11px] text-gray-800">
              {rawData.Position || file} {rawData.bb}bb
            </h2>
            <ColorKey
              data={combinedData}
              onSelectAction={(action) => onSelectAction(parentPrefix, action)}
            />
          </div>
          {/* DecisionMatrix (grid of hand cells) */}
          <DecisionMatrix gridData={combinedData} randomFillEnabled={randomFillEnabled} />
        </>
      )}
    </div>
  );
};

export default Plate;
