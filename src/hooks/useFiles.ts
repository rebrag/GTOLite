// src/hooks/useFiles.ts
import { useEffect, useState } from "react";

/**
 * Given a folder name, reads /data/<folder>/index.json and returns { files, error }.
 * Falls back to [] on error.
 */
const useFiles = (selectedFolder: string) => {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFolder) return;

    fetch(`/data/${selectedFolder}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<string[]>;
      })
      .then((arr) => setFiles(arr))
      .catch((err) => {
        console.error(err);
        setError(`Unable to load /data/${selectedFolder}/index.json`);
        setFiles([]); // empty list on error
      });
  }, [selectedFolder]);

  return { files, error };
};

export default useFiles;
