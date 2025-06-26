import { useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function Background() {
  // this is what drives your shader
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // targets from mouse, and current interpolated value
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // refs for our loop
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    // capture mouse at full speed
    function handleMouseMove(e: MouseEvent) {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 0.4;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 0.4;
      target.current = { x, y };
    }
    window.addEventListener("mousemove", handleMouseMove);

    const maxFPS = 30;                    // desired React updates per second
    const minInterval = 1000 / maxFPS;   // ms between updates

    // animation loop runs at browser's 60FPS
    function animate(time: number) {
      // lerp at full speed for smoothness
      current.current.x = lerp(current.current.x, target.current.x, 0.075);
      current.current.y = lerp(current.current.y, target.current.y, 0.075);

      // but only push into React at most maxFPS
      if (time - lastUpdateTime.current >= minInterval) {
        setPosition({ ...current.current });
        lastUpdateTime.current = time;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    }

    // kick it off
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

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
          animate="on"
          brightness={0.8}
          cAzimuthAngle={270}
          cDistance={0.5}
          cPolarAngle={180}
          cameraZoom={15.1}
          color1="#73bfc4"
          color2="#26ff6b"
          color3="#8da0ce"
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
