// import { useState } from 'react'
import './App.css'

const rawData: Record<string, Record<string, [number, number]>> = {"0": {"AA": [0.0, -0.01], "A2s": [0.0, -0.01], "A2o": [1.0, -0.01], "A3s": [0.0, -0.01], "A3o": [1.0, -0.01], "A4s": [0.0, -0.01], "A4o": [1.0, -0.01], "A5s": [0.0, -0.01], "A5o": [0.836, -0.01], "A6s": [0.0, -0.01], "A6o": [1.0, -0.01], "A7s": [0.0, -0.01], "A7o": [0.0, -0.01], "A8s": [0.0, -0.01], "A8o": [0.0, -0.01], "A9s": [0.0, -0.01], "A9o": [0.0, -0.01], "ATs": [0.0, -0.01], "ATo": [0.0, -0.01], "AJs": [0.0, -0.01], "AJo": [0.0, -0.01], "AQs": [0.0, -0.01], "AQo": [0.0, -0.01], "AKs": [0.0, -0.01], "AKo": [0.0, -0.01], "22": [1.0, -0.01], "32s": [1.0, -0.01], "32o": [1.0, -0.01], "42s": [1.0, -0.01], "42o": [1.0, -0.01], "52s": [1.0, -0.01], "52o": [1.0, -0.01], "62s": [1.0, -0.01], "62o": [1.0, -0.01], "72s": [1.0, -0.01], "72o": [1.0, -0.01], "82s": [1.0, -0.01], "82o": [1.0, -0.01], "92s": [1.0, -0.01], "92o": [1.0, -0.01], "T2s": [1.0, -0.01], "T2o": [1.0, -0.01], "J2s": [1.0, -0.01], "J2o": [1.0, -0.01], "Q2s": [1.0, -0.01], "Q2o": [1.0, -0.01], "K2s": [1.0, -0.01], "K2o": [1.0, -0.01], "33": [1.0, -0.01], "43s": [1.0, -0.01], "43o": [1.0, -0.01], "53s": [1.0, -0.01], "53o": [1.0, -0.01], "63s": [1.0, -0.01], "63o": [1.0, -0.01], "73s": [1.0, -0.01], "73o": [1.0, -0.01], "83s": [1.0, -0.01], "83o": [1.0, -0.01], "93s": [1.0, -0.01], "93o": [1.0, -0.01], "T3s": [1.0, -0.01], "T3o": [1.0, -0.01], "J3s": [1.0, -0.01], "J3o": [1.0, -0.01], "Q3s": [1.0, -0.01], "Q3o": [1.0, -0.01], "K3s": [1.0, -0.01], "K3o": [1.0, -0.01], "44": [0.0, -0.01], "54s": [1.0, -0.01], "54o": [1.0, -0.01], "64s": [1.0, -0.01], "64o": [1.0, -0.01], "74s": [1.0, -0.01], "74o": [1.0, -0.01], "84s": [1.0, -0.01], "84o": [1.0, -0.01], "94s": [1.0, -0.01], "94o": [1.0, -0.01], "T4s": [1.0, -0.01], "T4o": [1.0, -0.01], "J4s": [1.0, -0.01], "J4o": [1.0, -0.01], "Q4s": [1.0, -0.01], "Q4o": [1.0, -0.01], "K4s": [1.0, -0.01], "K4o": [1.0, -0.01], "55": [0.0, -0.01], "65s": [1.0, -0.01], "65o": [1.0, -0.01], "75s": [1.0, -0.01], "75o": [1.0, -0.01], "85s": [1.0, -0.01], "85o": [1.0, -0.01], "95s": [1.0, -0.01], "95o": [1.0, -0.01], "T5s": [1.0, -0.01], "T5o": [1.0, -0.01], "J5s": [1.0, -0.01], "J5o": [1.0, -0.01], "Q5s": [1.0, -0.01], "Q5o": [1.0, -0.01], "K5s": [1.0, -0.01], "K5o": [1.0, -0.01], "66": [0.0, -0.01], "76s": [1.0, -0.01], "76o": [1.0, -0.01], "86s": [1.0, -0.01], "86o": [1.0, -0.01], "96s": [1.0, -0.01], "96o": [1.0, -0.01], "T6s": [1.0, -0.01], "T6o": [1.0, -0.01], "J6s": [1.0, -0.01], "J6o": [1.0, -0.01], "Q6s": [1.0, -0.01], "Q6o": [1.0, -0.01], "K6s": [0.0, -0.01], "K6o": [1.0, -0.01], "77": [0.0, -0.01], "87s": [0.307, -0.01], "87o": [1.0, -0.01], "97s": [1.0, -0.01], "97o": [1.0, -0.01], "T7s": [1.0, -0.01], "T7o": [1.0, -0.01], "J7s": [1.0, -0.01], "J7o": [1.0, -0.01], "Q7s": [1.0, -0.01], "Q7o": [1.0, -0.01], "K7s": [0.0, -0.01], "K7o": [1.0, -0.01], "88": [0.0, -0.01], "98s": [0.0, -0.01], "98o": [1.0, -0.01], "T8s": [0.0, -0.01], "T8o": [1.0, -0.01], "J8s": [0.0, -0.01], "J8o": [1.0, -0.01], "Q8s": [0.0, -0.01], "Q8o": [1.0, -0.01], "K8s": [0.0, -0.01], "K8o": [1.0, -0.01], "99": [0.0, -0.01], "T9s": [0.0, -0.01], "T9o": [1.0, -0.01], "J9s": [0.0, -0.01], "J9o": [1.0, -0.01], "Q9s": [0.0, -0.01], "Q9o": [1.0, -0.01], "K9s": [0.0, -0.01], "K9o": [1.0, -0.01], "TT": [0.0, -0.01], "JTs": [0.0, -0.01], "JTo": [0.0, -0.01], "QTs": [0.0, -0.01], "QTo": [0.0, -0.01], "KTs": [0.0, -0.01], "KTo": [0.0, -0.01], "JJ": [0.0, -0.01], "QJs": [0.0, -0.01], "QJo": [0.0, -0.01], "KJs": [0.0, -0.01], "KJo": [0.0, -0.01], "QQ": [0.0, -0.01], "KQs": [0.0, -0.01], "KQo": [0.0, -0.01], "KK": [0.0, -0.01]},"3": {"AA": [0.0, 0.19], "A2s": [0.0, -0.02], "A2o": [0.0, -0.03], "A3s": [0.0, -0.01], "A3o": [0.0, -0.03], "A4s": [0.0, -0.01], "A4o": [0.0, -0.03], "A5s": [0.0, -0.01], "A5o": [0.0, -0.03], "A6s": [0.0, -0.01], "A6o": [0.0, -0.03], "A7s": [0.0, -0.01], "A7o": [0.0, -0.03], "A8s": [0.0, -0.0], "A8o": [0.0, -0.02], "A9s": [0.0, 0.0], "A9o": [0.0, -0.01], "ATs": [0.0, 0.01], "ATo": [0.0, -0.0], "AJs": [0.0, 0.03], "AJo": [0.0, 0.01], "AQs": [0.0, 0.05], "AQo": [0.0, 0.04], "AKs": [0.0, 0.08], "AKo": [0.0, 0.07], "22": [0.0, -0.02], "32s": [0.0, -0.06], "32o": [0.0, -0.08], "42s": [0.0, -0.06], "42o": [0.0, -0.08], "52s": [0.0, -0.05], "52o": [0.0, -0.07], "62s": [0.0, -0.06], "62o": [0.0, -0.08], "72s": [0.0, -0.06], "72o": [0.0, -0.08], "82s": [0.0, -0.06], "82o": [0.0, -0.08], "92s": [0.0, -0.05], "92o": [0.0, -0.07], "T2s": [0.0, -0.05], "T2o": [0.0, -0.07], "J2s": [0.0, -0.04], "J2o": [0.0, -0.06], "Q2s": [0.0, -0.04], "Q2o": [0.0, -0.06], "K2s": [0.0, -0.03], "K2o": [0.0, -0.05], "33": [0.0, -0.02], "43s": [0.0, -0.05], "43o": [0.0, -0.07], "53s": [0.0, -0.05], "53o": [0.0, -0.07], "63s": [0.0, -0.05], "63o": [0.0, -0.07], "73s": [0.0, -0.05], "73o": [0.0, -0.07], "83s": [0.0, -0.06], "83o": [0.0, -0.08], "93s": [0.0, -0.05], "93o": [0.0, -0.07], "T3s": [0.0, -0.05], "T3o": [0.0, -0.07], "J3s": [0.0, -0.04], "J3o": [0.0, -0.06], "Q3s": [0.0, -0.04], "Q3o": [0.0, -0.06], "K3s": [0.0, -0.03], "K3o": [0.0, -0.05], "44": [0.0, -0.01], "54s": [0.0, -0.04], "54o": [0.0, -0.06], "64s": [0.0, -0.05], "64o": [0.0, -0.06], "74s": [0.0, -0.05], "74o": [0.0, -0.07], "84s": [0.0, -0.05], "84o": [0.0, -0.07], "94s": [0.0, -0.05], "94o": [0.0, -0.07], "T4s": [0.0, -0.04], "T4o": [0.0, -0.06], "J4s": [0.0, -0.04], "J4o": [0.0, -0.06], "Q4s": [0.0, -0.04], "Q4o": [0.0, -0.05], "K4s": [0.0, -0.03], "K4o": [0.0, -0.05], "55": [0.0, -0.01], "65s": [0.0, -0.04], "65o": [0.0, -0.06], "75s": [0.0, -0.04], "75o": [0.0, -0.06], "85s": [0.0, -0.04], "85o": [0.0, -0.06], "95s": [0.0, -0.04], "95o": [0.0, -0.06], "T5s": [0.0, -0.04], "T5o": [0.0, -0.06], "J5s": [0.0, -0.04], "J5o": [0.0, -0.06], "Q5s": [0.0, -0.03], "Q5o": [0.0, -0.05], "K5s": [0.0, -0.02], "K5o": [0.0, -0.04], "66": [0.0, -0.0], "76s": [0.0, -0.03], "76o": [0.0, -0.05], "86s": [0.0, -0.04], "86o": [0.0, -0.05], "96s": [0.0, -0.04], "96o": [0.0, -0.06], "T6s": [0.0, -0.04], "T6o": [0.0, -0.06], "J6s": [0.0, -0.04], "J6o": [0.0, -0.06], "Q6s": [0.0, -0.03], "Q6o": [0.0, -0.05], "K6s": [0.0, -0.02], "K6o": [0.0, -0.04], "77": [0.0, 0.01], "87s": [0.0, -0.03], "87o": [0.0, -0.05], "97s": [0.0, -0.03], "97o": [0.0, -0.05], "T7s": [0.0, -0.03], "T7o": [0.0, -0.05], "J7s": [0.0, -0.03], "J7o": [0.0, -0.05], "Q7s": [0.0, -0.03], "Q7o": [0.0, -0.05], "K7s": [0.0, -0.02], "K7o": [0.0, -0.04], "88": [0.0, 0.03], "98s": [0.0, -0.02], "98o": [0.0, -0.04], "T8s": [0.0, -0.02], "T8o": [0.0, -0.04], "J8s": [0.0, -0.02], "J8o": [0.0, -0.04], "Q8s": [0.0, -0.02], "Q8o": [0.0, -0.04], "K8s": [0.0, -0.02], "K8o": [0.0, -0.04], "99": [0.0, 0.04], "T9s": [0.0, -0.01], "T9o": [0.0, -0.03], "J9s": [0.0, -0.02], "J9o": [0.0, -0.03], "Q9s": [0.0, -0.01], "Q9o": [0.0, -0.03], "K9s": [0.0, -0.01], "K9o": [0.0, -0.03], "TT": [0.0, 0.07], "JTs": [0.0, -0.0], "JTo": [0.0, -0.02], "QTs": [0.0, -0.0], "QTo": [0.0, -0.02], "KTs": [0.0, 0.0], "KTo": [0.0, -0.01], "JJ": [0.0, 0.09], "QJs": [0.0, -0.0], "QJo": [0.0, -0.02], "KJs": [0.0, 0.01], "KJo": [0.0, -0.01], "QQ": [0.0, 0.12], "KQs": [0.0, 0.01], "KQo": [0.0, -0.0], "KK": [0.0, 0.15]},"5": {"AA": [1.0, 0.27], "A2s": [1.0, -0.01], "A2o": [0.0, -0.01], "A3s": [1.0, -0.0], "A3o": [0.0, -0.01], "A4s": [1.0, -0.0], "A4o": [0.0, -0.01], "A5s": [1.0, 0.0], "A5o": [0.164, -0.01], "A6s": [1.0, -0.0], "A6o": [0.0, -0.01], "A7s": [1.0, 0.0], "A7o": [1.0, -0.01], "A8s": [1.0, 0.01], "A8o": [1.0, -0.0], "A9s": [1.0, 0.01], "A9o": [1.0, -0.0], "ATs": [1.0, 0.02], "ATo": [1.0, 0.01], "AJs": [1.0, 0.04], "AJo": [1.0, 0.02], "AQs": [1.0, 0.06], "AQo": [1.0, 0.04], "AKs": [1.0, 0.09], "AKo": [1.0, 0.08], "22": [0.0, -0.02], "32s": [0.0, -0.02], "32o": [0.0, -0.03], "42s": [0.0, -0.02], "42o": [0.0, -0.03], "52s": [0.0, -0.02], "52o": [0.0, -0.02], "62s": [0.0, -0.02], "62o": [0.0, -0.03], "72s": [0.0, -0.02], "72o": [0.0, -0.03], "82s": [0.0, -0.02], "82o": [0.0, -0.03], "92s": [0.0, -0.02], "92o": [0.0, -0.02], "T2s": [0.0, -0.02], "T2o": [0.0, -0.02], "J2s": [0.0, -0.02], "J2o": [0.0, -0.02], "Q2s": [0.0, -0.02], "Q2o": [0.0, -0.02], "K2s": [0.0, -0.01], "K2o": [0.0, -0.02], "33": [0.0, -0.01], "43s": [0.0, -0.02], "43o": [0.0, -0.02], "53s": [0.0, -0.02], "53o": [0.0, -0.02], "63s": [0.0, -0.02], "63o": [0.0, -0.02], "73s": [0.0, -0.02], "73o": [0.0, -0.02], "83s": [0.0, -0.02], "83o": [0.0, -0.02], "93s": [0.0, -0.02], "93o": [0.0, -0.02], "T3s": [0.0, -0.02], "T3o": [0.0, -0.02], "J3s": [0.0, -0.02], "J3o": [0.0, -0.02], "Q3s": [0.0, -0.01], "Q3o": [0.0, -0.02], "K3s": [0.0, -0.01], "K3o": [0.0, -0.02], "44": [1.0, -0.01], "54s": [0.0, -0.01], "54o": [0.0, -0.02], "64s": [0.0, -0.01], "64o": [0.0, -0.02], "74s": [0.0, -0.02], "74o": [0.0, -0.02], "84s": [0.0, -0.02], "84o": [0.0, -0.02], "94s": [0.0, -0.02], "94o": [0.0, -0.02], "T4s": [0.0, -0.02], "T4o": [0.0, -0.02], "J4s": [0.0, -0.02], "J4o": [0.0, -0.02], "Q4s": [0.0, -0.01], "Q4o": [0.0, -0.02], "K4s": [0.0, -0.01], "K4o": [0.0, -0.02], "55": [1.0, 0.0], "65s": [0.0, -0.01], "65o": [0.0, -0.02], "75s": [0.0, -0.01], "75o": [0.0, -0.02], "85s": [0.0, -0.01], "85o": [0.0, -0.02], "95s": [0.0, -0.01], "95o": [0.0, -0.02], "T5s": [0.0, -0.01], "T5o": [0.0, -0.02], "J5s": [0.0, -0.01], "J5o": [0.0, -0.02], "Q5s": [0.0, -0.01], "Q5o": [0.0, -0.02], "K5s": [0.0, -0.01], "K5o": [0.0, -0.02], "66": [1.0, 0.01], "76s": [0.0, -0.01], "76o": [0.0, -0.01], "86s": [0.0, -0.01], "86o": [0.0, -0.02], "96s": [0.0, -0.01], "96o": [0.0, -0.02], "T6s": [0.0, -0.01], "T6o": [0.0, -0.02], "J6s": [0.0, -0.01], "J6o": [0.0, -0.02], "Q6s": [0.0, -0.01], "Q6o": [0.0, -0.02], "K6s": [1.0, -0.01], "K6o": [0.0, -0.01], "77": [1.0, 0.02], "87s": [0.693, -0.01], "87o": [0.0, -0.01], "97s": [0.0, -0.01], "97o": [0.0, -0.01], "T7s": [0.0, -0.01], "T7o": [0.0, -0.01], "J7s": [0.0, -0.01], "J7o": [0.0, -0.02], "Q7s": [0.0, -0.01], "Q7o": [0.0, -0.02], "K7s": [1.0, -0.01], "K7o": [0.0, -0.01], "88": [1.0, 0.04], "98s": [1.0, -0.01], "98o": [0.0, -0.01], "T8s": [1.0, -0.01], "T8o": [0.0, -0.01], "J8s": [1.0, -0.01], "J8o": [0.0, -0.01], "Q8s": [1.0, -0.01], "Q8o": [0.0, -0.01], "K8s": [1.0, -0.01], "K8o": [0.0, -0.01], "99": [1.0, 0.06], "T9s": [1.0, -0.0], "T9o": [0.0, -0.01], "J9s": [1.0, -0.0], "J9o": [0.0, -0.01], "Q9s": [1.0, -0.0], "Q9o": [0.0, -0.01], "K9s": [1.0, -0.0], "K9o": [0.0, -0.01], "TT": [1.0, 0.1], "JTs": [1.0, 0.0], "JTo": [1.0, -0.01], "QTs": [1.0, 0.0], "QTo": [1.0, -0.01], "KTs": [1.0, 0.0], "KTo": [1.0, -0.01], "JJ": [1.0, 0.13], "QJs": [1.0, 0.0], "QJo": [1.0, -0.01], "KJs": [1.0, 0.01], "KJo": [1.0, -0.0], "QQ": [1.0, 0.17], "KQs": [1.0, 0.02], "KQo": [1.0, 0.0], "KK": [1.0, 0.21]}};

