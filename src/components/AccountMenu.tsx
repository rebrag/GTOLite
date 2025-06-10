// src/components/AccountMenu.tsx
import { useState } from "react";

const AccountMenu = () => {
  const [error] = useState<string | null>(null);

  return (
    <div>
      {/* Desktop view – hide or show placeholder user info */}
      <div className="hidden sm:flex items-center space-x-2">
        <span className="text-sm font-bold">Offline Mode</span>
        <span className="text-sm text-gray-500">(demo)</span>
      </div>

      {/* Mobile view – no logout needed */}
      <div className="flex sm:hidden">
        <span className="text-xs text-gray-500">Offline</span>
      </div>

      {/* Normally you'd show logout errors here */}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default AccountMenu;
