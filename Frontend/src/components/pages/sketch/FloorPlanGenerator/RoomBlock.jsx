import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Edit2 } from 'lucide-react';

const RoomBlock = ({ room, index, moveRoom, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(room.name);

  const [, ref] = useDrag({ type: 'ROOM', item: { index } });
  const [, drop] = useDrop({
    accept: 'ROOM',
    hover: (item) => {
      if (item.index !== index) {
        moveRoom(item.index, index);
        item.index = index;
      }
    }
  });

  const roomColors = {
    Bedroom: 'bg-purple-100 text-purple-800',
    Kitchen: 'bg-yellow-100 text-yellow-800',
    Bathroom: 'bg-cyan-100 text-cyan-800',
    Living: 'bg-blue-100 text-blue-800',
    Garage: 'bg-slate-100 text-slate-800',
    Office: 'bg-indigo-100 text-indigo-800',
    Default: 'bg-gray-100 text-gray-800'
  };

  const currentColor = roomColors[room.type] || roomColors.Default;

  const handleRename = () => {
    dispatch({ type: 'RENAME_ROOM', payload: { index, name: newName } });
    setIsEditing(false);
  };

  return (
    <div ref={(node) => ref(drop(node))} className={`relative border-2 border-gray-300 rounded-lg p-4 shadow-sm ${currentColor}`}>
      <div className="absolute top-2 left-2 text-gray-500 cursor-move">
        <GripVertical size={16} />
      </div>
      {!isEditing ? (
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold truncate w-4/5">{room.name}</div>
          <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:text-gray-800">
            <Edit2 size={14} />
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleRename(); }} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="text-sm w-full border-b border-gray-400 bg-transparent"
            autoFocus
          />
          <button type="submit" className="text-indigo-600 text-xs font-medium">Save</button>
        </form>
      )}
      <div className="text-xs text-gray-600 mt-2">Type: {room.type}</div>
    </div>
  );
};

export default RoomBlock;
