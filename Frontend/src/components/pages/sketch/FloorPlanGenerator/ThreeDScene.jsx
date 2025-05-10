import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const ThreeDScene = ({ rooms, theme, hud }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [viewMode, setViewMode] = useState('default'); // 'default', 'exploded', 'firstPerson'

  // Memoize assets to avoid recreation on component updates
  const textureAssets = useMemo(() => {
    // Base texture paths - in a real app, these would be actual imports
    const baseTexturePaths = {
      wood: '/api/placeholder/512/512',
      carpet: '/api/placeholder/512/512',
      tile: '/api/placeholder/512/512',
      concrete: '/api/placeholder/512/512',
      wallpaper: '/api/placeholder/512/512',
      brick: '/api/placeholder/512/512',
      marble: '/api/placeholder/512/512'
    };
    
    // Textures are loaded in the useEffect to avoid issues
    return baseTexturePaths;
  }, []);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    setLoading(true);
    
    // ----- SCENE SETUP -----
    const scene = new THREE.Scene();
    
    // Set background based on theme
    const backgroundColors = {
      classic: 0xf5f5f5,
      modern: 0xecf0f1,
      warm: 0xfdf6e3
    };
    scene.background = new THREE.Color(backgroundColors[theme] || 0xf5f5f5);
    scene.fog = new THREE.Fog(backgroundColors[theme] || 0xf5f5f5, 60, 100);
    
    // ----- RENDERER SETUP -----
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // ----- CAMERA SETUP -----
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);
    
    // ----- LABEL RENDERER SETUP -----
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(labelRenderer.domElement);
    
    // ----- CONTROLS SETUP -----
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    
    // ----- LIGHTING SETUP -----
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Secondary fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-15, 10, -15);
    scene.add(fillLight);
    
    // ----- TEXTURE LOADING -----
    const textureLoader = new THREE.TextureLoader();
    
    // Load all textures with pattern overlays based on theme
    const loadTextures = () => {
      const themeModifier = {
        classic: { saturation: 1.0, lightness: 1.0 },
        modern: { saturation: 0.8, lightness: 1.1 },
        warm: { saturation: 1.2, lightness: 1.05 }
      }[theme] || { saturation: 1.0, lightness: 1.0 };
      
      // Create a procedural texture - in production, you would use real images
      const createProceduralTexture = (type, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with base color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add patterns based on type
        if (type === 'wood') {
          for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(80, 50, 20, 0.3)`;
            ctx.lineWidth = 1 + Math.random() * 3;
            ctx.moveTo(0, i * 10 + Math.random() * 5);
            ctx.lineTo(512, i * 10 + Math.random() * 20);
            ctx.stroke();
          }
        } else if (type === 'tile') {
          const tileSize = 64;
          for (let x = 0; x < 512; x += tileSize) {
            for (let y = 0; y < 512; y += tileSize) {
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
              ctx.strokeRect(x, y, tileSize, tileSize);
            }
          }
        } else if (type === 'carpet') {
          for (let i = 0; i < 5000; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
            ctx.fillRect(
              Math.random() * 512,
              Math.random() * 512,
              1,
              1
            );
          }
        } else if (type === 'concrete') {
          for (let i = 0; i < 10000; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
            ctx.fillRect(
              Math.random() * 512,
              Math.random() * 512,
              2,
              2
            );
          }
        } else if (type === 'wallpaper') {
          // Striped pattern
          for (let i = 0; i < 50; i++) {
            ctx.fillStyle = i % 2 === 0 ? color : `rgba(255, 255, 255, 0.1)`;
            ctx.fillRect(i * 10, 0, 10, 512);
          }
        } else if (type === 'brick') {
          const brickWidth = 64;
          const brickHeight = 32;
          
          for (let y = 0; y < 512; y += brickHeight) {
            const offset = (Math.floor(y / brickHeight) % 2) * (brickWidth / 2);
            for (let x = -brickWidth/2; x < 512; x += brickWidth) {
              ctx.fillStyle = `rgba(180, 80, 50, 1)`;
              ctx.fillRect(x + offset, y, brickWidth - 2, brickHeight - 2);
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
              ctx.strokeRect(x + offset, y, brickWidth - 2, brickHeight - 2);
            }
          }
        } else if (type === 'marble') {
          // Create a gradient base
          const gradient = ctx.createLinearGradient(0, 0, 512, 512);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, 'white');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          
          // Add veins
          for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
            ctx.lineWidth = 1 + Math.random() * 2;
            
            const startX = Math.random() * 512;
            const startY = Math.random() * 512;
            ctx.moveTo(startX, startY);
            
            let prevX = startX;
            let prevY = startY;
            
            // Create a curvy path
            for (let j = 0; j < 10; j++) {
              const newX = prevX + (Math.random() - 0.5) * 100;
              const newY = prevY + (Math.random() - 0.5) * 100;
              ctx.lineTo(newX, newY);
              prevX = newX;
              prevY = newY;
            }
            ctx.stroke();
          }
        }
        
        return canvas.toDataURL();
      };
      
      // Define materials with theme-appropriate colors
      const themeColors = {
        classic: {
          wall: '#F0E6D2',
          floor: '#D7CCC8',
          livingRoom: '#BBDEFB',
          bedroom: '#D1C4E9',
          kitchen: '#C8E6C9',
          bathroom: '#B2EBF2',
          office: '#FFECB3',
          garage: '#E0E0E0'
        },
        modern: {
          wall: '#ECEFF1',
          floor: '#B0BEC5',
          livingRoom: '#90CAF9',
          bedroom: '#B39DDB',
          kitchen: '#A5D6A7',
          bathroom: '#80DEEA',
          office: '#FFE082',
          garage: '#E0E0E0'
        },
        warm: {
          wall: '#FFE0B2',
          floor: '#D7CCC8',
          livingRoom: '#FFCCBC',
          bedroom: '#E1BEE7',
          kitchen: '#C8E6C9',
          bathroom: '#B2DFDB',
          office: '#FFF9C4',
          garage: '#F5F5F5'
        }
      }[theme] || themeColors.classic;
      
      // Create textures
      const textures = {
        wallTexture: textureLoader.load(createProceduralTexture('wallpaper', themeColors.wall)),
        woodFloorTexture: textureLoader.load(createProceduralTexture('wood', themeColors.floor)),
        tileTexture: textureLoader.load(createProceduralTexture('tile', themeColors.bathroom)),
        carpetTexture: textureLoader.load(createProceduralTexture('carpet', themeColors.bedroom)),
        kitchenFloorTexture: textureLoader.load(createProceduralTexture('tile', themeColors.kitchen)),
        garageFloorTexture: textureLoader.load(createProceduralTexture('concrete', themeColors.garage)),
        brickTexture: textureLoader.load(createProceduralTexture('brick', '#A57164')),
        marbleTexture: textureLoader.load(createProceduralTexture('marble', themeColors.kitchen))
      };
      
      // Configure all textures
      Object.values(textures).forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      });
      
      return textures;
    };
    
    const textures = loadTextures();
    
    // ----- MATERIALS SETUP -----
    const getMaterials = () => {
      const baseColors = {
        classic: {
          wall: 0xf0e6d2,
          floor: 0xd7ccc8,
          ceiling: 0xffffff,
          livingRoom: 0xbbdefb,
          bedroom: 0xd1c4e9,
          kitchen: 0xc8e6c9,
          bathroom: 0xb2ebf2,
          office: 0xffecb3,
          garage: 0xe0e0e0
        },
        modern: {
          wall: 0xeceff1,
          floor: 0xb0bec5,
          ceiling: 0xf5f5f5,
          livingRoom: 0x90caf9,
          bedroom: 0xb39ddb,
          kitchen: 0xa5d6a7,
          bathroom: 0x80deea,
          office: 0xffe082,
          garage: 0xe0e0e0
        },
        warm: {
          wall: 0xffe0b2,
          floor: 0xd7ccc8,
          ceiling: 0xfff8e1,
          livingRoom: 0xffccbc,
          bedroom: 0xe1bee7,
          kitchen: 0xc8e6c9,
          bathroom: 0xb2dfdb,
          office: 0xfff9c4,
          garage: 0xf5f5f5
        }
      };
      
      const colors = baseColors[theme] || baseColors.classic;
      
      return {
        // Structural materials
        wall: new THREE.MeshStandardMaterial({ 
          color: colors.wall, 
          roughness: 0.8, 
          metalness: 0.1,
          map: textures.wallTexture
        }),
        ceiling: new THREE.MeshStandardMaterial({ 
          color: colors.ceiling, 
          roughness: 0.5, 
          metalness: 0.1
        }),
        door: new THREE.MeshStandardMaterial({ 
          color: 0x8d6e63, 
          roughness: 0.7, 
          metalness: 0.1,
          map: textures.woodFloorTexture
        }),
        window: new THREE.MeshStandardMaterial({ 
          color: 0xb3e5fc, 
          roughness: 0.2, 
          metalness: 0.3,
          transparent: true,
          opacity: 0.4
        }),
        
        // Floor materials by room type
        floorMaterials: {
          Living: new THREE.MeshStandardMaterial({ 
            color: colors.livingRoom, 
            roughness: 0.6,
            map: textures.woodFloorTexture
          }),
          Bedroom: new THREE.MeshStandardMaterial({ 
            color: colors.bedroom, 
            roughness: 0.7,
            map: textures.carpetTexture
          }),
          Kitchen: new THREE.MeshStandardMaterial({ 
            color: colors.kitchen, 
            roughness: 0.5,
            map: textures.tileTexture
          }),
          Bathroom: new THREE.MeshStandardMaterial({ 
            color: colors.bathroom, 
            roughness: 0.3,
            map: textures.tileTexture
          }),
          Office: new THREE.MeshStandardMaterial({ 
            color: colors.office, 
            roughness: 0.6,
            map: textures.carpetTexture
          }),
          Garage: new THREE.MeshStandardMaterial({ 
            color: colors.garage, 
            roughness: 0.9,
            map: textures.garageFloorTexture
          }),
          Default: new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0, 
            roughness: 0.7,
            map: textures.woodFloorTexture
          })
        },
        
        // Room visualization materials (semi-transparent)
        roomMaterials: {
          Living: new THREE.MeshStandardMaterial({ 
            color: colors.livingRoom, 
            roughness: 0.6,
            transparent: true,
            opacity: 0.15
          }),
          Bedroom: new THREE.MeshStandardMaterial({ 
            color: colors.bedroom, 
            roughness: 0.7,
            transparent: true,
            opacity: 0.15
          }),
          Kitchen: new THREE.MeshStandardMaterial({ 
            color: colors.kitchen, 
            roughness: 0.5,
            transparent: true,
            opacity: 0.15
          }),
          Bathroom: new THREE.MeshStandardMaterial({ 
            color: colors.bathroom, 
            roughness: 0.3,
            transparent: true,
            opacity: 0.15
          }),
          Office: new THREE.MeshStandardMaterial({ 
            color: colors.office, 
            roughness: 0.6,
            transparent: true,
            opacity: 0.15
          }),
          Garage: new THREE.MeshStandardMaterial({ 
            color: colors.garage, 
            roughness: 0.9,
            transparent: true,
            opacity: 0.15
          }),
          Default: new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0, 
            roughness: 0.7,
            transparent: true,
            opacity: 0.15
          })
        },
        
        // Highlight material for selected rooms
        selectedRoom: new THREE.MeshStandardMaterial({
          color: 0xf57c00,
          roughness: 0.7,
          transparent: true,
          opacity: 0.3
        }),
        
        // Furniture materials
        wood: new THREE.MeshStandardMaterial({ 
          color: 0xa1887f, 
          roughness: 0.8, 
          map: textures.woodFloorTexture 
        }),
        fabric: new THREE.MeshStandardMaterial({ 
          color: 0x90a4ae, 
          roughness: 1.0,
          map: textures.carpetTexture
        }),
        metal: new THREE.MeshStandardMaterial({ 
          color: 0xbdbdbd, 
          roughness: 0.2, 
          metalness: 0.8 
        }),
        ceramic: new THREE.MeshStandardMaterial({ 
          color: 0xeceff1, 
          roughness: 0.1, 
          metalness: 0.2,
          map: textures.marbleTexture
        }),
        
        // Ground materials
        grass: new THREE.MeshStandardMaterial({ 
          color: 0x8bc34a, 
          roughness: 1.0 
        }),
        concrete: new THREE.MeshStandardMaterial({ 
          color: 0x9e9e9e, 
          roughness: 0.9,
          map: textures.garageFloorTexture
        })
      };
    };
    
    const materials = getMaterials();
    
    // ----- FURNITURE FACTORY -----
    const createFurniture = (roomType, position, rotation = 0) => {
      const furnitureGroup = new THREE.Group();
      
      // Position within room
      const offsetX = position.x;
      const offsetY = position.y;
      const offsetZ = position.z;
      
      switch(roomType) {
        case 'Living': {
          // Sofa
          const sofa = new THREE.Group();
          
          // Sofa base
          const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.5, 1),
            materials.fabric
          );
          sofaBase.position.set(0, 0.25, 0);
          sofa.add(sofaBase);
          
          // Sofa back
          const sofaBack = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.8, 0.3),
            materials.fabric
          );
          sofaBack.position.set(0, 0.65, -0.35);
          sofa.add(sofaBack);
          
          // Sofa arms
          const sofaArmLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.7, 1),
            materials.fabric
          );
          sofaArmLeft.position.set(-1.1, 0.35, 0);
          sofa.add(sofaArmLeft);
          
          const sofaArmRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.7, 1),
            materials.fabric
          );
          sofaArmRight.position.set(1.1, 0.35, 0);
          sofa.add(sofaArmRight);
          
          // Coffee table
          const coffeeTable = new THREE.Group();
          
          const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.1, 0.9),
            materials.wood
          );
          tableTop.position.set(0, 0.3, 0);
          coffeeTable.add(tableTop);
          
          // Table legs
          const createTableLeg = (x, z) => {
            const leg = new THREE.Mesh(
              new THREE.BoxGeometry(0.1, 0.3, 0.1),
              materials.wood
            );
            leg.position.set(x, 0.15, z);
            return leg;
          };
          
          coffeeTable.add(createTableLeg(-0.8, -0.35));
          coffeeTable.add(createTableLeg(-0.8, 0.35));
          coffeeTable.add(createTableLeg(0.8, -0.35));
          coffeeTable.add(createTableLeg(0.8, 0.35));
          
          // Position furniture in room
          sofa.position.set(0, 0, 1.5);
          coffeeTable.position.set(0, 0, 0);
          
          // Add to group
          furnitureGroup.add(sofa);
          furnitureGroup.add(coffeeTable);
          break;
        }
        
        case 'Bedroom': {
          // Bed
          const bed = new THREE.Group();
          
          // Bed frame
          const bedFrame = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.3, 2.2),
            materials.wood
          );
          bedFrame.position.set(0, 0.15, 0);
          bed.add(bedFrame);
          
          // Mattress
          const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.2, 2.1),
            materials.fabric
          );
          mattress.position.set(0, 0.4, 0);
          bed.add(mattress);
          
          // Pillow
          const pillow = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.1, 0.4),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
          );
          pillow.position.set(0, 0.55, -0.8);
          bed.add(pillow);
          
          // Nightstand
          const nightstand = new THREE.Group();
          
          const nightstandBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
            materials.wood
          );
          nightstandBody.position.set(0, 0.3, 0);
          nightstand.add(nightstandBody);
          
          const nightstandTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.05, 0.7),
            materials.wood
          );
          nightstandTop.position.set(0, 0.65, 0);
          nightstand.add(nightstandTop);
          
          // Position furniture
          bed.position.set(0, 0, 0);
          nightstand.position.set(-1.2, 0, -0.7);
          
          furnitureGroup.add(bed);
          furnitureGroup.add(nightstand);
          break;
        }
        
        case 'Kitchen': {
          // Kitchen counter
          const counter = new THREE.Group();
          
          // Base cabinets
          const cabinets = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 0.9, 0.6),
            materials.wood
          );
          cabinets.position.set(0, 0.45, 0);
          counter.add(cabinets);
          
          // Countertop
          const countertop = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.05, 0.7),
            materials.ceramic
          );
          countertop.position.set(0, 0.95, 0);
          counter.add(countertop);
          
          // Sink
          const sink = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.1, 0.4),
            materials.metal
          );
          sink.position.set(0.8, 0.95, 0);
          counter.add(sink);
          
          // Kitchen island
          const island = new THREE.Group();
          
          const islandBase = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.9, 0.8),
            materials.wood
          );
          islandBase.position.set(0, 0.45, 0);
          island.add(islandBase);
          
          const islandTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.05, 1),
            materials.ceramic
          );
          islandTop.position.set(0, 0.95, 0);
          island.add(islandTop);
          
          // Position furniture
          counter.position.set(0, 0, -1);
          island.position.set(0, 0, 1);
          
          furnitureGroup.add(counter);
          furnitureGroup.add(island);
          break;
        }
        
        case 'Bathroom': {
          // Toilet
          const toilet = new THREE.Group();
          
          const toiletBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.4, 0.5),
            materials.ceramic
          );
          toiletBase.position.set(0, 0.2, 0);
          toilet.add(toiletBase);
          
          const toiletTank = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.4, 0.2),
            materials.ceramic
          );
          toiletTank.position.set(0, 0.4, -0.35);
          toilet.add(toiletTank);
          
          const toiletSeat = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16, 1, false, 0, Math.PI),
            materials.ceramic
          );
          toiletSeat.rotation.x = Math.PI / 2;
          toiletSeat.position.set(0, 0.45, 0);
          toilet.add(toiletSeat);
          
          // Sink cabinet
          const sink = new THREE.Group();
          
          const sinkCabinet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.5),
            materials.wood
          );
          sinkCabinet.position.set(0, 0.4, 0);
          sink.add(sinkCabinet);
          
          const sinkTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.05, 0.6),
            materials.ceramic
          );
          sinkTop.position.set(0, 0.85, 0);
          sink.add(sinkTop);
          
          const sinkBasin = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16),
            materials.ceramic
          );
          sinkBasin.position.set(0, 0.82, 0);
          sink.add(sinkBasin);
          
          // Shower
          const shower = new THREE.Group();
          
          const showerFloor = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.05, 0.9),
            materials.ceramic
          );
          showerFloor.position.set(0, 0.025, 0);
          shower.add(showerFloor);
          
          const showerWall1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 2, 0.9),
            materials.window
          );
          showerWall1.position.set(0.45, 1, 0);
          shower.add(showerWall1);
          
          const showerWall2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 2, 0.05),
            materials.window
          );
          showerWall2.position.set(0, 1, -0.45);
          shower.add(showerWall2);
          
          // Position elements
          toilet.position.set(-0.5, 0, -0.5);
          sink.position.set(-0.5, 0, 0.6);
          shower.position.set(0.6, 0, 0);
          
          furnitureGroup.add(toilet);
          furnitureGroup.add(sink);
          furnitureGroup.add(shower);
          break;
        }
        
        case 'Office': {
          // Desk
          const desk = new THREE.Group();
          
          const deskTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.05, 0.8),
            materials.wood
          );
          deskTop.position.set(0, 0.75, 0);
          desk.add(deskTop);
          
          // Desk legs
          const createDeskLeg = (x, z) => {
            const leg = new THREE.Mesh(
              new THREE.BoxGeometry(0.08, 0.75, 0.08),
              materials.metal
            );
            leg.position.set(x, 0.375, z);
            return leg;
          };
          
          desk.add(createDeskLeg(-0.7, -0.3));
          desk.add(createDeskLeg(-0.7, 0.3));
          desk.add(createDeskLeg(0.7, -0.3));
          desk.add(createDeskLeg(0.7, 0.3));
          
          // Office chair
          const chair = new THREE.Group();
          
          // Chair seat
          const chairSeat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.5),
            materials.fabric
          );
          chairSeat.position.set(0, 0.5, 0);
          chair.add(chairSeat);
          
          // Chair back
          const chairBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.6, 0.1),
            materials.fabric
          );
          chairBack.position.set(0, 0.8, -0.2);
          chair.add(chairBack);
          
          // Chair base
          const chairBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16),
            materials.metal
          );
          chairBase.position.set(0, 0.05, 0);
          chair.add(chairBase);
          
          // Chair post
          const chairPost = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8),
            materials.metal
          );
          chairPost.position.set(0, 0.25, 0);
          chair.add(chairPost);
          
          // Computer
          const computer = new THREE.Group();
          
          // Monitor
          const monitorStand = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.3, 0.1),
            materials.metal
          );
          monitorStand.position.set(0, 0.15, 0);
          computer.add(monitorStand);
          
          const monitorBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.02, 0.2),
            materials.metal
          );
          monitorBase.position.set(0, 0.01, 0);
          computer.add(monitorBase);
          
          const monitorScreen = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.4, 0.05),
            materials.metal
          );
          monitorScreen.position.set(0, 0.35, 0);
          computer.add(monitorScreen);
          
          const screenSurface = new THREE.Mesh(
            new THREE.PlaneGeometry(0.55, 0.35),
            new THREE.MeshBasicMaterial({ color: 0x333333 })
          );
          screenSurface.position.set(0, 0.35, 0.03);
          computer.add(screenSurface);
          
          // Keyboard
          const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.02, 0.15),
            materials.metal
          );
          keyboard.position.set(0, 0.77, 0.25);
          computer.add(keyboard);
          
          // Position furniture
          desk.position.set(0, 0, -0.2);
          chair.position.set(0, 0, 0.6);
          computer.position.set(0, 0, -0.2);
          
          furnitureGroup.add(desk);
          furnitureGroup.add(chair);
          furnitureGroup.add(computer);
          break;
        }
        
        case 'Garage': {
          // Car placeholder (simplified)
          const car = new THREE.Group();
          
          // Car body
          const carBody = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.5, 4),
            new THREE.MeshStandardMaterial({ color: 0x2196f3, roughness: 0.2, metalness: 0.8 })
          );
          carBody.position.set(0, 0.5, 0);
          car.add(carBody);
          
          // Car top
          const carTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.4, 2),
            new THREE.MeshStandardMaterial({ color: 0x2196f3, roughness: 0.2, metalness: 0.8 })
          );
          carTop.position.set(0, 0.9, -0.5);
          car.add(carTop);
          
          // Car wheels
          const createWheel = (x, z) => {
            const wheel = new THREE.Mesh(
              new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
              new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.9 })
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, 0.3, z);
            return wheel;
          };
          
          car.add(createWheel(-0.9, -1.2));
          car.add(createWheel(0.9, -1.2));
          car.add(createWheel(-0.9, 1.2));
          car.add(createWheel(0.9, 1.2));
          
          // Workbench
          const workbench = new THREE.Group();
          
          const workbenchTop = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.1, 0.8),
            materials.wood
          );
          workbenchTop.position.set(0, 0.9, 0);
          workbench.add(workbenchTop);
          
          const workbenchBase1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.9, 0.7),
            materials.wood
          );
          workbenchBase1.position.set(-0.6, 0.45, 0);
          workbench.add(workbenchBase1);
          
          const workbenchBase2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.9, 0.7),
            materials.wood
          );
          workbenchBase2.position.set(0.6, 0.45, 0);
          workbench.add(workbenchBase2);
          
          // Tools
          const tools = new THREE.Group();
          
          // Tool box
          const toolBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.2, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.7 })
          );
          toolBox.position.set(0, 1.05, 0);
          tools.add(toolBox);
          
          // Position items
          car.position.set(0, 0, 0);
          workbench.position.set(0, 0, -2);
          tools.position.set(-0.6, 0, -2);
          
          furnitureGroup.add(car);
          furnitureGroup.add(workbench);
          furnitureGroup.add(tools);
          break;
        }
        
        default: {
          // Generic furniture - a simple box
          const genericFurniture = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.5, 1),
            materials.wood
          );
          genericFurniture.position.set(0, 0.25, 0);
          furnitureGroup.add(genericFurniture);
        }
      }
      
      // Apply global position and rotation
      furnitureGroup.position.set(offsetX, offsetY, offsetZ);
      furnitureGroup.rotation.y = rotation;
      
      // Add shadows
      furnitureGroup.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      
      return furnitureGroup;
    };
    
    // ----- BUILDING CONSTRUCTION -----
    const buildHouse = () => {
      const buildingGroup = new THREE.Group();
      
      // Ground
      const groundSize = 60;
      const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
      const ground = new THREE.Mesh(groundGeometry, materials.grass);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.02;
      ground.receiveShadow = true;
      buildingGroup.add(ground);
      
      // Driveway and walkways
      const driveway = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 10),
        materials.concrete
      );
      driveway.rotation.x = -Math.PI / 2;
      driveway.position.set(8, 0, 10);
      driveway.receiveShadow = true;
      buildingGroup.add(driveway);
      
      // House foundation
      const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(28, 0.2, 22),
        materials.concrete
      );
      foundation.position.set(0, -0.1, 0);
      foundation.receiveShadow = true;
      buildingGroup.add(foundation);
      
      // Process room data to create the structure
      if (rooms && rooms.length > 0) {
        // Calculate building bounds for centering
        let minX = Infinity;
        let maxX = -Infinity;
        let minZ = Infinity;
        let maxZ = -Infinity;
        
        rooms.forEach(room => {
          const { x, z, width, length } = room;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x + width);
          minZ = Math.min(minZ, z);
          maxZ = Math.max(maxZ, z + length);
        });
        
        const centerX = (minX + maxX) / 2;
        const centerZ = (minZ + maxZ) / 2;
        
        // Create rooms
        rooms.forEach(room => {
          const { id, name, type, x, z, width, length, height = 3, connections = [] } = room;
          
          // Adjust position relative to center
          const adjustedX = x - centerX;
          const adjustedZ = z - centerZ;
          
          // Room container
          const roomGroup = new THREE.Group();
          roomGroup.name = `room-${id}`;
          roomGroup.userData = { roomId: id, roomType: type };
          
          // Room floor
          const floorMaterial = materials.floorMaterials[type] || materials.floorMaterials.Default;
          const floor = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.1, length),
            floorMaterial
          );
          floor.position.set(width/2, 0, length/2);
          floor.receiveShadow = true;
          roomGroup.add(floor);
          
          // Room visualization (for exploded view)
          const roomVisualization = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, length),
            materials.roomMaterials[type] || materials.roomMaterials.Default
          );
          roomVisualization.position.set(width/2, height/2, length/2);
          roomVisualization.visible = viewMode === 'exploded';
          roomVisualization.name = `room-viz-${id}`;
          roomGroup.add(roomVisualization);
          
          // Room ceiling
          const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.1, length),
            materials.ceiling
          );
          ceiling.position.set(width/2, height, length/2);
          ceiling.receiveShadow = true;
          roomGroup.add(ceiling);
          
          // Create walls - avoiding walls where there are connections
          const createWall = (startX, startZ, endX, endZ, isConnectionWall = false) => {
            // Calculate wall dimensions and position
            const wallLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
            const wallRotation = Math.atan2(endZ - startZ, endX - startX);
            
            // Check if this wall segment has a connection
            let hasConnection = false;
            let doorPosition = 0;
            
            if (isConnectionWall) {
              for (const conn of connections) {
                if (conn.wall === 'north' && startZ === 0 && startX <= conn.position && endX >= conn.position) {
                  hasConnection = true;
                  doorPosition = conn.position;
                } else if (conn.wall === 'south' && startZ === length && startX <= conn.position && endX >= conn.position) {
                  hasConnection = true;
                  doorPosition = conn.position;
                } else if (conn.wall === 'east' && startX === width && startZ <= conn.position && endZ >= conn.position) {
                  hasConnection = true;
                  doorPosition = conn.position;
                } else if (conn.wall === 'west' && startX === 0 && startZ <= conn.position && endZ >= conn.position) {
                  hasConnection = true;
                  doorPosition = conn.position;
                }
              }
            }
            
            if (hasConnection) {
              // Create wall segments around the door/connection
              const doorWidth = 1; // Standard door width
              
              // Segment before door
              if (doorPosition - doorWidth/2 > startX || doorPosition - doorWidth/2 > startZ) {
                const segmentLength1 = Math.abs((doorPosition - doorWidth/2) - startX);
                
                if (segmentLength1 > 0.1) { // Only create if there's a meaningful segment
                  const wallSegment1 = new THREE.Mesh(
                    new THREE.BoxGeometry(segmentLength1, height, 0.2),
                    materials.wall
                  );
                  wallSegment1.position.set(
                    startX + segmentLength1/2 * Math.cos(wallRotation),
                    height/2,
                    startZ + segmentLength1/2 * Math.sin(wallRotation)
                  );
                  wallSegment1.rotation.y = wallRotation;
                  wallSegment1.castShadow = true;
                  wallSegment1.receiveShadow = true;
                  roomGroup.add(wallSegment1);
                }
              }
              
              // Door frame
              const doorFrame = new THREE.Mesh(
                new THREE.BoxGeometry(doorWidth, height, 0.2),
                materials.door
              );
              doorFrame.position.set(
                doorPosition - doorWidth/2 + doorWidth/2 * Math.cos(wallRotation),
                height/2,
                (wallRotation === 0 ? startZ : startZ + doorWidth/2 * Math.sin(wallRotation))
              );
              doorFrame.rotation.y = wallRotation;
              roomGroup.add(doorFrame);
              
              // Segment after door
              if (doorPosition + doorWidth/2 < endX || doorPosition + doorWidth/2 < endZ) {
                const segmentLength2 = Math.abs(endX - (doorPosition + doorWidth/2));
                
                if (segmentLength2 > 0.1) { // Only create if there's a meaningful segment
                  const wallSegment2 = new THREE.Mesh(
                    new THREE.BoxGeometry(segmentLength2, height, 0.2),
                    materials.wall
                  );
                  wallSegment2.position.set(
                    doorPosition + doorWidth/2 + segmentLength2/2 * Math.cos(wallRotation),
                    height/2,
                    (wallRotation === 0 ? startZ : doorPosition + doorWidth/2 + segmentLength2/2 * Math.sin(wallRotation))
                  );
                  wallSegment2.rotation.y = wallRotation;
                  wallSegment2.castShadow = true;
                  wallSegment2.receiveShadow = true;
                  roomGroup.add(wallSegment2);
                }
              }
            } else {
              // Create a single full wall
              const wall = new THREE.Mesh(
                new THREE.BoxGeometry(wallLength, height, 0.2),
                materials.wall
              );
              wall.position.set(
                startX + wallLength/2 * Math.cos(wallRotation),
                height/2,
                startZ + wallLength/2 * Math.sin(wallRotation)
              );
              wall.rotation.y = wallRotation;
              wall.castShadow = true;
              wall.receiveShadow = true;
              roomGroup.add(wall);
              
              // Add windows to exterior walls
              if ((startX === 0 || startX === width || startZ === 0 || startZ === length) && wallLength > 3) {
                // Add window in the middle of the wall
                const windowWidth = Math.min(1.5, wallLength * 0.4);
                const windowHeight = 1.2;
                const windowMesh = new THREE.Mesh(
                  new THREE.BoxGeometry(windowWidth, windowHeight, 0.1),
                  materials.window
                );
                windowMesh.position.set(
                  startX + wallLength/2 * Math.cos(wallRotation),
                  height/2 + 0.2,
                  startZ + wallLength/2 * Math.sin(wallRotation)
                );
                windowMesh.rotation.y = wallRotation;
                roomGroup.add(windowMesh);
              }
            }
          };
          
          // Create walls with potential openings for doors
          createWall(0, 0, width, 0, true); // North wall
          createWall(width, 0, width, length, true); // East wall
          createWall(width, length, 0, length, true); // South wall
          createWall(0, length, 0, 0, true); // West wall
          
          // Add room name label
          const roomLabel = document.createElement('div');
          roomLabel.textContent = `${name} (${type})`;
          roomLabel.className = 'room-label';
          roomLabel.style.color = 'white';
          roomLabel.style.padding = '8px';
          roomLabel.style.background = 'rgba(0,0,0,0.5)';
          roomLabel.style.borderRadius = '4px';
          
          const labelObj = new CSS2DObject(roomLabel);
          labelObj.position.set(width/2, height + 0.5, length/2);
          roomGroup.add(labelObj);
          
          // Add simple furniture based on room type
          const furniture = createFurniture(
            type,
            { x: width/2, y: 0, z: length/2 }
          );
          roomGroup.add(furniture);
          
          // Position room
          roomGroup.position.set(adjustedX, 0, adjustedZ);
          
          // Special handling for selected room
          if (id === selectedRoomId) {
            const highlightMesh = new THREE.Mesh(
              new THREE.BoxGeometry(width, height, length),
              materials.selectedRoom
            );
            highlightMesh.position.set(width/2, height/2, length/2);
            highlightMesh.name = `highlight-${id}`;
            roomGroup.add(highlightMesh);
          }
          
          buildingGroup.add(roomGroup);
        });
      }
      
      return buildingGroup;
    };
    
    // ----- BUILD THE SCENE -----
    const building = buildHouse();
    scene.add(building);
    
    // ----- HANDLE VIEWPORT RESIZE -----
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      labelRenderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // ----- ANIMATION LOOP -----
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Render scene
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    
    animate();
    
    // Set up raycaster for room selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleMouseClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the ray
      const intersects = raycaster.intersectObjects(building.children, true);
      
      if (intersects.length > 0) {
        // Find the room by traversing up the parent hierarchy
        let currentObj = intersects[0].object;
        let roomFound = false;
        
        while (currentObj && !roomFound) {
          if (currentObj.name && currentObj.name.startsWith('room-')) {
            roomFound = true;
            const roomId = currentObj.userData.roomId;
            setSelectedRoomId(roomId);
          } else if (currentObj.parent) {
            currentObj = currentObj.parent;
          } else {
            break;
          }
        }
      }
    };
    
    renderer.domElement.addEventListener('click', handleMouseClick);
    
    // Handle viewmode changes
    if (viewMode === 'exploded') {
      // Spread out the rooms
      building.children.forEach((child, index) => {
        if (child.name && child.name.startsWith('room-')) {
          const factor = 1.5;
          child.position.multiplyScalar(factor);
          
          // Make room visualization visible
          child.children.forEach(subchild => {
            if (subchild.name && subchild.name.startsWith('room-viz-')) {
              subchild.visible = true;
            }
          });
        }
      });
    } else if (viewMode === 'firstPerson') {
      // Set camera to eye level in the selected room if available
      if (selectedRoomId) {
        const selectedRoom = building.children.find(
          child => child.name === `room-${selectedRoomId}`
        );
        
        if (selectedRoom) {
          // Position camera inside the room at eye level
          const roomCenter = new THREE.Vector3();
          roomCenter.copy(selectedRoom.position);
          
          // Add offset to place at eye level
          roomCenter.y = 1.7; // Approximate eye height
          
          // Get room dimensions
          let width = 0;
          let length = 0;
          
          selectedRoom.children.forEach(child => {
            if (child.geometry && child.geometry.parameters) {
              const params = child.geometry.parameters;
              if (params.width && params.depth) {
                width = params.width;
                length = params.depth;
              }
            }
          });
          
          // Offset to place inside room
          roomCenter.x += width * 0.3;
          roomCenter.z += length * 0.3;
          
          camera.position.copy(roomCenter);
          
          // Look toward the center of the room
          const lookTarget = new THREE.Vector3(
            selectedRoom.position.x + width/2,
            1.7,
            selectedRoom.position.z + length/2
          );
          camera.lookAt(lookTarget);
          
          // Update controls
          controls.target.copy(lookTarget);
        }
      }
    }
    
    // Clean up
    setLoading(false);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleMouseClick);
      
      // Dispose resources
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
      controls.dispose();
      
      if (containerRef.current && containerRef.current.contains(labelRenderer.domElement)) {
        containerRef.current.removeChild(labelRenderer.domElement);
      }
    };
  }, [rooms, theme, viewMode, selectedRoomId, textureAssets]);
  
  // Component to display HUD information
  const HudDisplay = () => {
    const roomInfo = rooms.find(r => r.id === selectedRoomId);
    
    return (
      <div className="hud-container absolute top-4 left-4 bg-black bg-opacity-70 p-4 rounded text-white max-w-xs">
        <h2 className="text-xl font-bold mb-2">
          {roomInfo ? `${roomInfo.name} (${roomInfo.type})` : 'No room selected'}
        </h2>
        
        {roomInfo && (
          <div className="space-y-2">
            <p>Dimensions: {roomInfo.width}m × {roomInfo.length}m</p>
            <p>Area: {(roomInfo.width * roomInfo.length).toFixed(1)} m²</p>
            <p>Connections: {roomInfo.connections?.length || 0}</p>
          </div>
        )}
        
        <div className="mt-4 flex space-x-2">
          <button 
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setViewMode('default')}
          >
            Default View
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setViewMode('exploded')}
          >
            Exploded View
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-white text-xl">Loading 3D scene...</div>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} className="w-full h-full block" />
          {hud && <HudDisplay />}
        </>
      )}
    </div>
  );
};

export default ThreeDScene;