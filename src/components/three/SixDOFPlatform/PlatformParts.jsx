import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAssemblyProgress, getComponentOffsets } from './PlatformAnimation';
import { getMotionDemoState, applyMotionToGroup } from './MotionDemo';

const BASE_RADIUS = 1.35;
const PLATFORM_RADIUS = 1.05;

const BASE_ANGLES = [
  -Math.PI / 6, Math.PI / 6,
  Math.PI / 2 - Math.PI / 6, Math.PI / 2 + Math.PI / 6,
  -Math.PI / 2 - Math.PI / 6, -Math.PI / 2 + Math.PI / 6,
];

const PLATFORM_ANGLES = [
  -Math.PI / 6 + Math.PI / 12, Math.PI / 6 - Math.PI / 12,
  Math.PI / 2 - Math.PI / 6 + Math.PI / 12, Math.PI / 2 + Math.PI / 6 - Math.PI / 12,
  -Math.PI / 2 - Math.PI / 6 + Math.PI / 12, -Math.PI / 2 + Math.PI / 6 - Math.PI / 12,
];

function createMaterials(isHovered) {
  return {
    matBasePlate: new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.3, metalness: 0.85 }),
    matFrameSteel: new THREE.MeshStandardMaterial({ color: 0x1a1c23, roughness: 0.25, metalness: 0.9 }),
    matCyanTrim: new THREE.MeshStandardMaterial({
      color: 0x00d2ff, roughness: 0.2, metalness: 0.5, emissive: 0x004466, emissiveIntensity: 0.6,
    }),
    matChromePiston: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.12, metalness: 0.98 }),
    matAluminium: new THREE.MeshStandardMaterial({ color: 0xd0d5dd, roughness: 0.22, metalness: 0.92 }),
    matRedAccent: new THREE.MeshStandardMaterial({
      color: isHovered ? 0xff2a33 : 0xe51937,
      roughness: 0.2, metalness: 0.5, emissive: 0x400008, emissiveIntensity: isHovered ? 0.6 : 0.4,
    }),
  };
}

