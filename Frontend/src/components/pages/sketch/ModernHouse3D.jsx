import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModernHousePlanner = () => {
  const canvasRef = useRef();
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const houseRef = useRef(null);
  const animationRef = useRef(null);
  const lightsRef = useRef({});
  
  // User input states
  const [floors, setFloors] = useState(1);
  const [width, setWidth] = useState(12);
  const [depth, setDepth] = useState(8);
  const [rooms, setRooms] = useState({
    bedrooms: 2,
    bathrooms: 1,
    livingRoom: true,
    kitchen: true
  });
  const [hasGarage, setHasGarage] = useState(true);
  const [roofStyle, setRoofStyle] = useState('modern');
  const [accentColor, setAccentColor] = useState('#dd1e1e');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [landscaping, setLandscaping] = useState('modern');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [materials, setMaterials] = useState('modern');
  const [pool, setPool] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('dimensions');
  const [viewMode, setViewMode] = useState('exterior');
  const [renderQuality, setRenderQuality] = useState('medium');
  const [renderProgress, setRenderProgress] = useState(0);
  const [showTips, setShowTips] = useState(true);

  // Material references
  const materialRefs = useRef({});

  const initializeScene = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f8fe);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(15, 10, 20);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controlsRef.current = controls;

    // Lighting
    setupLighting('day');
    
    // Ground
    createGround();
    
    // Create house group
    const house = new THREE.Group();
    houseRef.current = house;
    scene.add(house);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !canvas) return;
      cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  const setupLighting = (time) => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    // Clear existing lights
    Object.values(lightsRef.current).forEach(light => {
        if (light && scene.children.includes(light)) {
            scene.remove(light);
          }
          
    });
    
    lightsRef.current = {};
    
    // Ambient light
    let ambientIntensity, ambientColor;
    
    if (time === 'night') {
      ambientIntensity = 0.2;
      ambientColor = 0x1A237E; // Deep blue night
      scene.background = new THREE.Color(0x0A1929); // Dark blue night sky
    } else if (time === 'sunset') {
      ambientIntensity = 0.5;
      ambientColor = 0xFF9E80; // Orange sunset
      scene.background = new THREE.Color(0xFFA07A); // Light salmon sunset sky
    } else {
      ambientIntensity = 0.6;
      ambientColor = 0xffffff; // White daylight
      scene.background = new THREE.Color(0xAED6F1); // Light blue day sky
    }
    
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);
    lightsRef.current.ambient = ambientLight;
    
    // Directional light (sun/moon)
    let sunColor, sunIntensity, sunPosition;
    
    if (time === 'night') {
      sunColor = 0xCCCCFF; // Soft blue moonlight
      sunIntensity = 0.5;
      sunPosition = new THREE.Vector3(-15, 20, 15);
    } else if (time === 'sunset') {
      sunColor = 0xFF7E00; // Orange sunset
      sunIntensity = 0.8;
      sunPosition = new THREE.Vector3(-15, 8, 15);
    } else {
      sunColor = 0xFFFFCC; // Warm daylight
      sunIntensity = 1.0;
      sunPosition = new THREE.Vector3(15, 30, 15);
    }
    
    const sun = new THREE.DirectionalLight(sunColor, sunIntensity);
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    sun.castShadow = true;
    sun.shadow.mapSize.width = renderQuality === 'high' ? 4096 : 2048;
    sun.shadow.mapSize.height = renderQuality === 'high' ? 4096 : 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    scene.add(sun);
    lightsRef.current.sun = sun;
    
    // Add a subtle hemisphere light
    const hemiLight = new THREE.HemisphereLight(
      time === 'night' ? 0x0000FF : (time === 'sunset' ? 0xFF7E00 : 0xadd8e6), 
      0x6b8e23, 
      time === 'night' ? 0.3 : 0.5
    );
    scene.add(hemiLight);
    lightsRef.current.hemi = hemiLight;
    
    // Add house lights at night
    if (time === 'night') {
      // Will add house lights when house is built
      if (houseRef.current && houseRef.current.children.length > 0) {
        addHouseLights();
      }
    }
  };
  
  const addHouseLights = () => {
    const house = houseRef.current;
    const scene = sceneRef.current;
    if (!house || !scene) return;
    
    // Remove existing house lights
    const existingLights = [];
    scene.traverse(object => {
      if (object.userData.houseLight) {
        existingLights.push(object);
      }
    });
    existingLights.forEach(light => scene.remove(light));
    
    // Add window glow
    house.traverse(object => {
      if (object.userData.isWindow) {
        const windowPos = object.position.clone();
        const windowLight = new THREE.PointLight(0xFFE0A3, 0.8, 5);
        windowLight.position.copy(windowPos);
        windowLight.userData.houseLight = true;
        scene.add(windowLight);
      }
    });
    
    // Add exterior lights
    const exteriorLights = [
      { position: new THREE.Vector3(0, 2, depth/2 + 0.5), intensity: 0.7, distance: 5 },
      { position: new THREE.Vector3(width/2, 1.5, 0), intensity: 0.5, distance: 5 },
      { position: new THREE.Vector3(-width/2, 1.5, 0), intensity: 0.5, distance: 5 }
    ];
    
    exteriorLights.forEach(lightInfo => {
      const light = new THREE.PointLight(0xFFE0A3, lightInfo.intensity, lightInfo.distance);
      light.position.copy(lightInfo.position);
      light.userData.houseLight = true;
      scene.add(light);
    });
  };

  const createGround = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    
    let groundMaterial;
    if (landscaping === 'modern') {
      groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7CFC00,
        roughness: 0.8,
        metalness: 0.1
      });
    } else if (landscaping === 'desert') {
      groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xD2B48C,
        roughness: 0.9,
        metalness: 0.0
      });
    } else {
      groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.1
      });
    }
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    materialRefs.current.ground = groundMaterial;
    
    scene.add(ground);
  };

  const generateHouse = () => {
    setIsLoading(true);
    setRenderProgress(0);
    
    // Clear existing house
    if (houseRef.current) {
      while (houseRef.current.children.length) {
        const object = houseRef.current.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
        houseRef.current.remove(object);
      }
    
      const progressSteps = 10;
      const updateInterval = 100; // ms
      
      // Simulate progress
      const updateProgress = (step) => {
        setRenderProgress(Math.floor((step / progressSteps) * 100));
        
        if (step < progressSteps) {
          setTimeout(() => updateProgress(step + 1), updateInterval);
        } else {
          // Build the house in stages for better user experience
          buildHouseFoundation();
          setTimeout(() => {
            buildHouseStructure();
            setTimeout(() => {
              buildRoof();
              setTimeout(() => {
                if (hasGarage) buildGarage();
                setTimeout(() => {
                  addLandscaping();
                  if (pool) addPool();
                  addDetailsAndFurniture();
                  setTimeout(() => {
                    if (timeOfDay === 'night') addHouseLights();
                    setIsLoading(false);
                    setIsGenerated(true);
                  }, updateInterval);
                }, updateInterval);
              }, updateInterval);
            }, updateInterval);
          }, updateInterval);
        }
      };
      
      updateProgress(1);
    }
  };
  
  const buildHouseFoundation = () => {
    const house = houseRef.current;
    if (!house) return;
    
    // Create concrete foundation slab
    const foundationMaterial = new THREE.MeshStandardMaterial({
      color: 0xAAAAAA,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(width + 1, 0.3, depth + 1),
      foundationMaterial
    );
    foundation.position.y = -0.15;
    foundation.receiveShadow = true;
    house.add(foundation);
  };
  
  const buildHouseStructure = () => {
    const house = houseRef.current;
    if (!house) return;
    
    const floorHeight = 4;
    const totalHeight = floors * floorHeight;
    
    // Base wall material
    let wallMaterial;
    if (materials === 'modern') {
      wallMaterial = new THREE.MeshPhysicalMaterial({ 
        color: new THREE.Color(wallColor),
        roughness: 0.5,
        metalness: 0.2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
      });
    } else if (materials === 'classic') {
      wallMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(wallColor),
        roughness: 0.8,
        metalness: 0.0
      });
    } else if (materials === 'luxury') {
      wallMaterial = new THREE.MeshPhysicalMaterial({ 
        color: new THREE.Color(wallColor),
        roughness: 0.3,
        metalness: 0.4,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      });
    }
    
    materialRefs.current.wall = wallMaterial;
    
    // Accent material
    const accentMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(accentColor),
      roughness: 0.5,
      metalness: 0.2
    });
    
    materialRefs.current.accent = accentMaterial;
    
    // Glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x7799aa, 
      transparent: true, 
      opacity: 0.5,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.9,
      clearcoat: 1,
      reflectivity: 1
    });
    
    materialRefs.current.glass = glassMaterial;
    
    // Create each floor
    for (let i = 0; i < floors; i++) {
      const baseY = i * floorHeight;
      
      // Main floor structure
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(width, floorHeight, depth),
        wallMaterial
      );
      base.position.y = baseY + floorHeight / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      house.add(base);
      
      // Accent bands
      const topStripe = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.2, 0.3, depth + 0.2), 
        accentMaterial
      );
      topStripe.position.y = baseY + floorHeight - 0.3;
      house.add(topStripe);
      
      const bottomStripe = topStripe.clone();
      bottomStripe.position.y = baseY + 0.3;
      house.add(bottomStripe);
      
      // Frame material
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.5,
        metalness: 0.4
      });
      
      // Add windows
      addWindowsToFloor(i, baseY, floorHeight, frameMaterial, glassMaterial);
    }
    
    // Add front door
    addFrontDoor();
  };
  
  const addWindowsToFloor = (floorIndex, baseY, floorHeight, frameMaterial, glassMaterial) => {
    const house = houseRef.current;
    if (!house) return;
    
    // Front windows
    const windowCount = floorIndex === 0 ? 
      Math.max(2, Math.floor(rooms.bedrooms / 2) + (rooms.livingRoom ? 1 : 0)) : 
      Math.max(2, Math.floor(rooms.bedrooms / 2));
      
    const windowSpacing = (width - 2) / (windowCount + 1);
    
    for (let w = 1; w <= windowCount; w++) {
      const windowX = -width/2 + w * windowSpacing;
      
      // Modern large windows
      const windowHeight = materials === 'modern' ? 2.4 : 2.0;
      const windowWidth = materials === 'modern' ? 1.8 : 1.4;
      
      // Window frame
      const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(windowWidth + 0.2, windowHeight + 0.2, 0.2),
        frameMaterial
      );
      windowFrame.position.set(windowX, baseY + floorHeight / 2 + 0.6, depth/2 + 0.05);
      house.add(windowFrame);
      
      // Window glass
      const windowGlass = new THREE.Mesh(
        new THREE.BoxGeometry(windowWidth, windowHeight, 0.1),
        glassMaterial
      );
      windowGlass.position.set(windowX, baseY + floorHeight / 2 + 0.6, depth/2 + 0.1);
      windowGlass.userData.isWindow = true;
      house.add(windowGlass);
      
      // Window sill
      const windowSill = new THREE.Mesh(
        new THREE.BoxGeometry(windowWidth + 0.4, 0.1, 0.3),
        frameMaterial
      );
      windowSill.position.set(windowX, baseY + floorHeight / 2 + 0.6 - windowHeight/2 - 0.05, depth/2 + 0.15);
      house.add(windowSill);
    }
    
    // Side windows
    const sideWindowCount = floorIndex === 0 ? 
      (rooms.kitchen ? 1 : 0) + (rooms.bathrooms > 0 ? 1 : 0) : 
      Math.max(1, Math.floor(rooms.bathrooms / 2));
      
    for (let w = 0; w < sideWindowCount; w++) {
      const posX = width/2 + 0.05;
      const posZ = -depth/2 + (w + 1) * (depth / (sideWindowCount + 1));
      
      // Window frame
      const sideWindowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.7, 1.2),
        frameMaterial
      );
      sideWindowFrame.position.set(posX, baseY + floorHeight / 2 + 0.6, posZ);
      house.add(sideWindowFrame);
      
      // Window glass
      const sideWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.5, 1),
        glassMaterial
      );
      sideWindow.position.set(posX + 0.05, baseY + floorHeight / 2 + 0.6, posZ);
      sideWindow.userData.isWindow = true;
      house.add(sideWindow);
      
      // Add window on the opposite side too
      const oppWindowFrame = sideWindowFrame.clone();
      oppWindowFrame.position.x = -posX;
      house.add(oppWindowFrame);
      
      const oppWindow = sideWindow.clone();
      oppWindow.position.x = -posX - 0.05;
      oppWindow.userData.isWindow = true;
      house.add(oppWindow);
    }
    
    // Add some rear windows
    const rearWindowCount = Math.max(1, Math.floor(windowCount / 2));
    const rearWindowSpacing = (width - 2) / (rearWindowCount + 1);
    
    for (let w = 1; w <= rearWindowCount; w++) {
      const windowX = -width/2 + w * rearWindowSpacing;
      
      // Window frame
      const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.5, 0.2),
        frameMaterial
      );
      windowFrame.position.set(windowX, baseY + floorHeight / 2 + 1.2, -depth/2 - 0.05);
      house.add(windowFrame);
      
      // Window glass
      const windowGlass = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.3, 0.1),
        glassMaterial
      );
      windowGlass.position.set(windowX, baseY + floorHeight / 2 + 1.2, -depth/2 - 0.1);
      windowGlass.userData.isWindow = true;
      house.add(windowGlass);
    }
  };

  const addFrontDoor = () => {
    const house = houseRef.current;
    if (!house) return;
    
    // Door frame material
    const doorFrameMat = new THREE.MeshStandardMaterial({ 
      color: 0x444444,
      roughness: 0.7,
      metalness: 0.3
    });
    
    // Door material based on style
    let doorColor;
    if (materials === 'modern') {
      doorColor = 0x333333; // Dark modern door
    } else if (materials === 'classic') {
      doorColor = 0x8B4513; // Brown wooden door
    } else if (materials === 'luxury') {
      doorColor = 0x8B0000; // Dark red luxury door
    }
    
    const doorMat = new THREE.MeshStandardMaterial({ 
      color: doorColor,
      roughness: 0.6,
      metalness: 0.2
    });
    
    // Create door frame
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 3.2, 0.3),
      doorFrameMat
    );
    doorFrame.position.set(0, 1.6, depth/2 + 0.05);
    house.add(doorFrame);
    
    // Create door
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3.0, 0.2),
      doorMat
    );
    door.position.set(0, 1.5, depth/2 + 0.15);
    house.add(door);
    
    // Door handle
    const handleMat = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    });
    
    const doorknob = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      handleMat
    );
    doorknob.position.set(0.5, 1.5, depth/2 + 0.25);
    house.add(doorknob);
    
    // Add small glass panel to modern doors
    if (materials === 'modern') {
      const glassMat = materialRefs.current.glass;
      
      const doorGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1.5, 0.05),
        glassMat
      );
      doorGlass.position.set(-0.5, 1.8, depth/2 + 0.26);
      house.add(doorGlass);
    }
    
    // Add steps if needed
    const steps = new THREE.Group();
    
    const stepMat = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.8
    });
    
    const step1 = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.2, 0.8),
      stepMat
    );
    step1.position.set(0, 0.1, depth/2 + 0.6);
    steps.add(step1);
    
    const step2 = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.2, 0.8),
      stepMat
    );
    step2.position.set(0, 0.1, depth/2 + 1.4);
    steps.add(step2);
    
    house.add(steps);
    
    // Add path to front door
    const pathMat = new THREE.MeshStandardMaterial({ 
      color: 0xBBBBBB,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const frontPath = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 5),
      pathMat
    );
    frontPath.rotation.x = -Math.PI / 2;
    frontPath.position.set(0, 0.01, depth/2 + 4);
    house.add(frontPath);
  };
  
  const buildRoof = () => {
    const house = houseRef.current;
    if (!house) return;
    
    const floorHeight = 4;
    const totalHeight = floors * floorHeight;
    
    // Roof material
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2
    });
    
    if (roofStyle === 'flat') {
      // Modern flat roof with slight overhang
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width + 1, 0.5, depth + 1),
        roofMaterial
      );
      roof.position.y = totalHeight + 0.25;
      house.add(roof);
      
      // Add roof detail - edge trim
      const edgeTrim = new THREE.Mesh(
        new THREE.BoxGeometry(width + 1.4, 0.2, depth + 1.4),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      edgeTrim.position.y = totalHeight + 0.5;
      house.add(edgeTrim);
      
    } else if (roofStyle === 'pitched') {
      // Create a proper pitched roof using geometry
      const roofHeight = 4;
      const roofOverhang = 0.5;
      
      // Create custom geometry for the roof
      const roofGeometry = new THREE.BufferGeometry();
      
      // Define vertices
      const vertices = new Float32Array([
        // Left slope
        -width/2 - roofOverhang, totalHeight, -depth/2 - roofOverhang,
        width/2 + roofOverhang, totalHeight, -depth/2 - roofOverhang,
        0, totalHeight + roofHeight, -depth/2,
        
        -width/2 - roofOverhang, totalHeight, depth/2 + roofOverhang,
        width/2 + roofOverhang, totalHeight, depth/2 + roofOverhang,
        0, totalHeight + roofHeight, depth/2,
      ]);
      
      // Define indices
      const indices = [
        0, 1, 2, // front slope
        3, 5, 4, // back slope
        0, 2, 5, // left side
        0, 5, 3, // left side
        1, 4, 2, // right side
        4, 5, 2  // right side
      ];
      
      roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      roofGeometry.setIndex(indices);
      roofGeometry.computeVertexNormals();
      
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.castShadow = true;
      house.add(roof);
      
      // Add roof texture details
      if (materials === 'classic' || materials === 'luxury') {
        // Add roof tiles
        const tileSize = 0.5;
        const roofWidth = width + roofOverhang * 2;
        const tilesPerRow = Math.ceil(roofWidth / tileSize);
        
        const tileGeometry = new THREE.BoxGeometry(tileSize, 0.05, tileSize);
        const tileMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x222222,
          roughness: 0.9
        });
        
        const tiles = new THREE.Group();
        
        // Only add a few tiles for better performance
        for (let i = 0; i < 8; i++) {
          const tile = new THREE.Mesh(tileGeometry, tileMaterial);
          tile.position.set(
            -width/2 + Math.random() * width,
            totalHeight + 0.05 + Math.random() * 0.5,
            -depth/2 + Math.random() * depth
          );
          
          // Align to roof slope
          const roofCenterX = tile.position.x;
          const roofProgress = Math.abs(roofCenterX) / (width/2);
          const heightAtPoint = roofHeight * (1 - roofProgress);
          tile.position.y = totalHeight + heightAtPoint * 0.5;
          
          tile.rotation.x = Math.PI * 0.25;
          tiles.add(tile);
        }
        
        house.add(tiles);
      }
      
    } else {
      // Modern sloped roof
      const roofHeight = 2;
      
      // Main flat section
      const flatRoof = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.7, 0.3, depth),
        roofMaterial
      );
      flatRoof.position.y = totalHeight + 0.15;
      house.add(flatRoof);
      
      // Sloped sections
      const leftSlopeGeo = new THREE.BufferGeometry();
      
      // Define vertices for left slope
      const leftVertices = new Float32Array([
        -width/2 - 0.5, totalHeight, -depth/2 - 0.5,
        -width*0.35, totalHeight + 0.3, -depth/2 - 0.5,
        -width*0.35, totalHeight + 0.3, depth/2 + 0.5,
        -width/2 - 0.5, totalHeight, depth/2 + 0.5
      ]);
      
      // Define indices for triangles
      const leftIndices = [
        0, 1, 2,
        0, 2, 3
      ];
      
      leftSlopeGeo.setAttribute('position', new THREE.BufferAttribute(leftVertices, 3));
      leftSlopeGeo.setIndex(leftIndices);
      leftSlopeGeo.computeVertexNormals();
      
      const leftSlope = new THREE.Mesh(leftSlopeGeo, roofMaterial);
      leftSlope.castShadow = true;
      house.add(leftSlope);
      
      // Right slope (mirror of left)
      const rightSlope = leftSlope.clone();
      rightSlope.scale.x = -1;
      house.add(rightSlope);
    }
  };
  
  const buildGarage = () => {
    const house = houseRef.current;
    if (!house) return;
    
    const garageWidth = 5;
    const garageDepth = depth * 0.8;
    const garageHeight = 3.5;
    
    const garageMaterial = materialRefs.current.wall;
    const accentMaterial = materialRefs.current.accent;
    
    // Garage position (offset to the left side of the house)
    const garageX = -width/2 - garageWidth/2 - 1;
    const garageZ = 0;
    
    // Garage walls
    const garageBase = new THREE.Mesh(
      new THREE.BoxGeometry(garageWidth, garageHeight, garageDepth),
      garageMaterial
    );
    garageBase.position.set(garageX, garageHeight/2, garageZ);
    garageBase.castShadow = true;
    garageBase.receiveShadow = true;
    house.add(garageBase);
    
    // Garage roof
    const garageRoof = new THREE.Mesh(
      new THREE.BoxGeometry(garageWidth + 0.5, 0.3, garageDepth + 0.5),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    garageRoof.position.set(garageX, garageHeight + 0.15, garageZ);
    garageRoof.castShadow = true;
    house.add(garageRoof);
    
    // Garage door
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x646464,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const garageDoor = new THREE.Mesh(
      new THREE.BoxGeometry(4, 3, 0.1),
      doorMaterial
    );
    garageDoor.position.set(garageX, 1.5, garageZ + garageDepth/2 + 0.05);
    house.add(garageDoor);
    
    // Garage door details
    for (let i = 0; i < 3; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.7, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x5a5a5a })
      );
      panel.position.set(garageX - 1 + i * 1.3, 2.3, garageZ + garageDepth/2 + 0.11);
      house.add(panel);
      
      const bottomPanel = panel.clone();
      bottomPanel.position.y = 1.4;
      house.add(bottomPanel);
      
      const lowestPanel = panel.clone();
      lowestPanel.position.y = 0.5;
      house.add(lowestPanel);
    }
    
    // Connection between house and garage
    const connection = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3.5, 3),
      garageMaterial
    );
    connection.position.set(garageX + garageWidth/2 + 0.5, 1.75, garageZ);
    house.add(connection);
    
    // Connection roof
    const connRoof = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.2, 3.3),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    connRoof.position.set(garageX + garageWidth/2 + 0.5, 3.6, garageZ);
    house.add(connRoof);
    
    // Driveway
    const driveway = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 10),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 })
    );
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(garageX, 0.01, garageZ + garageDepth/2 + 5);
    house.add(driveway);
  };
  
  const addLandscaping = () => {
    const house = houseRef.current;
    const scene = sceneRef.current;
    if (!house || !scene) return;
    
    // Clear existing landscaping
    const existingLandscaping = [];
    scene.traverse(object => {
      if (object.userData.landscaping) {
        existingLandscaping.push(object);
      }
    });
    existingLandscaping.forEach(item => scene.remove(item));
    
    // Add some trees
    const treePositions = [
      { x: width/2 + 5, z: depth/2 + 2 },
      { x: -width/2 - 5, z: depth/2 + 3 },
      { x: width/2 + 4, z: -depth/2 - 3 },
      { x: -width/2 - 4, z: -depth/2 - 2 }
    ];
    
    if (landscaping === 'modern') {
      // Modern minimalist landscaping
      
      treePositions.forEach(pos => {
        // Modern landscaping uses geometric shapes for trees
        
        // Tree trunk
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.3, 3, 8),
          new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 })
        );
        trunk.position.set(pos.x, 1.5, pos.z);
        trunk.castShadow = true;
        trunk.userData.landscaping = true;
        scene.add(trunk);
        
        // Foliage - cube or sphere
        if (Math.random() > 0.5) {
          const foliage = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 })
          );
          foliage.position.set(pos.x, 3, pos.z);
          foliage.castShadow = true;
          foliage.userData.landscaping = true;
          scene.add(foliage);
        } else {
          const foliage = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 })
          );
          foliage.position.set(pos.x, 3, pos.z);
          foliage.castShadow = true;
          foliage.userData.landscaping = true;
          scene.add(foliage);
        }
        
        // Add planters
        const planter = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.8, 1.5),
          new THREE.MeshStandardMaterial({ color: 0x9E9E9E })
        );
        planter.position.set(pos.x, 0.4, pos.z);
        planter.userData.landscaping = true;
        scene.add(planter);
      });
      
      // Add some decorative rocks
      for (let i = 0; i < 10; i++) {
        const size = 0.2 + Math.random() * 0.4;
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(size, 0),
          new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.9 })
        );
        
        // Position rocks around the house perimeter
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        rock.position.set(x, size/2, z);
        rock.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.userData.landscaping = true;
        scene.add(rock);
      }
    } else if (landscaping === 'desert') {
      // Desert landscaping with cacti and rocks
      
      treePositions.forEach(pos => {
        // Create a cactus
        const cactusBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.5, 2.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 })
        );
        cactusBase.position.set(pos.x, 1.25, pos.z);
        cactusBase.castShadow = true;
        cactusBase.userData.landscaping = true;
        scene.add(cactusBase);
        
        // Add cactus arms
        if (Math.random() > 0.3) {
          const arm1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8),
            new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 })
          );
          arm1.position.set(pos.x + 0.5, 1.8, pos.z);
          arm1.rotation.z = Math.PI / 4;
          arm1.castShadow = true;
          arm1.userData.landscaping = true;
          scene.add(arm1);
        }
        
        if (Math.random() > 0.3) {
          const arm2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8),
            new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 })
          );
          arm2.position.set(pos.x - 0.4, 1.5, pos.z);
          arm2.rotation.z = -Math.PI / 5;
          arm2.castShadow = true;
          arm2.userData.landscaping = true;
          scene.add(arm2);
        }
        
        // Desert rock formations
        for (let i = 0; i < 3; i++) {
          const size = 0.3 + Math.random() * 0.5;
          const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(size, 0),
            new THREE.MeshStandardMaterial({ 
              color: 0xA86C5D, 
              roughness: 0.9 
            })
          );
          
          rock.position.set(
            pos.x + (-1 + Math.random() * 2),
            size/2,
            pos.z + (-1 + Math.random() * 2)
          );
          rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          rock.castShadow = true;
          rock.userData.landscaping = true;
          scene.add(rock);
        }
      });
      
      // Add some desert ground cover
      for (let i = 0; i < 15; i++) {
        const size = 1 + Math.random() * 2;
        const sandPatch = new THREE.Mesh(
          new THREE.CircleGeometry(size, 8),
          new THREE.MeshStandardMaterial({ 
            color: 0xE0C9A6, 
            roughness: 1.0 
          })
        );
        
        // Position sand patches around the house
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        sandPatch.position.set(x, 0.02, z);
        sandPatch.rotation.x = -Math.PI / 2;
        sandPatch.userData.landscaping = true;
        scene.add(sandPatch);
      }
    } else {
      // Classic landscaping with trees and bushes
      
      treePositions.forEach(pos => {
        // Tree trunk
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.35, 4, 8),
          new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 })
        );
        trunk.position.set(pos.x, 2, pos.z);
        trunk.castShadow = true;
        trunk.userData.landscaping = true;
        scene.add(trunk);
        
        // Tree foliage - multiple layers
        for (let i = 0; i < 3; i++) {
          const size = 2.5 - i * 0.5;
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(size, 2, 8),
            new THREE.MeshStandardMaterial({ 
              color: 0x2E7D32, 
              roughness: 0.8 
            })
          );
          foliage.position.set(pos.x, 3 + i * 1.5, pos.z);
          foliage.castShadow = true;
          foliage.userData.landscaping = true;
          scene.add(foliage);
        }
      });
      
      // Add some bushes around the house
      const bushPositions = [
        { x: width/4, z: depth/2 + 1 },
        { x: -width/4, z: depth/2 + 1 },
        { x: width/2 + 1, z: 0 },
        { x: -width/2 - 1, z: 0 }
      ];
      
      bushPositions.forEach(pos => {
        const bush = new THREE.Mesh(
          new THREE.SphereGeometry(1, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x388E3C, roughness: 0.8 })
        );
        bush.position.set(pos.x, 0.5, pos.z);
        bush.scale.y = 0.7;
        bush.castShadow = true;
        bush.userData.landscaping = true;
        scene.add(bush);
      });
      
      // Add flower beds
      for (let i = 0; i < 5; i++) {
        const flowerBed = new THREE.Mesh(
          new THREE.CircleGeometry(1 + Math.random(), 8),
          new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 1.0 })
        );
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        flowerBed.position.set(x, 0.02, z);
        flowerBed.rotation.x = -Math.PI / 2;
        flowerBed.userData.landscaping = true;
        scene.add(flowerBed);
        
        // Add flowers
        const flowerColors = [0xFF5722, 0xE91E63, 0xFFC107, 0x9C27B0, 0xFFEB3B];
        
        for (let j = 0; j < 5; j++) {
          const flower = new THREE.Group();
          
          // Stem
          const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
            new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
          );
          stem.position.y = 0.2;
          flower.add(stem);
          
          // Bloom
          const bloom = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            new THREE.MeshStandardMaterial({ 
              color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
              roughness: 0.5 
            })
          );
          bloom.position.y = 0.45;
          flower.add(bloom);
          
          // Position within flower bed
          const flowerAngle = Math.random() * Math.PI * 2;
          const flowerRadius = Math.random() * 0.7;
          const flowerX = x + Math.cos(flowerAngle) * flowerRadius;
          const flowerZ = z + Math.sin(flowerAngle) * flowerRadius;
          
          flower.position.set(flowerX, 0, flowerZ);
          flower.userData.landscaping = true;
          scene.add(flower);
        }
      }
    }
  };
  
  const addPool = () => {
    const house = houseRef.current;
    if (!house) return;
    
    const poolWidth = 6;
    const poolLength = 10;
    const poolDepth = 2;
    
    // Position the pool in the backyard
    const poolX = 0;
    const poolY = -poolDepth / 2;
    const poolZ = -depth - poolLength/2 - 3;
    
    // Pool water material
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4FC3F7,
      transmission: 0.9,
      metalness: 0.0,
      roughness: 0.1,
      ior: 1.4,
      transparent: true,
      opacity: 0.8
    });
    
    // Pool interior material
    const poolInteriorMaterial = new THREE.MeshStandardMaterial({
      color: 0xB3E5FC,
      roughness: 0.7
    });
    
    // Pool surround material
    const surroundMaterial = new THREE.MeshStandardMaterial({
      color: 0xE0E0E0,
      roughness: 0.9
    });
    
    // Create pool surround
    const surround = new THREE.Mesh(
      new THREE.BoxGeometry(poolWidth + 2, 0.3, poolLength + 2),
      surroundMaterial
    );
    surround.position.set(poolX, -0.1, poolZ);
    surround.receiveShadow = true;
    house.add(surround);
    
    // Create pool interior
    const poolInterior = new THREE.Mesh(
      new THREE.BoxGeometry(poolWidth, poolDepth, poolLength),
      poolInteriorMaterial
    );
    poolInterior.position.set(poolX, poolY, poolZ);
    house.add(poolInterior);
    
    // Create water surface
    const waterSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(poolWidth - 0.2, poolLength - 0.2),
      waterMaterial
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.set(poolX, 0.05, poolZ);
    house.add(waterSurface);
    
    // Add some pool furniture
    const chairCount = 4;
    for (let i = 0; i < chairCount; i++) {
      // Create lounge chair
      const chair = new THREE.Group();
      
      // Chair frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.1, 2.5),
        new THREE.MeshStandardMaterial({ color: 0x795548 })
      );
      chair.add(frame);
      
      // Chair backrest
      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.8, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x795548 })
      );
      backrest.position.set(0, 0.4, -1.15);
      backrest.rotation.x = Math.PI / 6;
      chair.add(backrest);
      
      // Position chairs around pool
      let chairX, chairZ;
      if (i < 2) {
        // Chairs on one side
        chairX = poolX - poolWidth/2 - 1.5;
        chairZ = poolZ - (i * 3) + 1.5;
      } else {
        // Chairs on the other side
        chairX = poolX + poolWidth/2 + 1.5;
        chairZ = poolZ - ((i-2) * 3) + 1.5;
      }
      
      chair.position.set(chairX, 0.3, chairZ);
      chair.rotation.y = i < 2 ? Math.PI/2 : -Math.PI/2;
      house.add(chair);
    }
    
    // Add pool steps
    const steps = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.3, 0.5),
        poolInteriorMaterial
      );
      step.position.set(0, -i * 0.3 - 0.15, -poolLength/2 + 0.5 + i * 0.5);
      steps.add(step);
    }
    steps.position.set(poolX, 0, poolZ);
    house.add(steps);
  };
  
  const addDetailsAndFurniture = () => {
    const house = houseRef.current;
    if (!house) return;
    
    const floorHeight = 4;
    
    // Interior walls (just for show through windows)
    if (viewMode === 'cutaway') {
      // Only add interior walls in cutaway view
      const interiorMaterial = new THREE.MeshStandardMaterial({
        color: 0xF5F5F5,
        roughness: 0.9,
        side: THREE.DoubleSide
      });
      
      // First floor dividing walls
      const numRooms = rooms.bedrooms + rooms.bathrooms + (rooms.livingRoom ? 1 : 0) + (rooms.kitchen ? 1 : 0);
      const avgRoomWidth = width / Math.ceil(numRooms / 2);
      
      // Simple room dividers
      for (let i = 1; i < Math.ceil(numRooms / 2); i++) {
        const divider = new THREE.Mesh(
          new THREE.PlaneGeometry(depth - 1, floorHeight - 0.3),
          interiorMaterial
        );
        divider.rotation.y = Math.PI / 2;
        divider.position.set(-width/2 + i * avgRoomWidth, floorHeight/2, 0);
        house.add(divider);
      }
      
      // Add some furniture placeholders
      
      // Living room
      if (rooms.livingRoom) {
        // Sofa
        const sofa = new THREE.Mesh(
          new THREE.BoxGeometry(3, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
        );
        sofa.position.set(-width/4, 0.5, depth/4);
        house.add(sofa);
        
        // Coffee table
        const table = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.5, 1),
          new THREE.MeshStandardMaterial({ color: 0x795548 })
        );
        table.position.set(-width/4, 0.25, depth/4 + 1.5);
        house.add(table);
      }
      
      // Kitchen
      if (rooms.kitchen) {
        // Kitchen counter
        const counter = new THREE.Mesh(
          new THREE.BoxGeometry(3, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xBDBDBD })
        );
        counter.position.set(width/4, 0.5, depth/4);
        house.add(counter);
        
        // Kitchen island
        const island = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.8, 1.5),
          new THREE.MeshStandardMaterial({ color: 0xBDBDBD })
        );
        island.position.set(width/4, 0.4, depth/4 - 1.5);
        house.add(island);
      }
    }
    
    // Add chimney if roofStyle is pitched or classic
    if (roofStyle === 'pitched' || materials === 'classic') {
      const chimneyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8D6E63,
        roughness: 0.9
      });
      
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(1, 3, 1),
        chimneyMaterial
      );
      chimney.position.set(width/3, floors * floorHeight + 2, depth/3);
      house.add(chimney);
      
      const chimneyTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.3, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x5D4037 })
      );
      chimneyTop.position.set(width/3, floors * floorHeight + 3.5, depth/3);
      house.add(chimneyTop);
    }
    
    // Add balcony for multi-floor houses
    if (floors > 1) {
      const railingMaterial = new THREE.MeshStandardMaterial({
        color: 0x9E9E9E,
        roughness: 0.7,
        metalness: 0.3
      });
      
      const balconyFloor = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.2, 2),
        new THREE.MeshStandardMaterial({ color: 0xBDBDBD })
      );
      balconyFloor.position.set(width/4, floorHeight, depth/2 + 1);
      house.add(balconyFloor);
      
      // Railings
      const frontRail = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 0.1),
        railingMaterial
      );
      frontRail.position.set(width/4, floorHeight + 0.5, depth/2 + 2);
      house.add(frontRail);
      
      const leftRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 2),
        railingMaterial
      );
      leftRail.position.set(width/4 - 1.5, floorHeight + 0.5, depth/2 + 1);
      house.add(leftRail);
      
      const rightRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 2),
        railingMaterial
      );
      rightRail.position.set(width/4 + 1.5, floorHeight + 0.5, depth/2 + 1);
      house.add(rightRail);
    }
  };
  
  // Effect for resizing camera and renderer
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  initializeScene();
}, []);