interface HandCellData {
  hand: string;
  group0: number;
  group3: number;
  group5: number;
}


function App() {
  // Helper function to combine the data by hand.
  const combineDataByHand = (
    data: Record<string, Record<string, [number, number]>>
  ): HandCellData[] => {
    const combined: { [hand: string]: Partial<HandCellData> } = {};
    // Iterate over each group ("0", "3", "5")
    for (const group in data) {
      const groupData = data[group];
      for (const hand in groupData) {
        const [strategy] = groupData[hand];
        if (!combined[hand]) {
          combined[hand] = { hand };
        }
        if (group === "0") {
          combined[hand].group0 = strategy;
        } else if (group === "3") {
          combined[hand].group3 = strategy;
        } else if (group === "5") {
          combined[hand].group5 = strategy;
        }
      }
    }
    // Ensure each hand has a value for each group (default to 0 if missing)
    return Object.values(combined).map((item) => ({
      hand: item.hand!,
      group0: item.group0 ?? 0,
      group3: item.group3 ?? 0,
      group5: item.group5 ?? 0,
    }));
  };

  const combinedData = combineDataByHand(rawData);

  // Mapping group keys to colors
  const groupColorMapping: Record<string, string> = {
    "0": "lightblue",
    "3": "red",
    "5": "lightcoral" // using lightcoral for "light-red"
  };

  // Mapping the hands in a 13x13 grid order (the standard poker hand grid)
  const handOrder = [
    "AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
    "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
    "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s",
    "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s",
    "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s",
    "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s", "84s", "83s", "82s",
    "A7o", "K7o", "Q7o", "J7o", "T7o", "97o", "87o", "77", "76s", "75s", "74s", "73s", "72s",
    "A6o", "K6o", "Q6o", "J6o", "T6o", "96o", "86o", "76o", "66", "65s", "64s", "63s", "62s",
    "A5o", "K5o", "Q5o", "J5o", "T5o", "95o", "85o", "75o", "65o", "55", "54s", "53s", "52s",
    "A4o", "K4o", "Q4o", "J4o", "T4o", "94o", "84o", "74o", "64o", "54o", "44", "43s", "42s",
    "A3o", "K3o", "Q3o", "J3o", "T3o", "93o", "83o", "73o", "63o", "53o", "43o", "33", "32s",
    "A2o", "K2o", "Q2o", "J2o", "T2o", "92o", "82o", "72o", "62o", "52o", "42o", "32o", "22"
];

  // Component for rendering one hand cell with a composite bar
  const HandCell = ({ data }: { data: HandCellData }) => {
    // Calculate the width percentages for each segment.
    // (Assuming each strategy value is between 0 and 1)
    const width0 = data.group0 * 100;
    const width3 = data.group3 * 100;
    const width5 = data.group5 * 100;

    return (
      <div style={{ border: "1px solid #ccc", padding: "4px", margin: "0", height: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>{data.hand}</div>
        <div style={{ display: "flex", height: "100%" }}>
          <div
            style={{
              width: `${width0}%`,
              backgroundColor: groupColorMapping["0"]
            }}
          />
          <div
            style={{
              width: `${width3}%`,
              backgroundColor: groupColorMapping["3"]
            }}
          />
          <div
            style={{
              width: `${width5}%`,
              backgroundColor: groupColorMapping["5"]
            }}
          />
        </div>
      </div>
    );
  };

  // Assign hand data to grid cells based on the handOrder
  const gridData = handOrder.map((hand) => combinedData.find((item) => item.hand === hand));

  return (
    <div>
      <h1>Poker Strategy Grid</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(13, 1fr)",
          gridTemplateRows: "repeat(13, 1fr)",
          gap: "0",
          width: "100%",
          maxWidth: "1000px"
        }}
      >
        {gridData.map((handData, index) => (
          <HandCell key={index} data={handData!} />
        ))}
      </div>
    </div>
  );
}

export default App;
