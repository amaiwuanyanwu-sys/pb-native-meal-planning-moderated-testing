import React from 'react';

export const TopNav: React.FC = () => {
  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#2d5f5d] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">PB</span>
        </div>
        <span className="text-gray-900 font-semibold text-lg">practice better</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-64">
        <span className="material-icons text-gray-500 text-sm mr-2">search</span>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 w-full"
        />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <span className="material-icons text-gray-600 text-xl">calendar_today</span>
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <span className="material-icons text-gray-600 text-xl">help_outline</span>
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
          CH
        </button>
      </div>
    </nav>
  );
};
