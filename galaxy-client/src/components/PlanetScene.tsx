import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

export function PlanetScene({ color = '#4f7cff' }: { color?: string }) {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Sphere args={[1.2, 64, 64]}>
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
        </Sphere>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}