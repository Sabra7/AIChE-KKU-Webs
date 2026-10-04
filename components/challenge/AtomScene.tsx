'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const PROTON_COLOR = '#8BCB32';
const NEUTRON_COLOR = '#C9D2C2';
const ELECTRON_COLOR = '#F2F6EC';
const ORBIT_COLOR = '#8BCB32';
const PARTICLE_RADIUS = 0.3;
const ELECTRON_RADIUS = 0.13;
const FIRST_SHELL_GAP = 1.4;
const SHELL_SPACING = 1.05;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function nucleusPositions(count: number, seed: number) {
  const random = seededRandom(seed);
  const radius = PARTICLE_RADIUS * 1.15 * Math.cbrt(count);
  const positions: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index++) {
    const depth = Math.cbrt((index + 0.5) / count) * radius;
    const y = 1 - (2 * (index + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    const angle = index * goldenAngle;
    const jitter = (random() - 0.5) * PARTICLE_RADIUS * 0.4;
    positions.push(
      new THREE.Vector3(
        Math.cos(angle) * ring * depth + jitter,
        y * depth + jitter,
        Math.sin(angle) * ring * depth - jitter,
      ),
    );
  }
  return { positions, radius };
}

export default function AtomScene({
  protons,
  neutrons,
  shells,
  onUnavailable,
}: {
  protons: number;
  neutrons: number;
  shells: number[];
  onUnavailable: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onUnavailableRef.current();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    scene.add(new THREE.AmbientLight('#ffffff', 0.55));
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.6);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(PROTON_COLOR, 0.6);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    const atom = new THREE.Group();
    scene.add(atom);

    const particleCount = protons + neutrons;
    const { positions, radius: nucleusRadius } = nucleusPositions(particleCount, protons * 7919);
    const order = positions.map((_, index) => index);
    const random = seededRandom(protons * 104729);
    for (let index = order.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }

    const particleGeometry = new THREE.SphereGeometry(PARTICLE_RADIUS, 24, 16);
    const protonMaterial = new THREE.MeshStandardMaterial({
      color: PROTON_COLOR,
      roughness: 0.35,
      metalness: 0.1,
    });
    const neutronMaterial = new THREE.MeshStandardMaterial({
      color: NEUTRON_COLOR,
      roughness: 0.5,
      metalness: 0.05,
    });
    const protonMesh = new THREE.InstancedMesh(particleGeometry, protonMaterial, protons);
    const neutronMesh = new THREE.InstancedMesh(
      particleGeometry,
      neutronMaterial,
      Math.max(neutrons, 1),
    );
    neutronMesh.count = neutrons;
    const placement = new THREE.Matrix4();
    order.forEach((positionIndex, slot) => {
      placement.setPosition(positions[positionIndex]);
      if (slot < protons) protonMesh.setMatrixAt(slot, placement);
      else neutronMesh.setMatrixAt(slot - protons, placement);
    });
    const nucleus = new THREE.Group();
    nucleus.add(protonMesh, neutronMesh);
    atom.add(nucleus);

    const electronGeometry = new THREE.SphereGeometry(ELECTRON_RADIUS, 16, 12);
    const electronMaterial = new THREE.MeshStandardMaterial({
      color: ELECTRON_COLOR,
      emissive: ELECTRON_COLOR,
      emissiveIntensity: 0.6,
    });
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: ORBIT_COLOR,
      transparent: true,
      opacity: 0.35,
    });

    const shellGroups: { group: THREE.Group; speed: number }[] = [];
    let outerRadius = nucleusRadius;
    shells.forEach((electronCount, shellIndex) => {
      const shellRadius = nucleusRadius + FIRST_SHELL_GAP + shellIndex * SHELL_SPACING;
      outerRadius = shellRadius;
      const tilt = new THREE.Group();
      tilt.rotation.set(
        Math.PI / 2 + (shellIndex % 2 ? 0.45 : -0.35) * (shellIndex / shells.length + 0.4),
        shellIndex * 0.7,
        0,
      );
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(shellRadius, 0.018, 8, 160),
        orbitMaterial,
      );
      tilt.add(ring);
      const spinner = new THREE.Group();
      for (let electron = 0; electron < electronCount; electron++) {
        const angle = (electron / electronCount) * Math.PI * 2;
        const mesh = new THREE.Mesh(electronGeometry, electronMaterial);
        mesh.position.set(Math.cos(angle) * shellRadius, Math.sin(angle) * shellRadius, 0);
        spinner.add(mesh);
      }
      tilt.add(spinner);
      atom.add(tilt);
      shellGroups.push({ group: spinner, speed: 0.9 / (shellIndex + 1) });
    });

    camera.position.set(0, outerRadius * 0.5, outerRadius * 3.1 + 2);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = outerRadius * 1.3;
    controls.maxDistance = outerRadius * 6 + 6;

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;
    const render = () => {
      frameId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      if (!reducedMotion) {
        nucleus.rotation.y += delta * 0.25;
        nucleus.rotation.x += delta * 0.1;
        for (const { group, speed } of shellGroups) group.rotation.z += delta * speed;
        atom.rotation.y += delta * 0.08;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      particleGeometry.dispose();
      electronGeometry.dispose();
      protonMaterial.dispose();
      neutronMaterial.dispose();
      electronMaterial.dispose();
      orbitMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [protons, neutrons, shells]);

  return <div className="atom-scene" ref={containerRef} />;
}
