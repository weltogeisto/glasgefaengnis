"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { glasGuete } from "@/lib/webgl";

/**
 * Die Scheibe, echt.
 *
 * Im Fellowship OS ist `@react-three/postprocessing` als Abhängigkeit
 * eingetragen und wird an keiner einzigen Stelle importiert; Bloom und
 * Vignette sind dort mit einem CSS-Radialverlauf nachgebaut. Und ein
 * `MeshTransmissionMaterial` gibt es im ganzen Projekt nicht — in diesem
 * Universum ist noch nie Glas gerendert worden.
 *
 * Hier steht das erste. Es ist Zugabe: fällt WebGL aus, ist `Scheibe.tsx` die
 * Zelle, und sie ist es vollständig.
 */

const GUETE = {
  hoch: { aufloesung: 512, abtastung: 8, splitter: 26, dpr: [1, 2] as [number, number] },
  mittel: { aufloesung: 256, abtastung: 4, splitter: 16, dpr: [1, 1.5] as [number, number] },
  niedrig: { aufloesung: 128, abtastung: 2, splitter: 8, dpr: [1, 1] as [number, number] },
} as const;

/** Er dahinter. Nie ganz aufgelöst — Schulter, Kopf, und darunter die Glut. */
function Gestalt({ ruhig }: { ruhig: boolean }) {
  const gruppe = useRef<THREE.Group>(null);
  const glut = useRef<THREE.PointLight>(null);
  const glutKern = useRef<THREE.Mesh>(null);

  useFrame((zustand) => {
    if (ruhig) return;
    const t = zustand.clock.elapsedTime;
    // Atem. Sonst bewegt sich an ihm nichts.
    if (gruppe.current) gruppe.current.position.y = -0.12 + Math.sin(t * 0.42) * 0.012;
    // Die Glut flackert unregelmäßig, nicht im Takt.
    const flackern = Math.sin(t * 1.7) * 0.5 + Math.sin(t * 0.63) * 0.36;
    if (glut.current) glut.current.intensity = 7 + flackern;
    if (glutKern.current) glutKern.current.scale.setScalar(1 + flackern * 0.05);
  });

  return (
    <group ref={gruppe} position={[0, -0.12, -1.7]}>
      <mesh position={[0, 0.33, 0.02]}>
        <sphereGeometry args={[0.23, 32, 32]} />
        <meshStandardMaterial color="#0d0916" roughness={0.94} metalness={0} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.26, 0.6, 1.05, 32, 1, true]} />
        <meshStandardMaterial color="#0a0714" roughness={1} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Die Glut selbst, nicht nur ihr Licht. Bloom greift sie auf. */}
      <mesh ref={glutKern} position={[0, -0.62, 0.18]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshBasicMaterial color="#c8501f" toneMapped={false} />
      </mesh>

      {/* Rote Glut, tief. Sie beleuchtet ihn von unten und sonst nichts. */}
      <pointLight ref={glut} position={[0, -0.58, 0.3]} color="#c8501f" intensity={7} distance={4.2} />
      {/* Schwarzviolette Aura. */}
      <pointLight position={[0, 0.3, -0.7]} color="#4c1d95" intensity={6} distance={4} />
    </group>
  );
}

export default function GlasCanvas({ stufe, ruhig }: { stufe: 1 | 2 | 3; ruhig: boolean }) {
  const guete = useMemo(() => GUETE[glasGuete()], []);

  return (
    <Canvas
      dpr={guete.dpr}
      camera={{ position: [0, 0, 3.1], fov: 32 }}
      frameloop={ruhig ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
      }}
      data-glas-canvas={stufe}
    >
      <color attach="background" args={["#07060a"]} />
      <fog attach="fog" args={["#07060a", 3.8, 7.2]} />

      <ambientLight intensity={0.2} />
      {/* Streiflicht auf die Kante. Der einzige Grund, warum man die Scheibe sieht. */}
      <directionalLight position={[-2.4, 2.2, 2.6]} intensity={1.7} color="#c4d0f0" />

      <Environment resolution={64} frames={1}>
        <Lightformer intensity={0.9} color="#8fa8d8" position={[-2.2, 1.6, 1.4]} scale={[3, 2, 1]} />
        <Lightformer intensity={0.5} color="#c8a04a" position={[1.8, -1.2, 1.2]} scale={[2, 1.4, 1]} />
      </Environment>

      <Gestalt ruhig={ruhig} />

      {/* Goldene Runensplitter im Dunkel — Kanon, wörtlich. */}
      {!ruhig ? (
        <Sparkles
          count={guete.splitter}
          scale={[1.5, 1.9, 0.7]}
          position={[0, -0.1, -1.05]}
          size={1.5}
          speed={0.14}
          opacity={0.42}
          color="#c8a04a"
        />
      ) : null}

      {/* Die Scheibe selbst. Dicke, Rauheit, Brechung — kein Weichzeichner. */}
      <mesh position={[0, 0, 0.35]}>
        <boxGeometry args={[2.1, 2.6, 0.12]} />
        <MeshTransmissionMaterial
          resolution={guete.aufloesung}
          samples={guete.abtastung}
          transmission={1}
          thickness={0.42}
          roughness={0.14}
          ior={1.46}
          chromaticAberration={0.06}
          anisotropy={0.12}
          distortion={0.16}
          distortionScale={0.28}
          temporalDistortion={ruhig ? 0 : 0.06}
          backside
          color="#dfe6f6"
          attenuationColor="#7d8bb8"
          attenuationDistance={2.4}
        />
      </mesh>


      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={0.7} luminanceThreshold={0.4} luminanceSmoothing={0.55} mipmapBlur />
        <ChromaticAberration offset={[0.0006, 0.0009]} radialModulation modulationOffset={0.4} />
        <Vignette eskil={false} offset={0.16} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
