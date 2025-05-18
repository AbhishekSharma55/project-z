import { Canvas } from "@react-three/fiber";
import { ShaderMaterial } from "./Shadermaterial";

interface ShaderProps {
    source: string;
    uniforms: {
      [key: string]: {
        value: number[] | number[][] | number;
        type: string;
      };
    };
    maxFps?: number;
  }

export const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
    return (
      <Canvas className="absolute inset-0  h-full w-full">
        <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
      </Canvas>
    );
  };