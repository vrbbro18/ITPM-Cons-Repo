import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane, PerspectiveCamera } from '@react-three/drei';

function Building({ floors, roomsPerFloor }) {
  const floorHeight = 3;
  const roomWidth = 3;
  const buildingWidth = roomWidth * roomsPerFloor;
  const boxes = [];

  for (let f = 0; f < floors; f++) {
    for (let r = 0; r < roomsPerFloor; r++) {
      boxes.push(
        <Box
          key={`floor${f}-room${r}`}
          args={[roomWidth - 0.1, floorHeight, roomWidth - 0.1]}
          position={[r * roomWidth - buildingWidth / 2 + roomWidth / 2, f * floorHeight + floorHeight / 2, 0]}
        >
          <meshStandardMaterial color="#dddddd" />
        </Box>
      );
    }
  }

  return (
    <group>
      {/* Ground */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#b0b0b0" />
      </Plane>
      {boxes}
    </group>
  );
}

function App() {
  const [floors, setFloors] = useState(2);
  const [roomsPerFloor, setRoomsPerFloor] = useState(3);
  const [showSketch, setShowSketch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSketch(true);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px', padding: '20px' }}>
        <h2>Building Generator</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Floors:</label>
            <input type="number" value={floors} onChange={(e) => setFloors(parseInt(e.target.value))} min={1} />
          </div>
          <div>
            <label>Rooms per Floor:</label>
            <input type="number" value={roomsPerFloor} onChange={(e) => setRoomsPerFloor(parseInt(e.target.value))} min={1} />
          </div>
          <button type="submit">Generate Sketch</button>
        </form>
      </div>
      <div style={{ flex: 1, height: '100vh' }}>
        {showSketch && (
          <Canvas shadows>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <PerspectiveCamera makeDefault position={[15, 10, 20]} />
            <OrbitControls />
            <Building floors={floors} roomsPerFloor={roomsPerFloor} />
          </Canvas>
        )}
      </div>
    </div>
  );
}

export default App;