return (
  <div style={{ display: 'flex', height: '100vh', background: '#e0f7fa' }}>
    <div style={{ flex: 1, position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#333'
        }}>
          <div>Generating Building... {renderProgress}%</div>
          <div style={{
            width: '80%', height: '10px', background: '#ccc', borderRadius: '5px',
            overflow: 'hidden', marginTop: '10px'
          }}>
            <div style={{
              width: `${renderProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #29b6f6, #0288d1)'
            }} />
          </div>
        </div>
      )}
    </div>

    {/* Control Panel UI */}
    <div style={{
      width: '300px', padding: '20px', background: '#ffffffee', overflowY: 'auto',
      boxShadow: '0 0 20px rgba(0,0,0,0.15)', backdropFilter: 'blur(6px)'
    }}>
      <h2 style={{ color: '#00796B', marginBottom: '10px' }}>🏡 Building Planner</h2>
      
      {/* Just a few sample controls shown */}
      <div>
        <label>Floors</label>
        <input type="number" min="1" max="5" value={floors} onChange={(e) => setFloors(+e.target.value)} />
      </div>
      <div>
        <label>Width</label>
        <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
      </div>
      <div>
        <label>Depth</label>
        <input type="number" value={depth} onChange={(e) => setDepth(+e.target.value)} />
      </div>
      <div>
        <label>Wall Color</label>
        <input type="color" value={wallColor} onChange={(e) => setWallColor(e.target.value)} />
      </div>
      <div>
        <label>Accent Color</label>
        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
      </div>
      <div>
        <label>Time of Day</label>
        <select value={timeOfDay} onChange={(e) => {
          setTimeOfDay(e.target.value);
          setupLighting(e.target.value);
        }}>
          <option value="day">Day</option>
          <option value="sunset">Sunset</option>
          <option value="night">Night</option>
        </select>
      </div>

      <button style={{
        marginTop: '20px',
        background: 'linear-gradient(45deg, #00BCD4, #009688)',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem'
      }} onClick={generateHouse}>
        Generate House
      </button>
    </div>
  </div>
);
};

export default ModernHousePlanner;
