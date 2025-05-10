import React, { useState, useEffect, useReducer } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useHotkeys } from 'react-hotkeys-hook';
import RoomBlock from './RoomBlock';
import ThreeDScene from './ThreeDScene';
import Controls from './Controls';
import { initialPlanState, planReducer } from './stateReducer';
import { exportAsImage, exportAsPDF } from '../../../../utils/exportUtils';

const FloorPlanGenerator = () => {
  const [viewMode, setViewMode] = useState('2d');
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState('classic');
  const [showHUD, setShowHUD] = useState(true);
  const [state, dispatch] = useReducer(planReducer, initialPlanState);

  useHotkeys('ctrl+z', () => dispatch({ type: 'UNDO' }), [state]);
  useHotkeys('ctrl+shift+z', () => dispatch({ type: 'REDO' }), [state]);

  useEffect(() => {
    localStorage.setItem('floorplan-draft', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const saved = localStorage.getItem('floorplan-draft');
    if (saved) dispatch({ type: 'LOAD_SAVED', payload: JSON.parse(saved) });
  }, []);

  const handleExport = () => {
    if (viewMode === '3d') exportAsImage();
    else exportAsPDF(state.rooms);
  };

  const moveRoom = (fromIndex, toIndex) => {
    dispatch({ type: 'MOVE_ROOM', payload: { fromIndex, toIndex } });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'max-w-7xl mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-indigo-700">Advanced Floor Plan Generator</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowHUD(!showHUD)} className="px-3 py-1 bg-gray-100 rounded">{showHUD ? 'Hide HUD' : 'Show HUD'}</button>
            <button onClick={() => setFullscreen(!fullscreen)} className="px-3 py-1 bg-gray-100 rounded">{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
          </div>
        </div>

        <Controls
          state={state}
          dispatch={dispatch}
          setTheme={setTheme}
          viewMode={viewMode}
          setViewMode={setViewMode}
          fullscreen={fullscreen}
          setFullscreen={setFullscreen}
          showHUD={showHUD}
        />

        {viewMode === '2d' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {state.rooms.map((room, index) => (
              <RoomBlock key={room.id} room={room} index={index} moveRoom={moveRoom} dispatch={dispatch} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <ThreeDScene rooms={state.rooms} theme={theme} hud={showHUD} />
          </div>
        )}

        <div className="flex justify-between mt-8 border-t pt-4">
          <div className="flex gap-3">
            <button onClick={() => dispatch({ type: 'UNDO' })} className="px-4 py-2 bg-gray-200 rounded">Undo</button>
            <button onClick={() => dispatch({ type: 'REDO' })} className="px-4 py-2 bg-gray-200 rounded">Redo</button>
            <button onClick={() => dispatch({ type: 'RESET_PLAN' })} className="px-4 py-2 bg-red-100 text-red-600 rounded">Reset</button>
          </div>
          <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded">Export Plan</button>
        </div>
      </div>
    </DndProvider>
  );
};

export default FloorPlanGenerator;
