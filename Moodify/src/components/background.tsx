import { useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface BackgroundProps {
  paused: boolean;
}

export default function Background({ paused }: BackgroundProps) {
  // this is what drives your shader
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // targets from mouse, and current interpolated value
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // refs for our loop
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  // Remove the animationFrame loop logic, only update position on mouse move
  // useEffect(() => {
  //   function handleMouseMove(e: MouseEvent) {
  //     const x = (e.clientX / window.innerWidth - 0.5) * 0.4;
  //     const y = (e.clientY / window.innerHeight - 0.5) * 0.4;
  //     setPosition({ x, y });
  //   }
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <ShaderGradientCanvas>
        <ShaderGradient
          control="props"
          animate={paused ? "off" : "on"}
          brightness={0.8}
          cAzimuthAngle={270}
          cDistance={0.5}
          cPolarAngle={180}
          cameraZoom={15.1}
          color1="#4ade80"
          color2="#22c55e"
          color3="#16a34a"
          envPreset="city"
          grain="on"
          lightType="env"
          positionX={position.x}
          positionY={position.y}
          positionZ={0}
          reflection={0.4}
          rotationX={0}
          rotationY={130}
          rotationZ={70}
          shader="defaults"
          type="sphere"
          uAmplitude={3.2}
          uDensity={0.8}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={0.3}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
