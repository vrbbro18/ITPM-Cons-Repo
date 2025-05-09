import React, { useState, useEffect, useRef } from "react";
import { Square, Layers, Home, Building, Building2, Car, Grid, Box, Eye } from 'lucide-react';
import * as THREE from 'three';

// Room component for 2D Floor Plan
const Room = ({ type }) => {
  // Define room styles based on type
  const getRoomStyle = () => {
    switch (type) {
      case "Living Room":
        return { bg: "bg-blue-100", icon: "🛋️", color: "text-blue-800" };
      case "Kitchen":
        return { bg: "bg-yellow-100", icon: "🍳", color: "text-yellow-800" };
      case "Bedroom":
        return { bg: "bg-purple-100", icon: "🛏️", color: "text-purple-800" };
      case "Bathroom":
        return { bg: "bg-cyan-100", icon: "🚿", color: "text-cyan-800" };
      case "Dining Room":
        return { bg: "bg-green-100", icon: "🍽️", color: "text-green-800" };
      case "Study":
        return { bg: "bg-amber-100", icon: "📚", color: "text-amber-800" };
      case "Balcony":
        return { bg: "bg-sky-100", icon: "🪴", color: "text-sky-800" };
      case "Office":
        return { bg: "bg-indigo-100", icon: "💼", color: "text-indigo-800" };
      case "Meeting Room":
        return { bg: "bg-rose-100", icon: "👥", color: "text-rose-800" };
      case "Reception":
        return { bg: "bg-emerald-100", icon: "🛎️", color: "text-emerald-800" };
      case "Storage":
        return { bg: "bg-gray-100", icon: "📦", color: "text-gray-800" };
      case "Break Room":
        return { bg: "bg-orange-100", icon: "☕", color: "text-orange-800" };
      case "Restroom":
        return { bg: "bg-teal-100", icon: "🚻", color: "text-teal-800" };
      default:
        return { bg: "bg-gray-100", icon: "📊", color: "text-gray-800" };
    }
  };

  const style = getRoomStyle();

  return (
    <div className={`${style.bg} border-2 border-black rounded-lg p-4 flex flex-col items-center justify-center relative`}>
      <div className="absolute top-2 left-2 text-sm font-bold">{style.icon}</div>
      <div className={`text-center ${style.color} font-medium text-sm`}>{type}</div>
      
      {/* Door indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-3 bg-white border-2 border-black" />
    </div>
  );
};

// Helper functions for 3D visualization
const getBuildingColor = (buildingType, floor) => {
  if (buildingType === "house") {
    return floor === 0 ? 0xd4c4a8 : 0xe6d7c3;
  } else if (buildingType === "apartment") {
    return 0xb3c9d7;
  } else {
    return 0xc0c0c0;
  }
};

const addWindows = (buildingGroup, width, depth, floorY, wallHeight, roomsPerFloor) => {
  const windowWidth = 1.2;
  const windowHeight = 1.5;
  const windowDepth = 0.1;
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 });
  
  // Determine number of windows per wall
  const frontWindows = Math.max(1, Math.floor(roomsPerFloor / 2));
  const sideWindows = Math.max(1, Math.ceil(roomsPerFloor / 4));
  
  // Front windows
  for (let i = 0; i < frontWindows; i++) {
    const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    
    // Calculate position to distribute windows evenly
    const offset = (width - (frontWindows * windowWidth)) / (frontWindows + 1);
    const xPos = -width/2 + offset + (i * (windowWidth + offset)) + windowWidth/2;
    
    window.position.set(xPos, floorY + wallHeight/2, depth/2 + 0.01);
    buildingGroup.add(window);
  }
  
  // Back windows
  for (let i = 0; i < frontWindows; i++) {
    const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    
    const offset = (width - (frontWindows * windowWidth)) / (frontWindows + 1);
    const xPos = -width/2 + offset + (i * (windowWidth + offset)) + windowWidth/2;
    
    window.position.set(xPos, floorY + wallHeight/2, -depth/2 - 0.01);
    window.rotation.y = Math.PI;
    buildingGroup.add(window);
  }
  
  // Side windows
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < sideWindows; i++) {
      const windowGeometry = new THREE.BoxGeometry(windowDepth, windowHeight, windowWidth);
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      
      const offset = (depth - (sideWindows * windowWidth)) / (sideWindows + 1);
      const zPos = -depth/2 + offset + (i * (windowWidth + offset)) + windowWidth/2;
      
      window.position.set(side * width/2 - side * 0.01, floorY + wallHeight/2, zPos);
      buildingGroup.add(window);
    }
  }
};

const addDoor = (buildingGroup, width, depth, floorHeight) => {
  const doorWidth = 1.5;
  const doorHeight = 2.2;
  const doorDepth = 0.1;
  
  const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  
  door.position.set(0, doorHeight/2, depth/2 + 0.01);
  buildingGroup.add(door);
  
  // Door handle
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  
  handle.position.set(doorWidth/4, doorHeight/2, depth/2 + doorDepth + 0.05);
  buildingGroup.add(handle);
};

const addInteriorWalls = (buildingGroup, width, depth, floorY, wallHeight, wallThickness, roomsPerFloor) => {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
  
  if (roomsPerFloor >= 2) {
    // Add central dividing wall
    const dividerGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, depth * 0.8);
    const divider = new THREE.Mesh(dividerGeometry, wallMaterial);
    divider.position.set(0, floorY + wallHeight/2, 0);
    buildingGroup.add(divider);
  }
  
  if (roomsPerFloor >= 4) {
    // Add horizontal dividing wall
    const horizontalDividerGeometry = new THREE.BoxGeometry(width * 0.8, wallHeight, wallThickness);
    const horizontalDivider = new THREE.Mesh(horizontalDividerGeometry, wallMaterial);
    horizontalDivider.position.set(0, floorY + wallHeight/2, 0);
    buildingGroup.add(horizontalDivider);
  }
};

const addCar = (buildingGroup, x, y, z, color) => {
  const carGroup = new THREE.Group();
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  body.castShadow = true;
  carGroup.add(body);
  
  // Car top
  const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
  const top = new THREE.Mesh(topGeometry, bodyMaterial);
  top.position.set(0, 1.4, -0.5);
  top.castShadow = true;
  carGroup.add(top);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  // Positions: front-left, front-right, back-left, back-right
  const wheelPositions = [
    [-0.8, 0.4, -1.5],
    [0.8, 0.4, -1.5],
    [-0.8, 0.4, 1.5],
    [0.8, 0.4, 1.5]
  ];
  
  wheelPositions.forEach(position => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(...position);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    carGroup.add(wheel);
  });
  
  // Windows (simplified)
  const windowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x88ccff, 
    transparent: true, 
    opacity: 0.5
  });
  
  // Windshield
  const windshieldGeometry = new THREE.BoxGeometry(1.7, 0.7, 0.1);
  const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
  windshield.position.set(0, 1.4, -1.45);
  carGroup.add(windshield);
  
  // Position the car
  carGroup.position.set(x, y, z);
  buildingGroup.add(carGroup);
};

// Function to add trees to the garden
const addTrees = (buildingGroup, x, y, z, count = 3) => {
  for (let i = 0; i < count; i++) {
    const treeGroup = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Tree leaves
    const leavesGeometry = new THREE.ConeGeometry(1.2, 2.5, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x4ca64c });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5;
    leaves.castShadow = true;
    treeGroup.add(leaves);
    
    // Position the tree
    const treeX = x + (i - count/2) * 2;
    treeGroup.position.set(treeX, y, z);
    buildingGroup.add(treeGroup);
  }
};

const EnhancedFloorPlanGenerator = () => {
  const [buildingType, setBuildingType] = useState("house");
  const [floors, setFloors] = useState(1);
  const [roomsPerFloor, setRoomsPerFloor] = useState(4);
  const [hasCarPark, setHasCarPark] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [showPlan, setShowPlan] = useState(false);
  const [viewMode, setViewMode] = useState("2d"); // "2d" or "3d"

  const handleGeneratePlan = () => {
    setShowPlan(true);
    setCurrentFloor(0);
  };

  // Building type icons
  const buildingIcons = {
    house: <Home className="mr-2" />,
    apartment: <Building className="mr-2" />,
    commercial: <Building2 className="mr-2" />
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Control Panel */}
      <div className="w-full md:w-72 bg-white p-6 shadow-lg rounded-r-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-indigo-800">
          <Grid className="mr-2 text-indigo-600" />
          Floor Plan Generator
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Building Type:</label>
            <div className="flex border rounded-lg overflow-hidden shadow-sm">
              <button 
                type="button"
                className={`flex-1 py-3 px-3 flex justify-center items-center text-sm font-medium transition-all ${buildingType === 'house' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setBuildingType("house")}
              >
                <Home size={18} className="mr-2" /> House
              </button>
              <button 
                type="button"
                className={`flex-1 py-3 px-3 flex justify-center items-center text-sm font-medium transition-all ${buildingType === 'apartment' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setBuildingType("apartment")}
              >
                <Building size={18} className="mr-2" /> Apartment
              </button>
              <button 
                type="button"
                className={`flex-1 py-3 px-3 flex justify-center items-center text-sm font-medium transition-all ${buildingType === 'commercial' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setBuildingType("commercial")}
              >
                <Building2 size={18} className="mr-2" /> Commercial
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Floors:</label>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">{floors}</span>
            </div>
            <input 
              type="range" 
              value={floors} 
              onChange={(e) => setFloors(parseInt(e.target.value))} 
              min={1} 
              max={5} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Rooms per Floor:</label>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">{roomsPerFloor}</span>
            </div>
            <input 
              type="range" 
              value={roomsPerFloor} 
              onChange={(e) => setRoomsPerFloor(parseInt(e.target.value))} 
              min={1} 
              max={8} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>8</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Additional Features:</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasCarPark" 
                  checked={hasCarPark} 
                  onChange={(e) => setHasCarPark(e.target.checked)} 
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <label htmlFor="hasCarPark" className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                  <Car size={16} className="mr-2 text-indigo-500" /> Include Parking
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hasGarden" 
                  checked={hasGarden} 
                  onChange={(e) => setHasGarden(e.target.checked)} 
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <label htmlFor="hasGarden" className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                  <Square size={16} className="mr-2 text-indigo-500" /> Include Garden
                </label>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleGeneratePlan}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center font-medium"
          >
            <Layers className="mr-2" /> Generate Floor Plan
          </button>
        </div>
        
        {showPlan && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            {/* View Mode Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">View Mode:</label>
              <div className="flex border rounded-lg overflow-hidden shadow-sm">
                <button 
                  type="button"
                  className={`flex-1 py-2 px-3 flex justify-center items-center text-sm font-medium transition-all ${viewMode === '2d' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setViewMode("2d")}
                >
                  <Square size={16} className="mr-2" /> 2D View
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 px-3 flex justify-center items-center text-sm font-medium transition-all ${viewMode === '3d' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setViewMode("3d")}
                >
                  <Box size={16} className="mr-2" /> 3D View
                </button>
              </div>
            </div>

            {/* Floor selector (only show in 2D mode or if there's more than 1 floor) */}
            {(viewMode === "2d" && floors > 1) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Floor:</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: floors }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFloor(i)}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg text-sm font-medium 
                        ${currentFloor === i 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {i === 0 ? 'G' : i}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 p-6">
        {showPlan ? (
          <div className="bg-white p-6 rounded-xl shadow-xl h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800 border-b pb-4 border-gray-200">
              {buildingIcons[buildingType]}
              {buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} Floor Plan
              {viewMode === "2d" && floors > 1 && ` - ${currentFloor === 0 ? 'Ground' : `Floor ${currentFloor}`}`}
              {viewMode === "3d" && " - 3D Visualization"}
            </h3>
            
            <div className="relative border-4 border-black bg-white rounded-lg shadow-inner" style={{ height: '500px' }}>
              {viewMode === "2d" ? (
                <FloorPlan 
                  buildingType={buildingType}
                  roomsPerFloor={roomsPerFloor}
                  floorNumber={currentFloor}
                  hasCarPark={hasCarPark && currentFloor === 0}
                  hasGarden={hasGarden && currentFloor === 0}
                />
              ) : (
                <ThreeDVisualization 
                  buildingType={buildingType}
                  floors={floors}
                  roomsPerFloor={roomsPerFloor}
                  hasCarPark={hasCarPark}
                  hasGarden={hasGarden}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md">
              <Layers size={64} className="mx-auto mb-6 text-indigo-400" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Ready to Design</h3>
              <p className="text-gray-500">Configure your building options and click Generate to create your floor plan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Improved Floor Plan Component with better visualization (2D view)
const FloorPlan = ({ buildingType, roomsPerFloor, floorNumber, hasCarPark, hasGarden }) => {
  // Define room types based on building type
  const getRoomTypes = () => {
    if (buildingType === "house") {
      return ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Dining Room", "Study"];
    } else if (buildingType === "apartment") {
      return ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Balcony"];
    } else {
      return ["Office", "Meeting Room", "Reception", "Storage", "Break Room", "Restroom"];
    }
  };
  
  // Determine layout based on number of rooms
  const getLayout = (rooms) => {
    if (rooms <= 2) return { cols: 2, rows: 1 };
    if (rooms <= 4) return { cols: 2, rows: 2 };
    if (rooms <= 6) return { cols: 3, rows: 2 };
    return { cols: 4, rows: 2 };
  };
  
  const roomTypes = getRoomTypes();
  const layout = getLayout(roomsPerFloor);
  const roomsToCreate = Math.min(roomsPerFloor, layout.cols * layout.rows);
  
  // Create a more realistic room plan with better distribution
  const createRoomPlan = () => {
    const rooms = [];
    
    // Essential rooms that should be included based on building type
    let essentialRooms = [];
    if (buildingType === "house") {
      essentialRooms = ["Living Room", "Kitchen", "Bathroom", "Bedroom"];
    } else if (buildingType === "apartment") {
      essentialRooms = ["Living Room", "Kitchen", "Bathroom", "Bedroom"];
    } else { // Commercial
      essentialRooms = ["Reception", "Office", "Restroom"];
    }
    
    // Add essential rooms first
    for (let i = 0; i < Math.min(essentialRooms.length, roomsToCreate); i++) {
      rooms.push(essentialRooms[i]);
    }
    
    // Fill remaining slots with random rooms
    while (rooms.length < roomsToCreate) {
      const availableTypes = roomTypes.filter(type => !essentialRooms.includes(type) || 
        // Allow duplicates of bedrooms and offices
        ((type === "Bedroom" || type === "Office") && rooms.filter(r => r === type).length < 3));
      
      if (availableTypes.length > 0) {
        rooms.push(availableTypes[Math.floor(Math.random() * availableTypes.length)]);
      } else {
        // Fallback if we run out of room types
        rooms.push(buildingType === "commercial" ? "Office" : "Bedroom");
      }
    }
    
    // Shuffle the rooms for more natural layout
    // Use a more deterministic approach to make the layout more realistic
    return rooms;
  };
  
  const rooms = createRoomPlan();
  
  // Draw the floor plan
  return (
    <div className="w-full h-full relative">
      {/* Main building outline */}
      <div className="absolute inset-0 border-8 border-black bg-gray-50 rounded-lg flex flex-col">
        {/* Top navigation label */}
        <div className="w-full p-2 bg-indigo-100 text-center text-sm font-medium border-b-2 border-black">
          Floor Plan View
        </div>
        
        {/* Rooms area */}
        <div className="flex-1 relative p-4">
          {/* Rooms grid */}
          <div 
            className="grid gap-3 h-full" 
            style={{ 
              gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${layout.rows}, 1fr)`
            }}
          >
            {rooms.map((roomType, idx) => (
              <Room key={idx} type={roomType} />
            ))}
          </div>
          
          {/* Main entrance */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black flex items-center justify-center">
            <div className="w-20 h-6 bg-white flex items-center justify-center text-xs font-bold">
              ENTRANCE
            </div>
          </div>
        </div>
      </div>
      
      {/* Car park */}
      {hasCarPark && (
        <div className="absolute -left-32 top-0 bottom-0 w-28 border-4 border-black bg-gray-200 rounded-l-lg flex flex-col items-center justify-center">
          <Car size={32} className="mb-4 text-gray-700" />
          <div className="text-xs font-bold text-gray-800 text-center">PARKING<br/>AREA</div>
          {/* Connection to main building */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-16 bg-black flex items-center justify-center">
            <div className="w-4 h-12 bg-white text-xs flex items-center justify-center font-medium">
              GATE
            </div>
          </div>
        </div>
      )}
      
      {/* Garden */}
      {hasGarden && (
        <div className="absolute -right-32 top-0 bottom-0 w-28 border-4 border-black bg-green-100 rounded-r-lg flex flex-col items-center justify-center">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center">
                {i % 3 === 0 ? "🌳" : i % 3 === 1 ? "🌿" : "🌱"}
              </div>
            ))}
          </div>
          <div className="text-xs font-bold text-green-800 mt-2 text-center">GARDEN</div>
          {/* Connection to main building */}
          {/* Connection to main building */}
          <div className="absolute top-1/2 left-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-16 bg-black flex items-center justify-center">
            <div className="w-4 h-12 bg-white text-xs flex items-center justify-center font-medium">
              PATH
            </div>
          </div>
        </div>
      )}
      
      {/* North indicator */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
        <div className="w-1 h-4 bg-red-500 rounded-full transform -translate-y-1" />
        <div className="absolute text-xs font-bold">N</div>
      </div>
    </div>
  );
};

// 3D Visualization Component
const ThreeDVisualization = ({ buildingType, floors, roomsPerFloor, hasCarPark, hasGarden }) => {
  const canvasRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f7ff);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(20, 15, 20);
    camera.lookAt(0, 0, 0);
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Add building
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);
    
    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: hasGarden ? 0x7cba5d : 0xa9a9a9, 
      side: THREE.DoubleSide 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Calculate building dimensions based on rooms
    const width = Math.max(6, roomsPerFloor * 2); // Width scales with number of rooms
    const depth = Math.max(6, roomsPerFloor * 1.5); // Depth scales with number of rooms
    const floorHeight = 3; // Each floor is 3 units tall
    const wallThickness = 0.3;
    
    // Create building floors
    for (let i = 0; i < floors; i++) {
      const floorY = i * floorHeight;
      const wallHeight = floorHeight - 0.2; // Slightly less than floor height for visual separation
      
      // Floor slab
      const floorGeometry = new THREE.BoxGeometry(width, 0.2, depth);
      const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = floorY;
      floor.receiveShadow = true;
      buildingGroup.add(floor);
      
      // Walls
      const wallColor = getBuildingColor(buildingType, i);
      const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor });
      
      // Front wall
      const frontWallGeometry = new THREE.BoxGeometry(width, wallHeight, wallThickness);
      const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
      frontWall.position.set(0, floorY + wallHeight/2, depth/2);
      frontWall.castShadow = true;
      buildingGroup.add(frontWall);
      
      // Back wall
      const backWallGeometry = new THREE.BoxGeometry(width, wallHeight, wallThickness);
      const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
      backWall.position.set(0, floorY + wallHeight/2, -depth/2);
      backWall.castShadow = true;
      buildingGroup.add(backWall);
      
      // Left wall
      const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, depth);
      const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
      leftWall.position.set(-width/2, floorY + wallHeight/2, 0);
      leftWall.castShadow = true;
      buildingGroup.add(leftWall);
      
      // Right wall
      const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, depth);
      const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
      rightWall.position.set(width/2, floorY + wallHeight/2, 0);
      rightWall.castShadow = true;
      buildingGroup.add(rightWall);
      
      // Add windows
      addWindows(buildingGroup, width, depth, floorY, wallHeight, roomsPerFloor);
      
      // Add door on ground floor
      if (i === 0) {
        addDoor(buildingGroup, width, depth, floorHeight);
      }
      
      // Add internal walls for rooms
      addInteriorWalls(buildingGroup, width, depth, floorY, wallHeight, wallThickness, roomsPerFloor);
    }
    
    // Add roof
    const roofHeight = 1.8;
    if (buildingType === "house") {
      // Pitched roof for houses
      const roofGeometry = new THREE.ConeGeometry(width * 0.75, roofHeight, 4);
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xb35a2a });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = floors * floorHeight + roofHeight/2;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      buildingGroup.add(roof);
    } else {
      // Flat roof for apartments and commercial buildings
      const roofGeometry = new THREE.BoxGeometry(width, 0.3, depth);
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = floors * floorHeight;
      roof.castShadow = true;
      buildingGroup.add(roof);
    }
    
    // Add cars if car park is enabled
    if (hasCarPark) {
      addCar(buildingGroup, -width/2 - 3, 0, depth/4, 0xff0000); // Red car
      addCar(buildingGroup, -width/2 - 3, 0, -depth/4, 0x0066ff); // Blue car
    }
    
    // Add trees if garden is enabled
    if (hasGarden) {
      addTrees(buildingGroup, width/2 + 3, 0, 0, 3);
    }
    
    // Center the building in the scene
    buildingGroup.position.y = 0.1; // Slight elevation to avoid z-fighting with ground
    
    // Setup animation
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      if (isRotating) {
        buildingGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      
      // Dispose of resources
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [buildingType, floors, roomsPerFloor, hasCarPark, hasGarden, isRotating]);
  
  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Rotation control */}
      <button 
        className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100"
        onClick={() => setIsRotating(prev => !prev)}
        title={isRotating ? "Pause Rotation" : "Resume Rotation"}
      >
        <Eye size={24} className={isRotating ? "text-indigo-600" : "text-gray-400"} />
      </button>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-md text-xs">
        <p className="font-bold mb-2">3D Preview</p>
        <p className="text-gray-600">• Click and drag to rotate view</p>
        <p className="text-gray-600">• Scroll to zoom in/out</p>
      </div>
    </div>
  );
};

export default EnhancedFloorPlanGenerator;