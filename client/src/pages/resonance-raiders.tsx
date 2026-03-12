import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gamepad2, MapPin, Star, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import StarfieldBackground from '@/components/starfield-background';
import * as THREE from 'three';
const resonanceRaidersLogo = '/media/resonance-raiders-logo.png';
const islandReference = '/media/island-reference.jpg';

// 3D Game constants
const CONTAINER_WIDTH = 1000;
const CONTAINER_HEIGHT = 700;
const PLAYER_HEIGHT = 2;
const PLAYER_SPEED = 0.25;
const WORLD_SIZE = 150;
const ISLAND_RADIUS = 75;
const WATER_LEVEL = -3;
const TERRAIN_HEIGHT = 15;
const ROCK_HEIGHT = 25;
const PALM_HEIGHT = 22;
const CRYSTAL_COUNT = 20;
const WATERFALL_COUNT = 4;

// 3D Game objects
interface GameObject {
  position: THREE.Vector3;
  type: 'resonance-crystal' | 'npc' | 'portal' | 'obstacle' | 'structure' | 'energy-river' | 'zone-marker' | 'crystal-depository';
  id: string;
  collected?: boolean;
  color: string;
  zone?: 'beginner' | 'intermediate' | 'advanced' | 'safe';
  name?: string;
  mesh?: THREE.Mesh;
}

interface Player {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  facing: THREE.Vector3;
  isMoving: boolean;
  mesh?: THREE.Mesh;
}

