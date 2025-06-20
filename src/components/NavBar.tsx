// src/components/NavBar.tsx
import React, { useState } from "react";
import FolderSelector from "./FolderSelector";
import RandomizeButton from "./RandomizeButton";
import AccountMenu from "./AccountMenu";

export interface NavBarProps {
  randomFillEnabled: boolean;
  toggleRandomization: () => void;
  folders: string[];
  currentFolder: string; // Currently selected folder
  onFolderSelect: (folder: string) => void;
  // Optional view mode toggle props (if needed in future)
  toggleViewMode: () => void;
  isSpiralView: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  randomFillEnabled,
  toggleRandomization,
  folders,
  currentFolder,
  onFolderSelect,
  // toggleViewMode,
  // isSpiralView,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        {/* Left: Hamburger Icon */}
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Center: FolderSelector remains centered and RandomizeButton pushed to the far right */}
        <div className="flex-grow mx-4 flex items-center">
          <div className="w-full max-w-lg mx-auto">
            <FolderSelector
              folders={folders}
              currentFolder={currentFolder}
              onFolderSelect={onFolderSelect}
            />
          </div>
          <div className="ml-4">
            <RandomizeButton
              randomFillEnabled={randomFillEnabled}
              setRandomFillEnabled={toggleRandomization}
            />
          </div>
        </div>

        {/* Right: Reserved space for future elements */}
        <div className="flex items-center"></div>
      </div>

      {/* Dropdown menu: shown when hamburger is clicked */}
      {menuOpen && (
        <div className="bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {/* AccountMenu (including Logout) remains inside the dropdown */}
            <AccountMenu />
            {/* Additional mobile view items can be added here */}
            {/* For example, a view mode toggle button */}
            {/* <ButtonStyle onClick={toggleViewMode}>
              {isSpiralView ? "Index Order" : "Clockwise Order"}
            </ButtonStyle> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
