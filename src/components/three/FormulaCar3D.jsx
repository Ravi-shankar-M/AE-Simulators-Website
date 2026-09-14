import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SIMULATOR_3D_STATES } from '../../animations/simulatorIntroTimeline';

export default function FormulaCar3D({ state, positionX = 0, isTestMode = false }) {
  const groupRef = useRef();
  const rearLeftWheelRef = useRef();
  const rearRightWheelRef = useRef();
  const frontLeftWheelRef = useRef();
  const frontRightWheelRef = useRef();

  // Compute continuous wheel spin speed based on timeline velocity
  const getSpinSpeed = () => {
    if (isTestMode) return 0; // Stationary test mode
    switch (state) {
      case SIMULATOR_3D_STATES.MAX_ACCELERATION:
      case SIMULATOR_3D_STATES.CAR_EXIT:
        return 40.0;
      case SIMULATOR_3D_STATES.CAR_ACCELERATE:
        return 28.0;
      case SIMULATOR_3D_STATES.TITLE_DRAG_START:
      case SIMULATOR_3D_STATES.CHAIN_TENSION:
        return 16.0;
      case SIMULATOR_3D_STATES.CAR_ENTRY:
      case SIMULATOR_3D_STATES.CAR_APPROACH:
        return 8.0;
      default:
        return 0;
    }
  };

  useFrame((_, delta) => {
    const speed = getSpinSpeed();
    if (speed > 0) {
      if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += delta * speed;
      if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += delta * speed;
      if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x += delta * speed;
      if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x += delta * speed;
    }
  });

  return (
    <group ref={groupRef} position={[positionX, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <ProceduralFormulaCarMesh
        rearLeftRef={rearLeftWheelRef}
        rearRightRef={rearRightWheelRef}
        frontLeftRef={frontLeftWheelRef}
        frontRightRef={frontRightWheelRef}
      />
    </group>
  );
}

function ProceduralFormulaCarMesh({ rearLeftRef, rearRightRef, frontLeftRef, frontRightRef }) {
  return (
    <group name="AE_Formula_Car">
      {/* CAR BODY NODE */}
      <group name="CarBody">
        {/* Carbon Monocoque Chassis Body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.85, 0.42, 3.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Nose Cone */}
        <mesh position={[0, 0.3, 1.8]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.32, 1.3, 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Front Wing */}
        <mesh position={[0, 0.15, 2.25]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.38]} />
          <meshStandardMaterial color="#ff1e27" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Rear Wing */}
        <mesh position={[0, 0.88, -1.55]} castShadow>
          <boxGeometry args={[1.65, 0.08, 0.42]} />
          <meshStandardMaterial color="#ff1e27" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Red Rear LED Taillight */}
        <mesh position={[0, 0.5, -1.62]}>
          <boxGeometry args={[0.22, 0.15, 0.06]} />
          <meshBasicMaterial color="#ff1e27" />
        </mesh>
        <pointLight position={[0, 0.5, -1.7]} color="#ff1e27" intensity={3.5} distance={4} />
      </group>

      {/* REAR LEFT WHEEL NODE */}
      <group name="Wheel_RL" position={[-0.8, 0.35, -1.0]} ref={rearLeftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.32, 24]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.33, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* REAR RIGHT WHEEL NODE */}
      <group name="Wheel_RR" position={[0.8, 0.35, -1.0]} ref={rearRightRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.32, 24]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.33, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* FRONT LEFT WHEEL NODE */}
      <group name="Wheel_FL" position={[-0.8, 0.32, 1.4]} ref={frontLeftRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 24]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
      </group>

      {/* FRONT RIGHT WHEEL NODE */}
      <group name="Wheel_FR" position={[0.8, 0.32, 1.4]} ref={frontRightRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 24]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
