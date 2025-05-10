export const initialPlanState = {
    rooms: [],
    floors: 1,
    roomsPerFloor: 4,
    theme: 'classic',
    history: [],
    future: []
  };
  
  export const planReducer = (state, action) => {
    const update = (newState) => ({
      ...newState,
      history: [...state.history, state],
      future: []
    });
  
    switch (action.type) {
      case 'SET_FLOORS':
        return update({ ...state, floors: action.payload });
      case 'SET_ROOMS_PER_FLOOR':
        const newRooms = Array(action.payload * state.floors).fill(0).map((_, i) => ({
          id: `room-${i}`,
          name: `Room ${i + 1}`,
          type: i % 2 === 0 ? 'Bedroom' : 'Kitchen'
        }));
        return update({ ...state, roomsPerFloor: action.payload, rooms: newRooms });
      case 'RENAME_ROOM':
        return update({
          ...state,
          rooms: state.rooms.map((r, i) =>
            i === action.payload.index ? { ...r, name: action.payload.name } : r
          )
        });
      case 'MOVE_ROOM':
        const newRoomOrder = [...state.rooms];
        const [moved] = newRoomOrder.splice(action.payload.fromIndex, 1);
        newRoomOrder.splice(action.payload.toIndex, 0, moved);
        return update({ ...state, rooms: newRoomOrder });
      case 'RESET_PLAN':
        return initialPlanState;
      case 'UNDO':
        if (state.history.length === 0) return state;
        const prev = state.history[state.history.length - 1];
        return {
          ...prev,
          future: [state, ...state.future],
          history: state.history.slice(0, -1)
        };
      case 'REDO':
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
          ...next,
          history: [...state.history, state],
          future: state.future.slice(1)
        };
      case 'LOAD_SAVED':
        return { ...action.payload, history: [], future: [] };
      default:
        return state;
    }
  };
  