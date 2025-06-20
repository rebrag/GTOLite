import { useState, useCallback, useLayoutEffect, useEffect, useMemo, useRef } from "react";
import NavBar from "./NavBar";
import PlateGrid from "./PlateGrid";
import Layout from "./Layout";
import { actionToNumberMap, numberToActionMap, getActionNumber} from "../utils/constants"; // actionToPrefixMap2
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useFolders from "../hooks/useFolders";
import useFiles from "../hooks/useFiles";
import axios from "axios";
import { JsonData } from "../utils/utils";
import Line from "./Line";
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import { User } from "firebase/auth";
import LoginSignupModal from "./LoginSignupModal";

const tourSteps = [
  { element: '[data-intro-target="folder-selector"]', intro: 'Choose a pre‑flop sim here.', position: 'bottom' },
  { element: '[data-intro-target="color-key-btn"]', intro: 'Click on an action to see how other players should react.', position: 'bottom'}, 
];

const Solver = ({ user }: { user: User | null }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { windowWidth, windowHeight } = useWindowDimensions();
  const [folder, setFolder] = useState<string>("23UTG_23UTG1_23LJ_23HJ_23CO_23BTN_23SB_23BB");
  const [plateData, setPlateData] = useState<Record<string, JsonData>>({});
  const [plateMapping, setPlateMapping] = useState<Record<string, string>>({});
  const [lastRange, setLastRange] = useState<string>("");
  const [lastRangePos, setLastRangePos] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [preflopLine, setPreflopLine] = useState<string[]>(["Root"]);
  const playerCount = useMemo(() => (folder ? folder.split("_").length : 1), [folder]);
  const [alivePlayers, setAlivePlayers] = useState<Record<string, boolean>>({});
  const [activePlayer, setActivePlayer] = useState<string>("");
  const [metadata, setMetadata] = useState<{ name: string; ante: number; icm: number[] }>({
    name: "",
    ante: 0,
    icm: [],
  });
  const isICMSim = Array.isArray(metadata.icm) && metadata.icm.length > 0;
  const [potSize, setPotSize] = useState<number>(0);
  const [playerBets, setPlayerBets] = useState<Record<string, number>>({});
  const [tourRun, setTourRun] = useState(false);
  const [tourReady, setTourReady] = useState(false);
  const [pendingFolder, setPendingFolder] = useState<string | null>(null);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const tourBooted = useRef(localStorage.getItem('tourSeen') === '1');
  const lastClickRef = useRef<{ plate: string; action: string } | null>(null);


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

  const positionOrder = useMemo(() => {
    if (playerCount === 8) return ["SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO", "BTN"];
    if (playerCount === 7) return ["SB", "BB", "UTG1", "LJ", "HJ", "CO", "BTN"];
    if (playerCount === 6) return ["SB", "BB", "LJ", "HJ", "CO", "BTN"];
    if (playerCount === 5) return ["SB", "BB","HJ", "CO", "BTN"];
    if (playerCount === 4) return ["SB", "BB","CO", "BTN"];
    if (playerCount === 3) return ["SB", "BB","BTN"];
    if (playerCount === 2) return ["BTN", "BB"];
    return Object.keys(plateMapping);
  }, [playerCount, plateMapping]);

  const isNarrow =
    positionOrder.length === 2
      ? !(windowWidth * 1.3 < windowHeight)
      : windowWidth * 1.3 < windowHeight;
  const gridRows = isNarrow ? Math.ceil(positionOrder.length / 2) : 2;
  const gridCols = isNarrow ? 2 : Math.ceil(positionOrder.length / 2);
  
  // Create a grid array (row-major order) using your canonical order.
  const gridArray = Array(gridRows * gridCols).fill(null);
  positionOrder.forEach((pos, i) => {
    gridArray[i] = pos;
  });

  useEffect(() => {
    const initialAlive: Record<string, boolean> = {};
    const positions = playerCount === 8 
      ? ["SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO", "BTN"]
      : playerCount === 7 
        ? ["SB", "BB", "UTG1", "LJ", "HJ", "CO", "BTN"]
      : playerCount === 6 
        ? ["SB", "BB", "LJ", "HJ", "CO", "BTN"]
        : playerCount === 5
          ? ["SB", "BB", "HJ", "CO", "BTN"]
        : playerCount === 4
          ? ["SB", "BB", "CO", "BTN"]
        : playerCount === 3
          ? ["SB", "BB", "BTN"]
        : playerCount === 2 
          ? ["BB", "BTN"]
          : Object.keys(plateMapping);
    positions.forEach((pos) => {
      initialAlive[pos] = true;
    });
    setAlivePlayers(initialAlive);
    
    /* -------- default active = first seat after BB that’s alive -------- */ 
    const bbIdx = positions.indexOf("BB");
    const defaultIdx = (bbIdx + 1) % positions.length;
    setActivePlayer(positions[defaultIdx]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCount]);


  const [loadedPlates, setLoadedPlates] = useState<string[]>(defaultPlateNames);
  const folderRef = useRef(folder);
  useEffect(() => {
    folderRef.current = folder;
  }, [folder]);

  const defaultStateRef = useRef<{
    plateData: Record<string, JsonData>;
    plateMapping: Record<string, string>;
  }>({
    plateData: {},
    plateMapping: {},
  });
  
  useEffect(() => {
    defaultStateRef.current = {
      plateData: { ...plateData },
      plateMapping: { ...plateMapping },
    };
    //console.log(metadata.icm)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const { folders, error: folderError } = useFolders(API_BASE_URL);
  const { files: availableJsonFiles, error: filesError } = useFiles(API_BASE_URL, folder);

  const displayPlates = useMemo(
    () => positionOrder.map((pos) => plateMapping[pos] || ""),
    [plateMapping, positionOrder]
  );

  useEffect(() => {
    const folderNode = document.querySelector('[data-intro-target="folder-selector"]');
    const btnKey     = document.querySelector('[data-intro-target="color-key-btn"]');
    setTourReady(Boolean(folderNode && btnKey));
  }, [displayPlates]);

  useEffect(() => {
    if (tourReady && !tourBooted.current) {
      setTourRun(true);
      tourBooted.current = true;
      localStorage.setItem('tourSeen', '1');   // never auto‑show again
    }
  }, [tourReady]);

  useEffect(() => {
  if (user && pendingFolder) {
    handleFolderSelect(pendingFolder);
    setPendingFolder(null);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, pendingFolder]);

  useLayoutEffect(() => {
    setLoadedPlates(defaultPlateNames);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  // Keep plateMapping consistent with loadedPlates.
  useEffect(() => {
    setPlateMapping((prev) => {
      const filtered: Record<string, string> = {};
      Object.keys(prev).forEach((pos) => {
        if (loadedPlates.includes(prev[pos])) {
          filtered[pos] = prev[pos];
        }
      });
      return filtered;
    });
  }, [loadedPlates]);

  // Fetch plate data for any missing plates.
  useEffect(() => {
    const platesToFetch = loadedPlates.filter((plate) => !(plate in plateData));
    if (platesToFetch.length === 0) {
      setLoading(false);
      return;
    }
    let didTimeout = false;
    const timer = setTimeout(() => {
      didTimeout = true;
      setLoading(true);
    }, 700);
    const source = axios.CancelToken.source();
    Promise.all(
      platesToFetch.map((plate) =>
        axios
          .get(`${API_BASE_URL}/api/Files/${folderRef.current}/${plate}`, { cancelToken: source.token })
          .then((res) => ({ plate, data: res.data }))
          .catch(() => null)
      )
    )
      .then((results) => {
        const validResults = results.filter(
          (r): r is { plate: string; data: JsonData } => r !== null
        );
        if (validResults.length > 0) {
          const newPlateData: Record<string, JsonData> = {};
          const newPlateMapping: Record<string, string> = {};
          validResults.forEach(({ plate, data }) => {
            newPlateData[plate] = data;
            newPlateMapping[data.Position] = plate;
          });
          setPlateData((prev) => ({ ...prev, ...newPlateData }));
          setPlateMapping((prev) => ({ ...prev, ...newPlateMapping }));
        }})
      .finally(() => {
        clearTimeout(timer);
        if (didTimeout) {
          setLoading(false);
        }});
    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedPlates, folder]);

  const handleFolderSelect = useCallback(
  (selectedFolder: string) => {
    if (!user && selectedFolder !== folder) {
      setPendingFolder(selectedFolder);
      setShowLoginOverlay(true);
      return;
    }

    const newLoadedPlates = defaultPlateNames;
    setLoadedPlates(newLoadedPlates);
    setFolder(selectedFolder);
    setPlateData({});
    setPlateMapping({});
    setRandomFillEnabled(false);
    setPreflopLine(["Root"]);

    const initialAlive: Record<string, boolean> = {};
    positionOrder.forEach((pos) => {
      initialAlive[pos] = true;
    });
    setAlivePlayers(initialAlive);
    const bbIdx = positionOrder.indexOf("BB");
    const nextIdx = (bbIdx + 1) % positionOrder.length;
    setActivePlayer(positionOrder[nextIdx]);
  },
  [user, folder, defaultPlateNames, positionOrder]
);


  useEffect(() => {
    if (!folder) return;
    axios
      .get(`${API_BASE_URL}/api/Files/${folder}/metadata.json`)
      .then((res) => {
        setMetadata(res.data);
        const ante = res.data.ante;
        const initialBets: Record<string, number> = {};
        if (playerCount === 2) {
          initialBets["BTN"] = 0.5;
          initialBets["BB"] = 1;
        } else {
          initialBets["SB"] = 0.5;
          initialBets["BB"] = 1;
        }
        setPlayerBets(initialBets);
        const blindPot = Object.values(initialBets).reduce((sum, b) => sum + b);
        const totalPot = blindPot + ante;
        setPotSize(totalPot);
      })
      .catch(() => {
        setMetadata({ name: "", ante: 0, icm: [] });
        setPlayerBets({ SB: 0.5, BB: 1 });
        setPotSize(1.5); // default with no ante
      });
  }, [folder, API_BASE_URL, playerCount]);

  const convertRangeText = (data: JsonData | undefined, action: string): string => {
    if (!data) return "";
    const dataKey = getActionNumber(action) || action;
    if (!data[dataKey]) return "";
    return Object.entries(data[dataKey])
      .map(([hand, values]) => `${hand}:${values[0]}`)
      .join(",");
  };

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
      const newFilesWider: string[] = [];
      const baseFileName = `${baseName}.json`;
      availableFiles.forEach((file) => {
        if (file === baseFileName && !currentFiles.includes(file)) {
          newFiles.push(file);
        }
      });
      const regex = new RegExp(`^${baseName}(?:\\.0)+\\.json$`);
      // console.log(regex);
      availableFiles.forEach((file) => {
        if (regex.test(file) && !currentFiles.includes(file)) {
          newFiles.push(file);
        }
      });
      availableFiles.forEach((file) => {
        if (file === baseFileName) {
          newFilesWider.push(file);
        }
      });
      availableFiles.forEach((file) => {
        if (regex.test(file)) {
          newFilesWider.push(file);
        }
      });
      //doing things with the new files from the regex after the clicked file
      newFilesWider.forEach((file) => {
        setPlateMapping((prev) => ({ ...prev, [plateData[file]?.Position]: file }));
      });
      // console.log("newFiles:", newFiles, "newFilesWider:", newFilesWider, "plateMapping", plateMapping, 'plateData:',plateData); //, "plateMapping", plateMapping
      return [...currentFiles, ...newFiles];
    },
    [plateData]
  );

  

  const handleActionClick = useCallback(
    (action: string, fileName: string) => {
      const plateName = loadedPlates.find(name => name === fileName);
      if (!plateName) return;
      if (
      lastClickRef.current &&
      lastClickRef.current.plate === fileName &&
      lastClickRef.current.action === action
    ) {
      return;                                                    // 🔙 do nothing
    }
  
      const actionNumber = getActionNumber(action) ?? "";
      const clickedIndex = loadedPlates.findIndex(name => name === plateName);
      const newLoadedPlates = appendPlateNames(loadedPlates, clickedIndex, actionNumber, availableJsonFiles);
      setLoadedPlates(prev => [...new Set([...prev, ...newLoadedPlates])]);
  
      const parts = fileName.replace(".json", "").split(".");
      const aliveList = [...positionOrder];
      let activeIndex = playerCount === 2 ? 0 : 2;
  
      for (const part of parts) {
        if (part === "root") continue;
        const n = parseInt(part, 10);
        if (n === 0) {
          aliveList.splice(activeIndex, 1);
          if (aliveList.length > 0 && activeIndex >= aliveList.length) {
            activeIndex = 0;
          }
        } else {
          activeIndex = (activeIndex + 1) % aliveList.length;
        }
        
      }
  
      const newAliveMap = Object.fromEntries(positionOrder.map(pos => [pos, aliveList.includes(pos)]));
      setAlivePlayers(newAliveMap);
      setActivePlayer(aliveList[(activeIndex+1)%aliveList.length]);
  
      const actingPosition = plateData[fileName]?.Position;
      const currentBet = playerBets[actingPosition] || 0;
      const stackSize = plateData[fileName]?.bb || 0;

      if (action === "Fold") {
        setAlivePlayers(prev => ({ ...prev, [actingPosition]: false }));
        // you may also want to zero that player’s bet:
        // setPlayerBets(prev => ({ ...prev, [actingPosition]: 0 }));
        //return;                                          // nothing else to do
      }
  
      let newBetAmount = currentBet;
      if (action === "Min") newBetAmount = 2;
      else if (action === "ALLIN") newBetAmount = stackSize;
      else if (action.startsWith("Raise ")) {
        const val = action.split(" ")[1];
        const maxBet = Math.max(...Object.values(playerBets));
        newBetAmount = val.endsWith("bb")
          ? maxBet + parseFloat(val)
          : maxBet + (parseFloat(val) / 100) * (potSize + maxBet);
      } else if (action === "Call") {
        newBetAmount = Math.max(...Object.values(playerBets));
      }
  
      const newPotSize = potSize + Math.max(0, newBetAmount - currentBet);
      setPotSize(newPotSize);
      setPlayerBets(prev => ({ ...prev, [actingPosition]: newBetAmount }));
  
      let fullText = "";
      if (action === "Call") {
        const callData = plateData[fileName];
        const callingPos = callData?.Position;
        const [range0, range1] = (positionOrder.indexOf(callingPos ?? "") < positionOrder.indexOf(lastRangePos))
          ? [convertRangeText(callData, action), lastRange]
          : [lastRange, convertRangeText(callData, action)];
  
          const stackMap = Object.fromEntries(
            positionOrder.map((pos) => {
              const plate = plateMapping[pos];
              const bb = plateData[plate]?.bb ?? 0;
              const bet =
                pos === actingPosition ? newBetAmount : playerBets[pos] ?? 0;
              return [pos, Math.round((bb - bet) * 100)];
            })
          );
          
          let firstPos = lastRangePos;   // raiser / Min
          let secondPos = actingPosition; // caller
          // Fallback in weird edge-cases (e.g., first click is Call)
          if (!firstPos) firstPos = secondPos;
          
          /* put them in table order */
          if (
            firstPos &&
            secondPos &&
            positionOrder.indexOf(firstPos) < positionOrder.indexOf(secondPos)
          ) {
            [firstPos, secondPos] = [secondPos, firstPos];
          }
          
          /* -------- build #ICM.Stacks# -------- */
          const stackEntries = new Set([firstPos, secondPos]);
          
          const otherStacks = positionOrder
            .filter((pos) => !stackEntries.has(pos))
            .map((pos) => stackMap[pos] ?? 0);
          
          const stacksStr = [
            stackMap[firstPos],
            stackMap[secondPos],
            ...otherStacks,
          ].join("\\n");
          //console.log(stackMap, stacksStr)

      const payoutsStr = Array.isArray(metadata.icm)
      ? metadata.icm.map(v => Math.round(v * 10)).join("\\n")
      : "0\\n0\\n0\\n0";
  
        fullText = `#Type#NoLimit
        #Range0#${range0}
        #Range1#${range1}
        #ICM.ICMFormat#Pio ICM structure
        #ICM.Payouts#${payoutsStr}
        #ICM.Stacks#${stacksStr}
        #Pot#${(newPotSize * 100).toFixed(0)}
        #EffectiveStacks#1800
        #AllinThreshold#60
        #AddAllinOnlyIfLessThanThisTimesThePot#250
        #MergeSimilarBets#True
        #MergeSimilarBetsThreshold#12
        #CapEnabled#True
        #CapPerStreet#3\\n3\\n3
        #CapMode#NoLimit
        #FlopConfig.RaiseSize#33
        #FlopConfig.AddAllin#True
        #TurnConfig.BetSize#50
        #TurnConfig.RaiseSize#a
        #TurnConfig.AddAllin#True
        #RiverConfig.BetSize#30 66
        #RiverConfig.RaiseSize#a
        #RiverConfig.AddAllin#True
        #RiverConfig.DonkBetSize#30
        #FlopConfigIP.BetSize#25
        #FlopConfigIP.RaiseSize#a
        #FlopConfigIP.AddAllin#True
        #TurnConfigIP.BetSize#50
        #TurnConfigIP.RaiseSize#a
        #TurnConfigIP.AddAllin#True
        #RiverConfigIP.BetSize#30 66
        #RiverConfigIP.RaiseSize#a
        #RiverConfigIP.AddAllin#True`;

        if (isICMSim) {
          fullText = fullText.replace(
            '#ICM.ICMFormat#Pio ICM structure',
            '#ICM.ICMFormat#Pio ICM structure\n#ICM.Enabled#True'
          );
        }
  
        const effStack = Math.min(
          ...positionOrder
            .filter(pos => newAliveMap[pos])
            .map(pos => {
              const stack = plateData[plateMapping[pos]]?.bb ?? 0;
              const bet = pos === actingPosition ? newBetAmount : playerBets[pos] ?? 0;
              return stack - bet;
            })
        );
        const adjustedText = fullText
          .replace(/#Pot#\d+/, `#Pot#${(newPotSize * 100).toFixed(0)}`)
          .replace(/#EffectiveStacks#\d+/, `#EffectiveStacks#${Math.round(effStack * 100)}`);
        navigator.clipboard.writeText(adjustedText);
      } else if (action !== "ALLIN") {
        const data = plateData[fileName];
        const currentRange = convertRangeText(data, action);
        if (currentRange) {
          setLastRange(currentRange);
          setLastRangePos(data.Position);
        }
      }
      setPreflopLine(["Root", ...parts.filter(p => p !== "root").map(p => numberToActionMap[p]), action]);
      if (newLoadedPlates.length !== loadedPlates.length || !newLoadedPlates.every((v, i) => v === loadedPlates[i])) {
        setLoadedPlates(newLoadedPlates);
      }
      setRandomFillEnabled(false);
      setPlateMapping(prev => ({ ...prev }));
      lastClickRef.current = { plate: fileName, action };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadedPlates, appendPlateNames, availableJsonFiles, playerCount, playerBets, plateData, potSize, positionOrder, lastRangePos, lastRange, metadata, plateMapping]
  );
  

  const handleLineClick = useCallback((clickedIndex: number) => {
    const trimmedLine = preflopLine.slice(0, clickedIndex + 1);
    setPreflopLine(trimmedLine);
    const initialAlive: Record<string, boolean> = {};
    const positions = playerCount === 8
      ? ["SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO", "BTN"]
      : playerCount === 7
        ? ["SB", "BB","UTG1", "LJ", "HJ", "CO", "BTN"]
      : playerCount === 6
        ? ["SB", "BB", "LJ", "HJ", "CO", "BTN"]
        : playerCount === 5
          ? ["SB", "BB", "HJ", "CO", "BTN"]
        : playerCount === 4
          ? ["SB", "BB","CO", "BTN"]
        : playerCount === 3
          ? ["SB", "BB", "BTN"]
        : playerCount === 2
          ? ["BB", "BTN"]
          : Object.keys(plateMapping);
    positions.forEach((pos) => {
      initialAlive[pos] = true;
    });
  
    if (clickedIndex === 0 || clickedIndex === 1 || trimmedLine[clickedIndex] === "Fold") {
      setAlivePlayers(initialAlive);
      lastClickRef.current = null;               // <<--- THIS LINE
      const bbIdx = positions.indexOf("BB");
      const defaultIdx = (bbIdx + 1) % positions.length; //here and line below added
      setActivePlayer(positions[defaultIdx]);
      const resetBets: Record<string, number> = {};
      if (playerCount === 2) {
        resetBets["BTN"] = 0.5;
        resetBets["BB"] = 1;
      } else {
        resetBets["SB"] = 0.5;
        resetBets["BB"] = 1;
      }

      // Add ante once (not per player)
      const ante = metadata.ante;
      const pot = Object.values(resetBets).reduce((sum, b) => sum + b, 0) + ante;

      setPlayerBets(resetBets);
      setPotSize(pot);
      if (playerCount === 8) {
        setPlateMapping({
          "UTG": "root.json", 
          "UTG1": "0.json", 
          "LJ": "0.0.json", 
          "HJ": "0.0.0.json",
          "CO": "0.0.0.0.json", 
          "BTN": "0.0.0.0.0.json", 
          "SB": "0.0.0.0.0.0.json", 
          "BB": "0.0.0.0.0.0.1.json"
        });
      } else if (playerCount === 7) {
        setPlateMapping({
          "UTG1": "root.json", 
          "LJ": "0.json", 
          "HJ": "0.0.json", 
          "CO": "0.0.0.json", 
          "BTN": "0.0.0.0.json",
          "SB": "0.0.0.0.0.json", 
          "BB": "0.0.0.0.0.1.json"
        });
      } else if (playerCount === 6) {
        setPlateMapping({
          "LJ": "root.json", 
          "HJ": "0.json", 
          "CO": "0.0.json", 
          "BTN": "0.0.0.json",
          "SB": "0.0.0.0.json",
          "BB": "0.0.0.0.1.json"
        });
      }else if (playerCount === 5) {
        setPlateMapping({
          "HJ": "root.json", 
          "CO": "0.json", 
          "BTN": "0.0.json", 
          "SB": "0.0.0.json",
          "BB": "0.0.0.1.json", 
        });
      }else if (playerCount === 4) {
        setPlateMapping({
          "CO": "root.json", 
          "BTN": "0.json", 
          "SB": "0.0.json",
          "BB": "0.0.1.json", 
        });
      }else if (playerCount === 3) {
        setPlateMapping({
          "BTN": "root.json", 
          "SB": "0.json",
          "BB": "0.1.json", 
        });
      } else if (playerCount === 2) {
        setPlateMapping({
          "BTN": "root.json", 
          "BB": "1.json"
        });
      }
    } else {
      const fileNamePart = trimmedLine.slice(1, clickedIndex)
        .map((action) => actionToNumberMap[action])
        .join('.');
      const computedFileName = fileNamePart + '.json';
  
      handleActionClick(trimmedLine[clickedIndex], computedFileName);
      
      setPlateMapping((prev) => ({
        ...prev,
        [plateData[computedFileName].Position]: computedFileName,
      }));
    }
  
    setRandomFillEnabled(false);
  }, [preflopLine, playerCount, plateMapping, metadata.ante, handleActionClick, plateData]);
  
  
  useKeyboardShortcuts({
    onToggleRandom: () => setRandomFillEnabled((prev) => !prev),
  });
  
  // useEffect(() => {
  //   console.log("players: ", playerCount,
  //     "Plate States Updated:", { loadedPlates, plateMapping, plateData });
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loadedPlates, plateMapping, plateData]);
  
  const [randomFillEnabled, setRandomFillEnabled] = useState(false);
  const [isSpiralView, setIsSpiralView] = useState(true);
  
  return (
    <>
    <Steps enabled={tourRun}
             steps={tourSteps}
             initialStep={0}
             onExit={() => setTourRun(false)} />

    <Layout>
      <NavBar
        randomFillEnabled={randomFillEnabled}
        toggleRandomization={() => setRandomFillEnabled(prev => !prev)}
        folders={folders}
        currentFolder={folder}
        onFolderSelect={handleFolderSelect}
        toggleViewMode={() => setIsSpiralView(prev => !prev)}
        isSpiralView={isSpiralView}
      />
      <div className="pt-13 p-1 flex-grow">
        {(folderError || filesError) && (
          <div className="text-red-500">{folderError || filesError}</div>
        )}
       {/* {displayPlates.some((p) => p !== "") && ( */}
        <div className="flex items-center">
          <Line line={preflopLine} onLineClick={(i) => handleLineClick(i)} />

          {/* info button */}
          <button
            // onClick={() => setShowInstructions(true)}
            onClick={() => setTourRun(true)}
            className="absolute right-0 mr-2 flex items-center justify-center w-4 h-4 rounded-full bg-blue-800 text-white text-sm font-bold shadow"
            title="Show instructions"
          >
            i
          </button>
        </div>
      {/* )} */}

      {/* render the draggable instructions only when needed */}
      {/* {showInstructions && (
         <div className="fixed inset-0 z-50">
        <InstructionBox onClose={() => setShowInstructions(false)}>
          <h2 className="text-lg font-bold mb-2">Instructions</h2>
          <p className="text-sm lg:text-md">
            Use the navigation bar above to choose a pre-flop sim.<br />
            Click on an action (other than fold) to view the reactions to that action.<br />
            Use the&nbsp;<strong>Line</strong>&nbsp;buttons to reset the tree or jump back to any action.
          </p>
        </InstructionBox>
        </div>
      )} */}
  
      <PlateGrid
        files={displayPlates}
        positions={positionOrder}
        selectedFolder={folder}
        isSpiralView={isSpiralView}
        randomFillEnabled={randomFillEnabled}
        onActionClick={handleActionClick}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        plateData={plateData}
        loading={loading}
        alivePlayers={alivePlayers}
        playerBets={playerBets} // ✅ Pass this down
        isICMSim={isICMSim}
        ante={metadata.ante}
        pot={potSize}
        activePlayer={activePlayer} 
      />

        {metadata && (
  /* outer flex just centers the badge */
  <div className="flex justify-center mt-1 mb-2 pointer-events-none select-none">
    <div className="bg-white/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs shadow text-center text-gray-800">

      {/* ----- Sim name (if any) ----- */}
      {metadata.name && (
        <>
          <strong>Sim:</strong>&nbsp;{metadata.name}
          {/* add a break only if we’ll show ICM below */}
          {Array.isArray(metadata.icm) && metadata.icm.length > 0 && <br />}
        </>
      )}

      {/* ----- ICM structure ----- */}
      {Array.isArray(metadata.icm) && metadata.icm.length > 0 ? (
            <>
              <strong>ICM&nbsp;Structure:</strong>
              <br />
              {metadata.icm.map((value, idx) => {
                const rank   = idx + 1;
                const suffix =
                  rank === 1 ? "st" :
                  rank === 2 ? "nd" :
                  rank === 3 ? "rd" : "th";

                return (
                  <div key={idx}>
                    {rank}
                    <sup>{suffix}</sup>: ${value.toLocaleString()}
                  </div>
                );
              })}
            </>
          ) : (
            /* only show “None” if there wasn’t a Sim name above */
            !metadata.name && (
              <>
                <strong>ICM:</strong>&nbsp;None
              </>
            )
          )}
        </div>
      </div>
    )}

      </div>
      <div className="text-center select-none pt-5">© HoldemTools 2025</div>
    </Layout>

    {showLoginOverlay && (
    <LoginSignupModal onClose={() => {
        setShowLoginOverlay(false);
        setPendingFolder(null);
      }} />
    )}


    </>
  );  
};

export default Solver;