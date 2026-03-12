import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const ResonanceRaidersRebuilt = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

  // Player movement state
  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false
  });

  const createScene = () => {
    console.log("Creating 3D scene after game start...");
    
    if (!mountRef.current) {
      console.error("Mount ref not available");
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x40C5D8, 50, 200);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create canvas manually to avoid React DOM issues
    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0A0A2E, 1); // Deep space purple background
    
    // Clear and append
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(canvas);
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    
    console.log("Canvas appended and refs set");

    // FUTURISTIC LIGHTING - Alien world atmosphere
    const ambientLight = new THREE.AmbientLight(0x4A90E2, 0.4); // Cool blue ambient
    scene.add(ambientLight);
    
    // Primary alien sun - cyan tint
    const sunLight = new THREE.DirectionalLight(0x00FFFF, 1.5);
    sunLight.position.set(50, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);
    
    // Secondary rim light - purple
    const rimLight = new THREE.DirectionalLight(0x9932CC, 0.8);
    rimLight.position.set(-30, 40, -20);
    scene.add(rimLight);
    
    // Atmospheric glow
    const hemisphereLight = new THREE.HemisphereLight(0x00FFFF, 0x9932CC, 0.3);
    scene.add(hemisphereLight);

    // ALIEN SKY - Nebula-like atmosphere
    const skyGeo = new THREE.SphereGeometry(300, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ 
      color: 0x1A0D3D, // Deep purple space
      side: THREE.BackSide 
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // ALIEN OCEAN - Glowing liquid surface
    const oceanGeo = new THREE.PlaneGeometry(400, 400, 64, 64);
    const oceanMat = new THREE.MeshLambertMaterial({ 
      color: 0x00CCFF,
      transparent: true,
      opacity: 0.7,
      emissive: 0x003366,
      emissiveIntensity: 0.2
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2;
    scene.add(ocean);

    // ALIEN ISLAND BASE - Crystalline formation
    const islandGeo = new THREE.PlaneGeometry(120, 80, 64, 64);
    const islandMat = new THREE.MeshLambertMaterial({ 
      color: 0x4A90E2,
      emissive: 0x001133,
      emissiveIntensity: 0.1
    });
    
    // Create height variation for natural island shape
    const positionAttribute = islandGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getY(i); // Y becomes Z in plane
      
      // Create organic island boundary
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const maxDistance = 50;
      
      if (distanceFromCenter > maxDistance) {
        positionAttribute.setZ(i, -5); // Below water
      } else {
        // Natural height variation
        const height = (1 - distanceFromCenter / maxDistance) * 3 + Math.random() * 1;
        positionAttribute.setZ(i, height);
      }
    }
    positionAttribute.needsUpdate = true;
    islandGeo.computeVertexNormals();
    
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.rotation.x = -Math.PI / 2;
    island.position.y = 0;
    island.receiveShadow = true;
    scene.add(island);

    // FUTURISTIC CRYSTAL SPIRE CLUSTERS - Alien formations
    const createCrystalCluster = (centerX: number, centerZ: number, mainHeight: number, clusterSize: number) => {
      // Main central crystal spire (tallest and most prominent)
      const mainSpire = new THREE.Mesh(
        new THREE.OctahedronGeometry(4, 3),
        new THREE.MeshLambertMaterial({ 
          color: 0x00CCFF,
          transparent: true,
          opacity: 0.8,
          emissive: 0x0066CC,
          emissiveIntensity: 0.4
        })
      );
      mainSpire.position.set(centerX, mainHeight / 2 + 2, centerZ);
      mainSpire.scale.y = mainHeight / 8; // Stretch to make tall crystal
      mainSpire.castShadow = true;
      mainSpire.userData = { type: 'crystal-spire' };
      scene.add(mainSpire);
      
      // Surrounding crystal spires in cluster formation
      for (let i = 0; i < clusterSize; i++) {
        const angle = (i / clusterSize) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 4 + Math.random() * 6;
        const height = mainHeight * (0.5 + Math.random() * 0.4);
        
        const spire = new THREE.Mesh(
          new THREE.OctahedronGeometry(2, 2),
          new THREE.MeshLambertMaterial({ 
            color: Math.random() > 0.5 ? 0x9932CC : 0x00FFFF, // Purple or cyan
            transparent: true,
            opacity: 0.7,
            emissive: Math.random() > 0.5 ? 0x4A0E4E : 0x003366,
            emissiveIntensity: 0.3
          })
        );
        spire.position.set(
          centerX + Math.cos(angle) * distance,
          height / 2 + 2,
          centerZ + Math.sin(angle) * distance
        );
        spire.scale.y = height / 4; // Stretch to make tall
        spire.rotation.z = (Math.random() - 0.5) * 0.3;
        spire.rotation.x = (Math.random() - 0.5) * 0.2;
        spire.castShadow = true;
        spire.userData = { type: 'crystal-spire' };
        scene.add(spire);
      }
    };

    // MAJOR CRYSTAL CLUSTERS - Futuristic alien formations
    // Left side major cluster
    createCrystalCluster(-35, -20, 40, 8);
    createCrystalCluster(-25, -30, 35, 6);
    
    // Right side major cluster  
    createCrystalCluster(35, -20, 42, 8);
    createCrystalCluster(25, -30, 38, 7);
    
    // Upper clusters
    createCrystalCluster(-20, 20, 25, 5);
    createCrystalCluster(20, 25, 28, 6);
    
    // Central area formations
    createCrystalCluster(-10, 0, 20, 4);
    createCrystalCluster(15, 5, 22, 4);
    
    // Perimeter formations
    createCrystalCluster(-40, 15, 30, 5);
    createCrystalCluster(40, 15, 32, 5);
    createCrystalCluster(0, -35, 18, 3);
    createCrystalCluster(-15, -40, 16, 3);
    createCrystalCluster(15, -40, 16, 3);

    // ALIEN ENERGY POOLS - Glowing liquid formations
    const createEnergyPool = (centerX: number, centerZ: number, width: number) => {
      const poolGeo = new THREE.CircleGeometry(width, 16);
      const poolMat = new THREE.MeshLambertMaterial({ 
        color: 0x00FFFF, // Bright cyan
        transparent: true,
        opacity: 0.8,
        emissive: 0x0066CC,
        emissiveIntensity: 0.5
      });
      const pool = new THREE.Mesh(poolGeo, poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(centerX, 1.5, centerZ);
      pool.userData = { type: 'energy-pool' };
      scene.add(pool);
    };
    
    // Create the alien energy pool system
    createEnergyPool(0, 0, 8);     // Central main pool
    createEnergyPool(-5, 12, 5);   // Northern branch
    createEnergyPool(-2, 18, 4);   // Northern extension
    createEnergyPool(3, -12, 6);   // Southern branch  
    createEnergyPool(8, -20, 4);   // Southern extension
    createEnergyPool(-12, -2, 5);  // Western extension
    createEnergyPool(-18, 5, 4);   // Western tip
    createEnergyPool(12, 2, 5);    // Eastern extension
    createEnergyPool(18, -5, 4);   // Eastern tip

    // VEGETATION CLUSTERS - Dense green patches around rock bases
    const vegetationClusters = [
      { x: -45, z: -25, count: 8 },
      { x: 45, z: -25, count: 8 },
      { x: -15, z: 5, count: 6 },
      { x: 20, z: 10, count: 6 },
      { x: -30, z: 35, count: 5 },
      { x: 15, z: 40, count: 5 },
      { x: -50, z: 15, count: 7 },
      { x: 30, z: -5, count: 6 }
    ];

    vegetationClusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = (i / cluster.count) * Math.PI * 2 + Math.random();
        const distance = 3 + Math.random() * 6;
        
        const foliage = new THREE.Mesh(
          new THREE.SphereGeometry(1.5 + Math.random() * 1, 8, 6),
          new THREE.MeshLambertMaterial({ color: 0x228B22 })
        );
        foliage.position.set(
          cluster.x + Math.cos(angle) * distance,
          2 + Math.random() * 0.5,
          cluster.z + Math.sin(angle) * distance
        );
        foliage.scale.set(1, 0.8 + Math.random() * 0.4, 1);
        foliage.castShadow = true;
        scene.add(foliage);
      }
    });

    // FLUFFY WHITE CLOUDS - Matching reference atmosphere
    for (let i = 0; i < 15; i++) {
      const cloudGeo = new THREE.SphereGeometry(10 + Math.random() * 8, 8, 6);
      const cloudMat = new THREE.MeshLambertMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.85
      });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      
      const angle = (i / 15) * Math.PI * 2;
      cloud.position.set(
        Math.cos(angle) * (120 + Math.random() * 50),
        50 + Math.random() * 25,
        Math.sin(angle) * (120 + Math.random() * 50)
      );
      cloud.scale.set(1.2 + Math.random(), 0.6 + Math.random() * 0.4, 1.2 + Math.random());
      scene.add(cloud);
    }

    // PLAYER CHARACTER
    const playerGeo = new THREE.CapsuleGeometry(1, 2, 4, 8);
    const playerMat = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
    const player = new THREE.Mesh(playerGeo, playerMat);
    player.position.set(0, 3, 0);
    player.castShadow = true;
    scene.add(player);
    playerRef.current = player;

    // RESONANCE CRYSTALS - Strategic placement
    const crystalPositions = [
      { x: -35, z: -20, color: 0x9932CC },
      { x: 35, z: -20, color: 0x00CED1 },
      { x: 0, z: 25, color: 0xFF6B35 },
      { x: -20, z: 0, color: 0x9932CC },
      { x: 20, z: 0, color: 0x00CED1 },
      { x: 0, z: -35, color: 0xFF6B35 }
    ];

    crystalPositions.forEach((pos, index) => {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.5),
        new THREE.MeshLambertMaterial({ 
          color: pos.color,
          transparent: true,
          opacity: 0.8,
          emissive: pos.color,
          emissiveIntensity: 0.3
        })
      );
      crystal.position.set(pos.x, 4, pos.z);
      crystal.userData = { type: 'crystal', id: `crystal_${index}` };
      scene.add(crystal);
    });

    // CAMERA SETUP
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    console.log("3D island scene rendered successfully");

    // ANIMATION LOOP
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !playerRef.current) {
        console.log("Missing references, retrying...");
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);

      // Player movement
      const moveSpeed = 0.5;
      if (keysPressed.current.w) playerRef.current.position.z -= moveSpeed;
      if (keysPressed.current.s) playerRef.current.position.z += moveSpeed;
      if (keysPressed.current.a) playerRef.current.position.x -= moveSpeed;
      if (keysPressed.current.d) playerRef.current.position.x += moveSpeed;

      // Camera follows player with smooth offset
      const targetPosition = new THREE.Vector3(
        playerRef.current.position.x,
        playerRef.current.position.y + 12,
        playerRef.current.position.z + 15
      );
      cameraRef.current.position.lerp(targetPosition, 0.05);
      cameraRef.current.lookAt(playerRef.current.position);

      // Animate all futuristic elements
      const time = Date.now() * 0.001;
      sceneRef.current.children.forEach(child => {
        // Crystal resonance crystals
        if (child.userData.type === 'crystal') {
          child.rotation.y += 0.02;
          child.position.y = 4 + Math.sin(time * 2) * 0.5;
        }
        // Crystal spires
        else if (child.userData.type === 'crystal-spire' && child instanceof THREE.Mesh) {
          child.rotation.y += 0.005;
          (child.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
        }
        // Energy pools
        else if (child.userData.type === 'energy-pool' && child instanceof THREE.Mesh) {
          (child.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.3;
        }
        // Energy particles
        else if (child.userData.type === 'energy-particle') {
          child.position.y += Math.sin(time * 2 + child.position.x) * 0.01;
          child.rotation.y += 0.03;
        }
        // Alien plants
        else if (child.userData.type === 'alien-plant' && child instanceof THREE.Mesh) {
          (child.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.3 + Math.sin(time * 1.5 + child.position.x) * 0.2;
          child.scale.y = (0.8 + Math.random() * 0.4) * (1 + Math.sin(time + child.position.z) * 0.1);
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Start animation immediately
    animate();

    console.log("3D scene initialized successfully after game start");
  };

  const startGame = () => {
    setGameStarted(true);
  };

  // Initialize scene after gameStarted changes and DOM is ready
  useEffect(() => {
    if (gameStarted && mountRef.current) {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        createScene();
      }, 100);
    }
  }, [gameStarted]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-cyan-900">
        <div className="text-center space-y-8 p-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            RESONANCE RAIDERS
          </h1>
          <p className="text-xl text-cyan-300 mb-8 max-w-2xl">
            Explore the mystical tropical island world and collect resonance crystals. 
            Navigate through towering rock spires and turquoise lagoons in this alien paradise.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xl rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded">
        <div>Crystals Collected: {crystalsCollected}/6</div>
        <div className="text-sm mt-2">
          Use WASD to move around the island
        </div>
      </div>
    </div>
  );
};

export default ResonanceRaidersRebuilt;