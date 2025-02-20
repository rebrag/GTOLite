// src/App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import DecisionMatrix from "./components/DecisionMatrix";
// In App.tsx (or index.tsx)
import "./App.css";


const actionToPrefix: Record<string, string> = {
  Fold: "0",
  ALLIN: "3",
  Min: "5",
  Call: "1",
  Raise2bb: "15",
};

function App() {
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [rootPrefix, setRootPrefix] = useState<string>("root");
  const [error, setError] = useState<string | null>(null);

  // Fetch folders on component mount.
  useEffect(() => {
    axios
      .get<string[]>("http://localhost:5192/api/Files/folders")
      .then((response) => {
        setFolders(response.data);
        if (response.data.length > 0) {
          setSelectedFolder(response.data[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching folders");
      });
  }, []);

  // Fetch files when selectedFolder changes.
  useEffect(() => {
    if (!selectedFolder) return;
    axios
      .get<string[]>(`http://localhost:5192/api/Files/listJSONs/${selectedFolder}`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching files");
      });
  }, [selectedFolder]);

  // Filter files based on the selected rootPrefix.
  const decisionMatrixFiles = files.filter((file) => {
    if (rootPrefix === "root") {
      return file === "root.json" || /^0(?:\.0+)*\.json$/.test(file);
    }
    // Build a regex pattern: for prefix "5", match files like "5.json", "5.0.json", "5.0.0.json", etc.
    const pattern = new RegExp(`^${rootPrefix}(?:\\.0+)*\\.json$`);
    return pattern.test(file);
  });

  // Global onSelectAction handler.
  const handleSelectAction = (parentPrefix: string, action: string) => {
    const mapping = actionToPrefix[action];
    if (!mapping) {
      setRootPrefix("root");
      return;
    }
    const newRoot = parentPrefix === "root" ? mapping : `${parentPrefix}.${mapping}`;
    setRootPrefix(newRoot);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Poker Strategy Grids</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      
      {/* Folder selector */}
      <div style={{ marginBottom: "10px" }}>
          Preflop Sim:{" "}
          <select
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e.target.value);
              // Optionally reset the rootPrefix when the folder changes.
              setRootPrefix("root");
            }}
          >
            {folders.map((folder, index) => (
              <option key={index} value={folder}>
                {folder}
              </option>
            ))}
          </select>
      </div>
      
      {/* Show current root prefix */}
      <div style={{ marginBottom: "10px" }}>
        <strong>Current Root: </strong>
        {rootPrefix}
      </div>

      <div className="matrix-grid">
      {decisionMatrixFiles.map((file) => {
        return (
          <DecisionMatrix
            key={file}
            folder={selectedFolder}
            file={file}
            onSelectAction={handleSelectAction}
          />
        );
      })}
      </div>


    </div>
  );
}

export default App;
