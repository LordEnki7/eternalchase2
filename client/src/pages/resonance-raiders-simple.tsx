import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Link } from 'wouter';

export default function ResonanceRaidersSimple() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('Creating simple Three.js scene...');

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    
    // Add canvas to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Create a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    console.log('Simple scene created successfully');

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Resonance Raiders - Simple Test</h1>
          <Link href="/">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Back to Main
            </button>
          </Link>
        </div>
        
        <div className="flex justify-center">
          <div 
            ref={mountRef} 
            className="border-2 border-white/20 rounded-lg"
            style={{ width: '800px', height: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}