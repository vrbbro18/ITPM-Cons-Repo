// Controls.jsx – Smart Control Panel with Theme, Floors, Room Count, and Step Navigation

import React from 'react';
import { Home, Building, Building2, Sun, Layers, Square } from 'lucide-react';

const Controls = ({ state, dispatch, setTheme, viewMode, setViewMode, fullscreen, setFullscreen, showHUD }) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-md space-y-4">
      {/* Theme Selector */}
      <div>
        <label className="block text-sm font-semibold mb-2">Select Theme:</label>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('classic')}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${state.theme === 'classic' ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-100'}`}
          >
            <Home size={16} /> Classic
          </button>
          <button
            onClick={() => setTheme('modern')}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${state.theme === 'modern' ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-100'}`}
          >
            <Building2 size={16} /> Modern
          </button>
          <button
            onClick={() => setTheme('warm')}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${state.theme === 'warm' ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-100'}`}
          >
            <Sun size={16} /> Warm
          </button>
        </div>
      </div>

      {/* Room & Floor Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors</label>
          <input
            type="range"
            min={1}
            max={5}
            value={state.floors}
            onChange={(e) => dispatch({ type: 'SET_FLOORS', payload: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs mt-1 text-gray-500">Floors: {state.floors}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rooms per Floor</label>
          <input
            type="range"
            min={1}
            max={10}
            value={state.roomsPerFloor}
            onChange={(e) => dispatch({ type: 'SET_ROOMS_PER_FLOOR', payload: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs mt-1 text-gray-500">Rooms/Floor: {state.roomsPerFloor}</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex-1 px-4 py-2 border rounded ${viewMode === '2d' ? 'bg-indigo-50 border-indigo-400' : 'hover:bg-gray-100'}`}
        >
          <Square size={14} className="inline-block mr-2" /> 2D View
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`flex-1 px-4 py-2 border rounded ${viewMode === '3d' ? 'bg-indigo-50 border-indigo-400' : 'hover:bg-gray-100'}`}
        >
          <Layers size={14} className="inline-block mr-2" /> 3D View
        </button>
      </div>
    </div>
  );
};

export default Controls;
