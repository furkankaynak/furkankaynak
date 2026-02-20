import { Canvas } from "@react-three/fiber";
import { WireframeField } from "./WireframeField";

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 54 }}
      gl={{ antialias: true, alpha: true }}
    >
      <WireframeField />
    </Canvas>
  );
}