export default function ResonanceRaiders3D() {
  const { language } = useLanguage();
  const { playCosmicChime, playCyberWhoosh } = useSoundEffects();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Game state
  const [player, setPlayer] = useState<Player>({
    position: new THREE.Vector3(0, 2, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    facing: new THREE.Vector3(0, 0, -1),
    isMoving: false
  });
  
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [resonancePoints, setResonancePoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [crystalsDeposited, setCrystalsDeposited] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [sceneInitialized, setSceneInitialized] = useState(false);

  // Particle system functions
  const createParticleSystem = (scene: THREE.Scene) => {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;     // x
      positions[i + 1] = Math.random() * 50;          // y
      positions[i + 2] = (Math.random() - 0.5) * 200; // z
      
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = Math.random() * 0.01 + 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x88CCFF,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { velocities };
    scene.add(particles);
    
    return particles;
  };

  const updateParticleSystem = (particles: THREE.Points, time: number) => {
    const positions = particles.geometry.attributes.position;
    const velocities = particles.userData.velocities;
    
    for (let i = 0; i < positions.count * 3; i += 3) {
      positions.array[i] += velocities[i];     // x
      positions.array[i + 1] += velocities[i + 1]; // y  
      positions.array[i + 2] += velocities[i + 2]; // z
      
      // Reset particles that go too high
      if (positions.array[i + 1] > 60) {
        positions.array[i + 1] = 0;
        positions.array[i] = (Math.random() - 0.5) * 200;
        positions.array[i + 2] = (Math.random() - 0.5) * 200;
      }
    }
    
    positions.needsUpdate = true;
  };

  // Initialize 3D scene ONLY after game starts
  useEffect(() => {
    if (!gameStarted || !mountRef.current || sceneInitialized) return;
    
    console.log('Creating 3D scene after game start...');
    
    // Create a canvas manually and style it
    const canvas = document.createElement('canvas');
    canvas.width = CONTAINER_WIDTH;
    canvas.height = CONTAINER_HEIGHT;
    canvas.style.display = 'block';
    canvas.style.width = CONTAINER_WIDTH + 'px';
    canvas.style.height = CONTAINER_HEIGHT + 'px';
    canvas.style.border = '2px solid rgba(255,255,255,0.2)';
    canvas.style.borderRadius = '8px';
    
    // Clear mount and add canvas directly
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(canvas);
    
    // Create Three.js context with the manual canvas
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    const camera = new THREE.PerspectiveCamera(75, CONTAINER_WIDTH / CONTAINER_HEIGHT, 0.1, 1000);
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      antialias: true 
    });
    renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);
    renderer.shadowMap.enabled = true;
    
    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    
    // Natural lighting system matching reference image
    const ambientLight = new THREE.AmbientLight(0xB8E6FF, 0.6);  // Soft blue-white ambient
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xFFE4B5, 1.8);  // Warm sunlight
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -80;
    sunLight.shadow.camera.right = 80;
    sunLight.shadow.camera.top = 80;
    sunLight.shadow.camera.bottom = -80;
    scene.add(sunLight);
    
    // Sky dome matching reference turquoise sky
    const skyGeo = new THREE.SphereGeometry(200, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ 
      color: 0x40C5D8,  // Turquoise sky color from reference
      side: THREE.BackSide,
      fog: false
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
    
    // Fluffy white clouds like in reference
    for (let i = 0; i < 12; i++) {
      const cloudGeo = new THREE.SphereGeometry(8 + Math.random() * 5, 8, 6);
      const cloudMat = new THREE.MeshLambertMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
      });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      
      const angle = (i / 12) * Math.PI * 2;
      cloud.position.set(
        Math.cos(angle) * (80 + Math.random() * 40),
        40 + Math.random() * 20,
        Math.sin(angle) * (80 + Math.random() * 40)
      );
      cloud.scale.set(1 + Math.random(), 0.5 + Math.random() * 0.3, 1 + Math.random());
      scene.add(cloud);
    }
    
    // Enhanced island inspired by reference image
    
    // Deep ocean base
    const oceanGeo = new THREE.PlaneGeometry(200, 200);
    const ocean = new THREE.Mesh(oceanGeo, new THREE.MeshLambertMaterial({ color: 0x006994 }));
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -5;
    scene.add(ocean);

    // Main island base matching reference image - organic sandy beach shape
    const islandShape = new THREE.Shape();
    // Create irregular island outline based on reference
    const points = [
      { x: -45, z: -30 }, { x: -35, z: -40 }, { x: -10, z: -45 },
      { x: 20, z: -40 }, { x: 45, z: -25 }, { x: 50, z: 0 },
      { x: 45, z: 25 }, { x: 30, z: 40 }, { x: 0, z: 45 },
      { x: -25, z: 40 }, { x: -45, z: 20 }, { x: -50, z: -10 }
    ];
    
    islandShape.moveTo(points[0].x, points[0].z);
    for (let i = 1; i < points.length; i++) {
      islandShape.lineTo(points[i].x, points[i].z);
    }
    islandShape.closePath();
    
    const islandGeo = new THREE.ExtrudeGeometry(islandShape, {
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 2,
      bevelSegments: 8
    });
    
    const island = new THREE.Mesh(islandGeo, new THREE.MeshLambertMaterial({ 
      color: 0xE6D7B8  // Sandy beach color from reference
    }));
    island.rotation.x = -Math.PI / 2;
    island.position.y = 0;
    island.receiveShadow = true;
    scene.add(island);

    // Interconnected turquoise lagoons matching reference image
    const lagoons = [
      // Main central lagoon system
      { x: 0, z: 0, radius: 8, color: 0x00CED1 },        // Central lagoon
      { x: -15, z: -5, radius: 5, color: 0x40E0D0 },     // Western branch
      { x: 12, z: -8, radius: 4, color: 0x20B2AA },      // Eastern branch
      { x: -8, z: 15, radius: 6, color: 0x48D1CC },      // Northern branch
      { x: 18, z: 12, radius: 3.5, color: 0x40E0D0 },    // Northeast lagoon
      
      // Smaller connecting pools
      { x: -25, z: 5, radius: 2.5, color: 0x20B2AA },    // Far west
      { x: 25, z: -18, radius: 3, color: 0x00CED1 },     // Far east
      { x: 5, z: 25, radius: 4, color: 0x48D1CC }        // Far north
    ];
    
    lagoons.forEach(lagoon => {
      const lagoonGeo = new THREE.CircleGeometry(lagoon.radius, 32);
      const lagoonMesh = new THREE.Mesh(lagoonGeo, new THREE.MeshLambertMaterial({ 
        color: lagoon.color,
        transparent: true,
        opacity: 0.85
      }));
      lagoonMesh.rotation.x = -Math.PI / 2;
      lagoonMesh.position.set(lagoon.x, 0.1, lagoon.z);
      scene.add(lagoonMesh);
      
      // Enhanced water ripple effects
      const rippleGeo = new THREE.RingGeometry(lagoon.radius, lagoon.radius + 1.5, 16);
      const ripple = new THREE.Mesh(rippleGeo, new THREE.MeshBasicMaterial({
        color: lagoon.color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      }));
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.set(lagoon.x, 0.2, lagoon.z);
      ripple.userData = { type: 'ripple' };
      scene.add(ripple);
    });

    // Dramatic tall rock spires exactly matching reference image
    const rockSpires = [
      // Main cluster left side (dramatic tall spires)
      { x: -35, z: -20, height: 25, radius: 4 },
      { x: -30, z: -15, height: 28, radius: 3.5 },
      { x: -38, z: -25, height: 22, radius: 3 },
      { x: -25, z: -28, height: 20, radius: 2.5 },
      { x: -42, z: -18, height: 24, radius: 3.2 },
      
      // Main cluster right side (dramatic tall spires)
      { x: 30, z: -15, height: 30, radius: 4.5 },
      { x: 35, z: -20, height: 26, radius: 3.8 },
      { x: 25, z: -25, height: 24, radius: 3.2 },
      { x: 40, z: -10, height: 22, radius: 3 },
      { x: 28, z: -30, height: 21, radius: 2.8 },
      
      // Central area spires (medium height)
      { x: -10, z: 5, height: 18, radius: 2.8 },
      { x: 15, z: 8, height: 20, radius: 3.2 },
      { x: 0, z: -10, height: 16, radius: 2.5 },
      { x: -5, z: -5, height: 14, radius: 2.2 },
      
      // Perimeter spires (varied heights)
      { x: -20, z: 30, height: 15, radius: 2.2 },
      { x: 10, z: 35, height: 17, radius: 2.8 },
      { x: 35, z: 20, height: 19, radius: 3 },
      { x: -40, z: 10, height: 21, radius: 3.5 },
      { x: -30, z: 25, height: 16, radius: 2.5 },
      
      // Additional scattered spires creating natural groupings
      { x: -15, z: -35, height: 14, radius: 2 },
      { x: 20, z: -35, height: 16, radius: 2.5 },
      { x: -25, z: 15, height: 12, radius: 2 },
      { x: 5, z: 25, height: 13, radius: 2.3 },
      { x: 45, z: 5, height: 18, radius: 2.7 },
      { x: -45, z: -5, height: 19, radius: 3.1 }
    ];
    
    rockSpires.forEach(spire => {
      // Create tapered spire shape exactly like reference
      const spireGeo = new THREE.ConeGeometry(spire.radius, spire.height, 8);
      const spire3D = new THREE.Mesh(spireGeo, new THREE.MeshLambertMaterial({ 
        color: 0xC4A484  // Exact tan/beige color from reference
      }));
      
      spire3D.position.set(spire.x, spire.height / 2 + 1, spire.z);
      spire3D.castShadow = true;
      spire3D.receiveShadow = true;
      
      // Add slight natural tilt for realism
      spire3D.rotation.x = (Math.random() - 0.5) * 0.08;
      spire3D.rotation.z = (Math.random() - 0.5) * 0.08;
      
      scene.add(spire3D);
      
      // Add rocky base around each spire for natural look
      const baseGeo = new THREE.CylinderGeometry(spire.radius * 1.3, spire.radius * 1.8, 2, 8);
      const base = new THREE.Mesh(baseGeo, new THREE.MeshLambertMaterial({ 
        color: 0xB89968  // Slightly darker base color
      }));
      base.position.set(spire.x, 1, spire.z);
      base.castShadow = true;
      scene.add(base);
    });

    // Lush vegetation clusters around spire bases (matching reference)
    rockSpires.forEach(spire => {
      // Create vegetation clusters around each spire base
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
        const distance = spire.radius * 2 + Math.random() * 3;
        
        // Dense green tropical foliage
        const foliage = new THREE.Mesh(
          new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 8, 6),
          new THREE.MeshLambertMaterial({ color: 0x228B22 })  // Bright green from reference
        );
        foliage.position.set(
          spire.x + Math.cos(angle) * distance,
          1.5 + Math.random() * 0.5,
          spire.z + Math.sin(angle) * distance
        );
        foliage.scale.set(1, 0.7 + Math.random() * 0.3, 1);
        foliage.castShadow = true;
        scene.add(foliage);
      }
    });
    
    // Additional scattered vegetation around lagoons and open areas
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      
      // Skip if too close to lagoons or spires
      let tooClose = false;
      for (const lagoon of lagoons) {
        if (Math.sqrt((x - lagoon.x) ** 2 + (z - lagoon.z) ** 2) < lagoon.radius + 3) {
          tooClose = true;
          break;
        }
      }
      for (const spire of rockSpires) {
        if (Math.sqrt((x - spire.x) ** 2 + (z - spire.z) ** 2) < spire.radius + 4) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        // Tropical tree clusters
        const cluster = new THREE.Mesh(
          new THREE.SphereGeometry(2 + Math.random() * 1.5, 8, 6),
          new THREE.MeshLambertMaterial({ color: 0x1F5F1F })  // Dense green foliage
        );
        cluster.position.set(x, 2 + Math.random(), z);
        cluster.castShadow = true;
        scene.add(cluster);
        
        // Add smaller undergrowth
        for (let j = 0; j < 3; j++) {
          const undergrowth = new THREE.Mesh(
            new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 6, 4),
            new THREE.MeshLambertMaterial({ color: 0x0F4F0F })
          );
          undergrowth.position.set(
            x + (Math.random() - 0.5) * 4,
            0.5,
            z + (Math.random() - 0.5) * 4
          );
          scene.add(undergrowth);
        }
      }
    }
    
    // Waterfalls cascading from rocks
    for (let i = 0; i < WATERFALL_COUNT; i++) {
      const angle = (i / WATERFALL_COUNT) * Math.PI * 2;
      const distance = 18 + Math.random() * 5;
      
      // Waterfall effect using particles
      const waterGeo = new THREE.CylinderGeometry(0.5, 1.2, 12, 8);
      const waterfall = new THREE.Mesh(waterGeo, new THREE.MeshLambertMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.7
      }));
      
      waterfall.position.set(
        Math.cos(angle) * distance,
        6,
        Math.sin(angle) * distance
      );
      
      scene.add(waterfall);
    }

    // Mystical floating islands around main island
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 45 + Math.random() * 15;
      const height = 20 + Math.random() * 10;
      
      const floatingIslandGeo = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6);
      const floatingIsland = new THREE.Mesh(floatingIslandGeo, new THREE.MeshLambertMaterial({ 
        color: 0x8FBC8F 
      }));
      
      floatingIsland.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );
      
      floatingIsland.castShadow = true;
      scene.add(floatingIsland);
      
      // Add crystals on floating islands
      const floatingCrystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(1),
        new THREE.MeshLambertMaterial({ 
          color: 0xFF1493,
          transparent: true,
          opacity: 0.8
        })
      );
      floatingCrystal.position.copy(floatingIsland.position);
      floatingCrystal.position.y += 2;
      floatingCrystal.userData = { type: 'crystal' };
      scene.add(floatingCrystal);
    }

    // Enhanced resonance crystals with varied heights and sizes
    const crystalPositions = [
      { x: -12, z: -8, color: 0x9932CC, size: 2, height: 3 },
      { x: 15, z: -12, color: 0x00CED1, size: 1.5, height: 4 },
      { x: -18, z: 5, color: 0x9932CC, size: 2.5, height: 2 },
      { x: 8, z: 16, color: 0x00CED1, size: 1.8, height: 5 },
      { x: -5, z: -20, color: 0xFF6B35, size: 2.2, height: 3.5 },
      { x: 22, z: 8, color: 0x9932CC, size: 1.6, height: 4.5 },
      { x: -25, z: -15, color: 0x00CED1, size: 2.3, height: 2.8 },
      { x: 0, z: 25, color: 0xFF6B35, size: 3, height: 6 },
      { x: -30, z: 10, color: 0x9932CC, size: 1.4, height: 3.2 },
      { x: 18, z: -25, color: 0x00CED1, size: 2.1, height: 4.8 },
      { x: 12, z: 20, color: 0xFF6B35, size: 1.7, height: 3.7 },
      { x: -8, z: -25, color: 0x9932CC, size: 2.4, height: 5.2 },
      { x: 28, z: -8, color: 0x00CED1, size: 1.9, height: 4.1 },
      { x: -20, z: 22, color: 0xFF6B35, size: 2.6, height: 3.9 },
      { x: 5, z: -18, color: 0x9932CC, size: 1.3, height: 4.6 },
      { x: -15, z: -5, color: 0x00CED1, size: 2.8, height: 2.5 },
      { x: 25, z: 15, color: 0xFF6B35, size: 2.0, height: 5.5 },
      { x: -28, z: -8, color: 0x9932CC, size: 1.5, height: 3.3 },
      { x: 10, z: -30, color: 0x00CED1, size: 2.7, height: 4.4 },
      { x: -5, z: 18, color: 0xFF6B35, size: 1.8, height: 6.2 }
    ];

    crystalPositions.forEach((pos, index) => {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(pos.size, 0),
        new THREE.MeshLambertMaterial({ 
          color: pos.color,
          transparent: true,
          opacity: 0.9,
          emissive: pos.color,
          emissiveIntensity: 0.2
        })
      );
      crystal.position.set(pos.x, pos.height, pos.z);
      crystal.castShadow = true;
      crystal.userData = { type: 'crystal', id: `crystal_${index}` };
      scene.add(crystal);

      // Add mystical glow effect around each crystal
      const glowGeometry = new THREE.SphereGeometry(pos.size * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: pos.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(crystal.position);
      scene.add(glow);
    });
    
    // Initial render
    renderer.render(scene, camera);
    console.log('3D island scene rendered successfully');
    
    // Enhanced animation system with particle effects
    const particleSystem = createParticleSystem(scene);
    
    const animate = () => {
      const time = Date.now() * 0.001;
      
      scene.traverse((obj) => {
        if (obj.userData.type === 'crystal') {
          obj.rotation.y += 0.015;
          obj.rotation.x = Math.sin(time + obj.position.x) * 0.1;
          obj.position.y = obj.position.y + Math.sin(time * 2 + obj.position.x) * 0.05;
        }
      });
      
      // Animate floating islands with gentle bobbing
      scene.children.forEach((child) => {
        if (child.position.y > 15) { // floating islands
          child.rotation.y += 0.002;
          child.position.y += Math.sin(time + child.position.x) * 0.03;
        }
        
        // Animate water ripples
        if (child.userData.type === 'ripple' && child instanceof THREE.Mesh) {
          child.scale.setScalar(1 + Math.sin(time * 3 + child.position.x) * 0.1);
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
          }
        }
      });
      
      // Dynamic lighting effects
      const purpleLight = scene.children.find(child => child instanceof THREE.PointLight && child.color.getHex() === 0x9932CC) as THREE.PointLight;
      const cyanLight = scene.children.find(child => child instanceof THREE.PointLight && child.color.getHex() === 0x00CED1) as THREE.PointLight;
      const orangeLight = scene.children.find(child => child instanceof THREE.PointLight && child.color.getHex() === 0xFF6B35) as THREE.PointLight;
      
      if (purpleLight) {
        purpleLight.intensity = 0.6 + Math.sin(time * 1.5) * 0.4;
        purpleLight.position.y = 15 + Math.sin(time * 0.8) * 3;
      }
      if (cyanLight) {
        cyanLight.intensity = 0.6 + Math.cos(time * 1.2) * 0.4;
        cyanLight.position.y = 15 + Math.cos(time * 0.9) * 3;
      }
      if (orangeLight) {
        orangeLight.intensity = 0.6 + Math.sin(time * 0.7) * 0.4;
        orangeLight.position.y = 20 + Math.sin(time * 1.1) * 4;
      }
      
      // Update particle system
      updateParticleSystem(particleSystem, time);
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    
    setSceneInitialized(true);
    console.log('3D scene initialized successfully after game start');
    
  }, [gameStarted]); // Dependency on gameStarted

  // Movement input handling
  const keys = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateMovement = () => {
    if (!cameraRef.current || !sceneInitialized) return;

    const moveSpeed = 0.4;
    const minDistance = 5;
    const maxDistance = 60;
    
    let moved = false;
    
    if (keys.current.has('KeyW') || keys.current.has('ArrowUp')) {
      cameraRef.current.position.z -= moveSpeed;
      moved = true;
    }
    if (keys.current.has('KeyS') || keys.current.has('ArrowDown')) {
      cameraRef.current.position.z += moveSpeed;
      moved = true;
    }
    if (keys.current.has('KeyA') || keys.current.has('ArrowLeft')) {
      cameraRef.current.position.x -= moveSpeed;
      moved = true;
    }
    if (keys.current.has('KeyD') || keys.current.has('ArrowRight')) {
      cameraRef.current.position.x += moveSpeed;
      moved = true;
    }
    
    // Enhanced movement constraints to keep player on expanded island
    const distanceFromCenter = Math.sqrt(
      cameraRef.current.position.x ** 2 + 
      cameraRef.current.position.z ** 2
    );
    
    if (distanceFromCenter > maxDistance) {
      const ratio = maxDistance / distanceFromCenter;
      cameraRef.current.position.x *= ratio;
      cameraRef.current.position.z *= ratio;
    }
    
    // Dynamic camera height based on terrain
    const terrainHeight = Math.max(0, 25 - distanceFromCenter * 0.3);
    cameraRef.current.position.y = Math.max(15, terrainHeight);
    
    // Add gentle camera sway when moving
    if (moved) {
      const time = Date.now() * 0.001;
      cameraRef.current.position.y += Math.sin(time * 4) * 0.1;
    }
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = () => {
      updateMovement();
      requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  }, [gameStarted, sceneInitialized]);

  // Crystal collection functions
  const collectCrystal = (crystalId: string) => {
    if (collectedItems.has(crystalId)) return;

    const crystal = gameObjects.find(obj => obj.id === crystalId);
    if (crystal && crystal.mesh) {
      sceneRef.current?.remove(crystal.mesh);
      
      setCollectedItems(prev => new Set([...Array.from(prev), crystalId]));
      setResonancePoints(prev => prev + 1);
      setGameObjects(prev => prev.map(obj => 
        obj.id === crystalId ? { ...obj, collected: true } : obj
      ));
      
      playCyberWhoosh();
    }
  };

  const depositCrystal = (depositoryId: string) => {
    if (resonancePoints === 0) return;

    setResonancePoints(prev => prev - 1);
    setCrystalsDeposited(prev => {
      const newCount = prev + 1;
      if (newCount >= 8) {
        setGameComplete(true);
        playCyberWhoosh();
      }
      return newCount;
    });
    
    playCyberWhoosh();
  };

  const content = {
    en: {
      title: "Resonance Raiders 3D",
      subtitle: "Explore the Cosmic Island",
      description: "Navigate through a mysterious 3D island world filled with resonance crystals and ancient mysteries.",
      instructions: "Use WASD keys to move around the island. Collect glowing crystals and deposit them at the golden structures.",
      controls: {
        movement: "Movement: WASD or Arrow Keys",
        collect: "Walk into crystals to collect them",
        deposit: "Walk into golden depositories to deposit crystals"
      },
      stats: {
        crystals: "Crystals",
        points: "Resonance Points",
        deposited: "Crystals Deposited"
      },
      startGame: "Start Game",
      backToYA: "Back to Young Adult",
      gameComplete: "Mission Complete!",
      completeMessage: "You've successfully collected and deposited the resonance crystals!"
    },
    es: {
      title: "Asaltantes de Resonancia 3D", 
      subtitle: "Explora la Isla Cósmica",
      description: "Navega por un misterioso mundo de isla 3D lleno de cristales de resonancia y misterios antiguos.",
      instructions: "Usa las teclas WASD para moverte por la isla. Recoge cristales brillantes y deposítalos en las estructuras doradas.",
      controls: {
        movement: "Movimiento: WASD o Flechas",
        collect: "Camina hacia los cristales para recogerlos",
        deposit: "Camina hacia los depósitos dorados para depositar cristales"
      },
      stats: {
        crystals: "Cristales",
        points: "Puntos de Resonancia",
        deposited: "Cristales Depositados"
      },
      startGame: "Comenzar Juego",
      backToYA: "Volver a Joven Adulto",
      gameComplete: "¡Misión Completa!",
      completeMessage: "¡Has recolectado y depositado exitosamente los cristales de resonancia!"
    }
  };

  const text = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <StarfieldBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/young-adult">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {text.backToYA}
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <img 
              src={resonanceRaidersLogo} 
              alt="Resonance Raiders"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {text.title}
              </h1>
              <p className="text-gray-300 text-lg">{text.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Game Container */}
        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center min-h-[600px] text-center">
            <Card className="bg-black/40 border-cyan-400/20 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-400">{text.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{text.description}</p>
                <p className="text-sm text-gray-400">{text.instructions}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-black/20 p-3 rounded">
                    <Gamepad2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm">{text.controls.movement}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm">{text.controls.collect}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm">{text.controls.deposit}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setGameStarted(true);
                    playCyberWhoosh();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 mt-6"
                >
                  {text.startGame}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <div className="bg-black/40 px-4 py-2 rounded border border-cyan-400/20">
                  <span className="text-cyan-400">{text.stats.crystals}:</span>
                  <span className="ml-2 font-bold">{resonancePoints}</span>
                </div>
                <div className="bg-black/40 px-4 py-2 rounded border border-purple-400/20">
                  <span className="text-purple-400">{text.stats.deposited}:</span>
                  <span className="ml-2 font-bold">{crystalsDeposited}</span>
                </div>
              </div>
            </div>

            {/* 3D Game Container */}
            <div className="flex justify-center">
              <div 
                ref={mountRef}
                className="border border-cyan-400/30 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20"
                style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
              />
            </div>

            {/* Game Complete Message */}
            {gameComplete && (
              <Card className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-green-400/20">
                <CardContent className="text-center py-8">
                  <h2 className="text-3xl font-bold text-green-400 mb-4">{text.gameComplete}</h2>
                  <p className="text-gray-300">{text.completeMessage}</p>
                  <Button 
                    onClick={() => {
                      setGameStarted(false);
                      setGameComplete(false);
                      setResonancePoints(0);
                      setCrystalsDeposited(0);
                      setCollectedItems(new Set());
                    }}
                    className="bg-green-600 hover:bg-green-700 mt-4"
                  >
                    Play Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}