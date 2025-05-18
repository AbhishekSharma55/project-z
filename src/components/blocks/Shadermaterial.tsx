import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Uniforms = {
    [key: string]: {
        value: number[] | number[][] | number;
        type: string;
    };
};

export const ShaderMaterial = ({
    source,
    uniforms,
    maxFps = 60,
}: {
    source: string;
    hovered?: boolean;
    maxFps?: number;
    uniforms: Uniforms;
}) => {
    const { size } = useThree();
    const ref = useRef<THREE.Mesh>(null);
    let lastFrameTime = 0;

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const timestamp = clock.getElapsedTime();

        lastFrameTime = timestamp;

        const material: any = ref.current.material;
        const timeLocation = material.uniforms.u_time;
        timeLocation.value = timestamp;
    });

    const getUniforms = () => {
        const preparedUniforms: any = {};

        for (const uniformName in uniforms) {
            const uniform: any = uniforms[uniformName];

            switch (uniform.type) {
                case "uniform1f":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
                    break;
                case "uniform1i":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
                    break;
                case "uniform3f":
                    preparedUniforms[uniformName] = {
                        value: new THREE.Vector3().fromArray(uniform.value),
                        type: "3f",
                    };
                    break;
                case "uniform1fv":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
                    break;
                case "uniform3fv":
                    preparedUniforms[uniformName] = {
                        value: uniform.value.map((v: number[]) =>
                            new THREE.Vector3().fromArray(v)
                        ),
                        type: "3fv",
                    };
                    break;
                case "uniform2f":
                    preparedUniforms[uniformName] = {
                        value: new THREE.Vector2().fromArray(uniform.value),
                        type: "2f",
                    };
                    break;
                default:
                    console.error(`Invalid uniform type for '${uniformName}'.`);
                    break;
            }
        }

        preparedUniforms["u_time"] = { value: 0, type: "1f" };
        preparedUniforms["u_resolution"] = {
            value: new THREE.Vector2(size.width * 2, size.height * 2),
        }; // Initialize u_resolution
        return preparedUniforms;
    };

    // Shader material
    const material = useMemo(() => {
        const materialObject = new THREE.ShaderMaterial({
            vertexShader: `
        precision mediump float;
        in vec2 coordinates;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          float x = position.x;
          float y = position.y;
          gl_Position = vec4(x, y, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
        `,
            fragmentShader: source,
            uniforms: getUniforms(),
            glslVersion: THREE.GLSL3,
            blending: THREE.CustomBlending,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneFactor,
        });

        return materialObject;
    }, [size.width, size.height, source]);

    return (
        <mesh ref={ref as any}>
            <planeGeometry args={[2, 2]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};
