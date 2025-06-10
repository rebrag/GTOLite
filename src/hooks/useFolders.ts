// src/hooks/useFolders.ts
import { useEffect, useState } from "react";

/**
 * Reads /data/index.json and exposes { folders, selectedFolder, setSelectedFolder, error }
 */
const useFolders = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<string[]>;
      })
      .then((arr) => {
        setFolders(arr);
        if (arr.length > 0) setSelectedFolder(arr[0]);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load folder list (data/index.json missing?)");
      });
  }, []);

  return { folders, selectedFolder, setSelectedFolder, error };
};

export default useFolders;