export default function PlatformParts({
  scrollProgress = 0,
  isHovered = false,
  onClickPlatform = () => {},
  reducedQuality = false,
}) {
  const groupRef = useRef();
  const motionGroupRef = useRef();
  const topPlatformRef = useRef();
  const currentProgress = useRef(0);

  const materials = useMemo(() => createMaterials(isHovered), [isHovered]);

  const baseJoints = useMemo(
    () => BASE_ANGLES.map((angle) => new THREE.Vector3(
      BASE_RADIUS * Math.cos(angle), 0.15, BASE_RADIUS * Math.sin(angle),
    )),
    [],
  );

  const platformJointsLocal = useMemo(
    () => PLATFORM_ANGLES.map((angle) => new THREE.Vector3(
      PLATFORM_RADIUS * Math.cos(angle), 0.0, PLATFORM_RADIUS * Math.sin(angle),
    )),
    [],
  );

  const assemblyProgress = getAssemblyProgress(scrollProgress);
  const offsets = getComponentOffsets(assemblyProgress);
  const motionDemo = getMotionDemoState(scrollProgress);

  useFrame((state, delta) => {
    const factor = Math.min(delta * 4.5, 1.0);
    currentProgress.current += (scrollProgress - currentProgress.current) * factor;

    const ap = getAssemblyProgress(currentProgress.current);
    const off = getComponentOffsets(ap);
    const demo = getMotionDemoState(currentProgress.current);
    const time = state.clock.getElapsedTime();

    if (topPlatformRef.current) {
      topPlatformRef.current.position.y = off.topPlatformYOffset;
    }

    if (motionGroupRef.current) {
      if (demo.activeDof && demo.motion) {
        applyMotionToGroup(motionGroupRef.current, demo.motion, demo.blend, time);
      } else if (ap > 0.95) {
        motionGroupRef.current.rotation.y = Math.sin(time * 0.3) * 0.04;
        motionGroupRef.current.rotation.x = 0;
        motionGroupRef.current.rotation.z = 0;
        motionGroupRef.current.position.set(0, Math.sin(time * 1.2) * 0.012, 0);
      } else {
        motionGroupRef.current.rotation.y = (1 - ap) * 0.12;
        motionGroupRef.current.rotation.x = 0;
        motionGroupRef.current.rotation.z = 0;
        motionGroupRef.current.position.set(0, 0, 0);
      }
    }

    if (groupRef.current && ap <= 0.95 && !demo.activeDof) {
      groupRef.current.rotation.y = (1 - ap) * 0.1;
    } else if (groupRef.current && !demo.activeDof) {
      groupRef.current.rotation.y = 0;
    }
  });

  const { matBasePlate, matFrameSteel, matCyanTrim, matChromePiston, matAluminium, matRedAccent } = materials;

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} onClick={onClickPlatform}>
      <group ref={motionGroupRef}>
        {/* Ground base frame — fixed */}
        <group name="GroundBaseFrame">
          <mesh position={[0, 0.08, 0]} receiveShadow={!reducedQuality} castShadow={!reducedQuality} material={matBasePlate}>
            <cylinderGeometry args={[BASE_RADIUS + 0.15, BASE_RADIUS + 0.22, 0.14, 6]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} receiveShadow material={matCyanTrim}>
            <cylinderGeometry args={[BASE_RADIUS + 0.17, BASE_RADIUS + 0.17, 0.02, 6]} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={`beam-${i}`}
              position={[0, 0.12, 0]}
              rotation={[0, (i * Math.PI) / 3, 0]}
              castShadow={!reducedQuality}
              material={matFrameSteel}
            >
              <boxGeometry args={[0.22, 0.10, (BASE_RADIUS + 0.12) * 2]} />
            </mesh>
          ))}
          {[0, 1, 2].map((i) => {
            const angle = (i * Math.PI * 2) / 3 + Math.PI / 6;
            const fx = (BASE_RADIUS + 0.18) * Math.cos(angle);
            const fz = (BASE_RADIUS + 0.18) * Math.sin(angle);
            return (
              <group key={`foot-${i}`} position={[fx, 0.02, fz]}>
                <mesh castShadow={!reducedQuality} material={matBasePlate}>
                  <cylinderGeometry args={[0.16, 0.2, 0.08, 16]} />
                </mesh>
                <mesh position={[0, 0.05, 0]} material={matCyanTrim}>
                  <cylinderGeometry args={[0.17, 0.17, 0.015, 16]} />
                </mesh>
              </group>
            );
          })}
          <mesh position={[0, 0.16, 0]} material={matFrameSteel}>
            <cylinderGeometry args={[0.42, 0.45, 0.06, 6]} />
          </mesh>
          <mesh position={[0, 0.195, 0]} material={matCyanTrim}>
            <boxGeometry args={[0.3, 0.01, 0.3]} />
          </mesh>
        </group>

        {/* Motor electronics enclosures */}
        <group name="MotorElectronicsStage">
          {[0, 1, 2].map((i) => {
            const angle = (i * Math.PI * 2) / 3;
            const rad = BASE_RADIUS + 0.35 + offsets.motorRadOffset;
            const mx = rad * Math.cos(angle);
            const mz = rad * Math.sin(angle);
            return (
              <group key={`motor-box-${i}`} position={[mx, 0.32, mz]} rotation={[0, -angle + Math.PI / 2, 0]}>
                <mesh castShadow={!reducedQuality} material={matFrameSteel}>
                  <boxGeometry args={[0.55, 0.45, 0.38]} />
                </mesh>
                <mesh position={[0, 0, 0.195]} material={matCyanTrim}>
                  <boxGeometry args={[0.51, 0.41, 0.02]} />
                </mesh>
                <mesh position={[-0.28, 0, 0]} material={matBasePlate}>
                  <boxGeometry args={[0.03, 0.38, 0.32]} />
                </mesh>
                <mesh position={[0.2, 0.15, 0.205]}>
                  <sphereGeometry args={[0.02, 12, 12]} />
                  <meshBasicMaterial color="#E31B23" />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Six actuator legs */}
        <group name="ActuatorsStage">
          {baseJoints.map((bPt, idx) => {
            const spreadAngle = BASE_ANGLES[idx] + (idx % 2 === 0 ? 1 : -1) * offsets.actuatorSpread;
            const spreadPt = new THREE.Vector3(
              (BASE_RADIUS - 0.05) * Math.cos(spreadAngle),
              bPt.y,
              (BASE_RADIUS - 0.05) * Math.sin(spreadAngle),
            );

            const targetTop = platformJointsLocal[idx].clone();
            targetTop.y += offsets.topPlatformYOffset;

            const diff = targetTop.clone().sub(spreadPt);
            const dir = diff.clone().normalize();
            const up = new THREE.Vector3(0, 1, 0);
            const q = new THREE.Quaternion().setFromUnitVectors(up, dir);

            const cylLen = 0.62;
            const cylPos = spreadPt.clone().add(dir.clone().multiplyScalar(cylLen * 0.5));
            const pistonLen = 0.62;
            const pistonPos = targetTop.clone().sub(dir.clone().multiplyScalar(pistonLen * 0.5 - offsets.pistonRetractOffset));

            const sideFactor = idx % 2 === 0 ? 1 : -1;
            const jointExplodeVec = new THREE.Vector3(sideFactor * offsets.jointHorizOffset, offsets.jointHorizOffset * 0.3, 0);
            const jointPos = targetTop.clone().add(jointExplodeVec);

            return (
              <group key={`actuator-unit-${idx}`}>
                <group position={[spreadPt.x, spreadPt.y, spreadPt.z]}>
                  <mesh castShadow={!reducedQuality} material={matAluminium}>
                    <cylinderGeometry args={[0.07, 0.08, 0.12, reducedQuality ? 12 : 16]} />
                  </mesh>
                  <mesh position={[0, 0.06, 0]} material={matCyanTrim}>
                    <sphereGeometry args={[0.045, 12, 12]} />
                  </mesh>
                </group>
                <mesh position={cylPos} quaternion={q} castShadow={!reducedQuality} material={matFrameSteel}>
                  <cylinderGeometry args={[0.062, 0.072, cylLen, reducedQuality ? 12 : 20]} />
                </mesh>
                <mesh position={cylPos} quaternion={q} material={matCyanTrim}>
                  <cylinderGeometry args={[0.066, 0.066, 0.04, reducedQuality ? 12 : 20]} />
                </mesh>
                <mesh position={pistonPos} quaternion={q} castShadow={!reducedQuality} material={matChromePiston}>
                  <cylinderGeometry args={[0.042, 0.042, pistonLen, reducedQuality ? 12 : 20]} />
                </mesh>
                <group position={[jointPos.x, jointPos.y, jointPos.z]}>
                  <mesh castShadow={!reducedQuality} material={matAluminium}>
                    <boxGeometry args={[0.12, 0.12, 0.12]} />
                  </mesh>
                  <mesh rotation={[0, 0, Math.PI / 2]} material={matRedAccent}>
                    <cylinderGeometry args={[0.035, 0.035, 0.16, 12]} />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>

        {/* Top platform deck */}
        <group ref={topPlatformRef} position={[0, offsets.topPlatformYOffset, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow={!reducedQuality} receiveShadow={!reducedQuality} material={isHovered ? matRedAccent : matBasePlate}>
            <cylinderGeometry args={[PLATFORM_RADIUS + 0.1, PLATFORM_RADIUS + 0.15, 0.12, 6]} />
          </mesh>
          <mesh position={[0, 0.11, 0]} material={matCyanTrim}>
            <cylinderGeometry args={[PLATFORM_RADIUS + 0.08, PLATFORM_RADIUS + 0.08, 0.015, 6]} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={`top-cutout-${i}`}
              position={[0, 0.06, 0]}
              rotation={[0, (i * Math.PI) / 3, 0]}
              material={matFrameSteel}
            >
              <boxGeometry args={[0.18, 0.13, PLATFORM_RADIUS * 1.8]} />
            </mesh>
          ))}
          {platformJointsLocal.map((pt, idx) => (
            <group key={`top-clevis-${idx}`} position={[pt.x, pt.y - 0.02, pt.z]}>
              <mesh castShadow={!reducedQuality} material={matAluminium}>
                <sphereGeometry args={[0.065, 12, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

export { BASE_RADIUS, PLATFORM_RADIUS };
