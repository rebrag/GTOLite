import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import NavBar from "./NavBar";
import PlateGrid from "./PlateGrid";
import Layout from "./Layout";
import { actionToPrefixMap } from "../constants";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useFolders from "../hooks/useFolders";
import useFiles from "../hooks/useFiles";
import axios from "axios";
import { JsonData } from "../utils/utils";

const Main = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { windowWidth } = useWindowDimensions();
  const { folders, selectedFolder, setSelectedFolder, error: folderError } = useFolders(API_BASE_URL);
  const { files: availableJsonFiles, error: filesError } = useFiles(API_BASE_URL, selectedFolder);

  const [clickedRoot, setClickedRoot] = useState("");
  const [randomFillEnabled, setRandomFillEnabled] = useState(false);
  const [isSpiralView, setIsSpiralView] = useState(true);

  // Determine the number of players based on the selected folder.
  const playerCount = useMemo(() => (selectedFolder ? selectedFolder.split("_").length : 1), [selectedFolder]);

  // Generate default plate names.
  const defaultPlateNames = useMemo(() => {
    const filesArray: string[] = [];
    for (let i = 0; i < playerCount - 1; i++) {
      filesArray.push(i === 0 ? "root.json" : Array(i).fill("0").join(".") + ".json");
    }
    if (playerCount > 1) {
      const zeros = Array(playerCount - 1).fill("0");
      zeros[zeros.length - 1] = "1";
      filesArray.push(zeros.join(".") + ".json");
    }
    return filesArray;
  }, [playerCount]);

  // Plate view state.
  const [loadedPlates, setLoadedPlates] = useState<string[]>(defaultPlateNames);
  const [plateMapping, setPlateMapping] = useState<Record<string, string>>({});
  const [plateData, setPlateData] = useState<Record<string, JsonData>>({});
  const fetchedPlatesRef = useRef<Set<string>>(new Set());

  // Cache for the base (initial) plate data.
  const [plateCache, setPlateCache] = useState<{
    plateMapping: Record<string, string>;
    plateData: Record<string, JsonData>;
  }>({ plateMapping: {}, plateData: {} });

  // Define position order based on player count.
  const positionOrder = useMemo(() => {
    if (playerCount === 8) return ["UTG", "UTG1", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
    if (playerCount === 6) return ["LJ", "HJ", "CO", "BTN", "SB", "BB"];
    return Object.keys(plateMapping);
  }, [playerCount, plateMapping]);

  const [displayPlates, setDisplayPlates] = useState<string[]>([]);
  useEffect(() => {
    setDisplayPlates(positionOrder.map((pos) => plateMapping[pos] || ""));
  }, [plateMapping, positionOrder]);

  // Reset all plate-related states and clear the cache.
  const resetPlateState = useCallback(() => {
    setLoadedPlates(defaultPlateNames);
    setPlateMapping({});
    setPlateData({});
    fetchedPlatesRef.current = new Set();
    setPlateCache({ plateMapping: {}, plateData: {} });
  }, [defaultPlateNames]);

  // Reset only the view state, restoring from the cache if available.
  const resetViewState = useCallback(() => {
    setLoadedPlates(defaultPlateNames);
    setClickedRoot("");
    if (Object.keys(plateCache.plateMapping).length > 0) {
      setPlateMapping(plateCache.plateMapping);
      setPlateData(plateCache.plateData);
    }
  }, [defaultPlateNames, plateCache]);

  // Reset plate state when the selected folder (and thus playerCount) changes.
  useEffect(() => {
    resetPlateState();
  }, [selectedFolder, resetPlateState]);

  // Debug logs.
  useEffect(() => {
    console.log("loadedPlates:", loadedPlates);
    console.log("displayPlates:", displayPlates);
  }, [loadedPlates, displayPlates]);

  // Fetch plate data and update the cache only once for the base view.
  // Fetch plate data and update the cache only once for the base view.
useEffect(() => {
  // Create a cancel token for this effect.
  const source = axios.CancelToken.source();

  if (selectedFolder && loadedPlates.length) {
    const platesToFetch = loadedPlates.filter(
      (plate) => !fetchedPlatesRef.current.has(plate)
    );

    Promise.all(
      platesToFetch.map((plate) =>
        axios
          .get(`${API_BASE_URL}/api/Files/${selectedFolder}/${plate}`, {
            cancelToken: source.token,
          })
          .then((response) => ({ plate, data: response.data }))
          .catch((error) => {
            if (axios.isCancel(error)) {
              // Request was cancelled, simply return null.
              return null;
            }
            console.error(`Error fetching ${plate}:`, error);
            return null;
          })
      )
    ).then((results) => {
      // If all requests were cancelled or there are no valid results, do nothing.
      const validResults = results.filter((result) => result !== null) as {
        plate: string;
        data: JsonData;
      }[];

      if (validResults.length === 0) return;

      const newPlateData: Record<string, JsonData> = {};
      const newPlateMapping: Record<string, string> = {};

      validResults.forEach(({ plate, data }) => {
        newPlateData[plate] = data;
        newPlateMapping[data.Position] = plate;
        fetchedPlatesRef.current.add(plate);
      });

      setPlateData((prev) => ({ ...prev, ...newPlateData }));
      setPlateMapping((prev) => ({ ...prev, ...newPlateMapping }));

      // Only update the cache if we're in the base view.
      if (
        loadedPlates.length === defaultPlateNames.length &&
        Object.keys(plateCache.plateMapping).length === 0
      ) {
        setPlateCache({
          plateData: newPlateData,
          plateMapping: newPlateMapping,
        });
      }
    });
  }

  // Cleanup: cancel any in-flight requests if the folder changes.
  return () => {
    source.cancel("Operation canceled due to folder change.");
  };
}, [loadedPlates, selectedFolder, API_BASE_URL, defaultPlateNames, plateCache.plateMapping]);


  // Append new plate names based on an action.
  const appendPlateNames = useCallback(
    (
      currentFiles: string[],
      clickedIndex: number,
      actionNumber: string,
      availableFiles: string[]
    ): string[] => {
      const clickedFile = currentFiles[clickedIndex];
      if (!clickedFile) return currentFiles;

      const prefix = clickedFile.replace(".json", "");
      const baseName = prefix === "root" ? actionNumber : `${prefix}.${actionNumber}`;
      const newFiles: string[] = [];
      const baseFileName = `${baseName}.json`;

      availableFiles.forEach((file) => {
        if (file === baseFileName && !currentFiles.includes(file)) {
          newFiles.push(file);
        }
      });
      const regex = new RegExp(`^${baseName}(?:\\.0)+\\.json$`);
      availableFiles.forEach((file) => {
        if (regex.test(file) && !currentFiles.includes(file)) {
          newFiles.push(file);
        }
      });
      return [...currentFiles, ...newFiles];
    },
    []
  );

  // Handle an action click (drilling into a plate).
  const handleActionClick = useCallback(
    (action: string, fileName: string) => {
      const plateName = loadedPlates.find((name) => name === fileName);
      if (!plateName) return;
      const newValue = actionToPrefixMap[action] || action;
      const clickedIndex = loadedPlates.findIndex((name) => name === plateName);
      if (clickedIndex === -1) return;

      setLoadedPlates(appendPlateNames(loadedPlates, clickedIndex, newValue, availableJsonFiles));
      setClickedRoot(plateName.replace(".json", ""));

      // Push a new history state so that the browser back button is activated.
      window.history.pushState(null, "", window.location.href);
    },
    [loadedPlates, appendPlateNames, availableJsonFiles]
  );

  // Handle folder selection.
  const handleFolderSelect = useCallback(
    (folder: string) => {
      if (folder === selectedFolder) {
        setSelectedFolder("");
        setTimeout(() => {
          setSelectedFolder(folder);
          setClickedRoot("");
          resetPlateState();
        }, 0);
      } else {
        setSelectedFolder(folder);
        setClickedRoot("");
        resetPlateState();
      }
    },
    [selectedFolder, setSelectedFolder, resetPlateState]
  );

  // Keyboard shortcuts.
  useKeyboardShortcuts({
    onBackspace: () => {
      if (clickedRoot) {
        resetViewState();
      }
    },
    onToggleRandom: () => setRandomFillEnabled((prev) => !prev)
  });

  // Listen for browser back button (popstate event) to trigger the back action.
  useEffect(() => {
    const handlePopState = () => {
      if (clickedRoot) {
        resetViewState();
      }
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clickedRoot, resetViewState]);

  const toggleViewMode = useCallback(() => setIsSpiralView((prev) => !prev), []);

  return (
    <Layout>
      <NavBar
        randomFillEnabled={randomFillEnabled}
        toggleRandomization={() => setRandomFillEnabled((prev) => !prev)}
        folders={folders}
        onFolderSelect={handleFolderSelect}
        toggleViewMode={toggleViewMode}
        isSpiralView={isSpiralView}
      />
      <div className="pt-13 p-1 flex-grow">
        {(folderError || filesError) && (
          <div className="text-red-500">{folderError || filesError}</div>
        )}
        <PlateGrid
          files={displayPlates}
          selectedFolder={selectedFolder}
          isSpiralView={isSpiralView}
          randomFillEnabled={randomFillEnabled}
          onActionClick={handleActionClick}
          windowWidth={windowWidth}
          plateData={plateData}
        />
      </div>
      <footer className="text-center select-none">© Josh Garber 2025</footer>
    </Layout>
  );
};

export default Main;
