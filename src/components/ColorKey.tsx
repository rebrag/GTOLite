// src/components/ColorKey.tsx
import React from "react";
import { HandCellData, getColorForAction } from "../utils/utils";

interface ColorKeyProps {
  data: HandCellData[];
  onSelectAction: (action: string) => void;
}

const ColorKey: React.FC<ColorKeyProps> = ({ data, onSelectAction }) => {
  // Extract a unique set of actions from the grid data.
  const uniqueActions = Array.from(
    data.reduce((set, cell) => {
      Object.keys(cell.actions)
        .filter(action => action !== "Position")
        .forEach(action => set.add(action));
      return set;
    }, new Set<string>())
  );

  const actionMapping: Record<string, string> = {
    "Raise 2bb": "15",
    "Raise 54%": "40054",
    // add other mappings as needed
  };  

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "5px",
        alignItems: "center",
      }}
    >
      {uniqueActions.map((action) => (
        <div
          key={action}
          style={{display: "flex",alignItems: "center",cursor: "pointer",}}
          onClick={() => {
            //console.log(action)
            onSelectAction(actionMapping[action] || action)
          }}
          
          title={`Click to set ${action} as the new root`}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: getColorForAction(action),
              marginRight: "5px",
              border: "1px solid #ccc",
            }}
          />
          <span>{action}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorKey;
