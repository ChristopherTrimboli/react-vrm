import React, { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { cloneGltf } from "./helpers";
import { useSpring, animated } from "@react-spring/three";
import { Object3D } from "three";
import { OrbitControls } from "@react-three/drei";

type Position = [x: number, y: number, z: number];

interface VRMProps {
    url: string;
    position?: Position;
    updatePosition?: (position: Position) => void;
    isClientUser?: boolean;
}

const VRM = ({ url, position, updatePosition, isClientUser }: VRMProps) => {
    const [gltfState, setGltfState] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [internalPosition, setInternalPosition] = useState<Position>([0, 0, 0]);
    const [cameraTarget, setCameraTarget] = useState<Position>([0, 0, 0]);

    const gltfRef = useRef<Object3D<Event>>(null);

    const gltf = useMemo(() => useLoader(GLTFLoader, url), [url]);

    const [positionSpring, positionSpringApi] = useSpring(() => {
        return {
            position: internalPosition,
        }
    }, [internalPosition])

    useEffect(() => {
        const gltfSceneClone = cloneGltf(gltf)
        setGltfState(gltfSceneClone);
    }, [gltf]);

    useEffect(() => {
        if (gltfState?.scene) {
            setIsLoaded(true);
            gltfRef.current?.add(gltfState?.scene);
        }
    }, [gltfState, gltfRef?.current]);

    useFrame(() => {
        if (gltfRef?.current && isClientUser) {
            const { x, y, z } = gltfRef.current.position;
            setCameraTarget([x, y + 0.75, z]);
        }
    })

    const movePosition = (position: Position) => {
        const [x, y, z] = position;
        const newPosition: Position = [internalPosition[0] + x, internalPosition[1] + y, internalPosition[2] + z];
        setInternalPosition(newPosition);
        if (isClientUser) {
            updatePosition?.(newPosition);
        }
    }

    useEffect(() => {
        if (!isClientUser && position && (position[0] !== internalPosition[0] || position[1] !== internalPosition[1] || position[2] !== internalPosition[2])) {
            setInternalPosition(position);
        }
    }, [position])

    useEffect(() => {
        if (isClientUser) {
            const handleKeyPress = (event: KeyboardEvent) => {
                switch (event.key) {
                    case "w": {
                        movePosition([0, 0, -0.05]);
                        break;
                    }
                    case "a": {
                        movePosition([-0.05, 0, 0]);
                        break;
                    }
                    case "s": {
                        movePosition([0, 0, 0.05]);
                        break;
                    }
                    case "d": {
                        movePosition([0.05, 0, 0]);
                        break;
                    }
                    default:
                        break;
                }
            }
            window.addEventListener('keypress', handleKeyPress);
            return () => window.removeEventListener('keypress', handleKeyPress);
        }
    }, [movePosition]);

    return (
        <>
            <Suspense fallback={null}>
                {isLoaded && <>
                    <animated.object3D position={positionSpring.position} ref={gltfRef} />
                    {isClientUser && <OrbitControls maxDistance={4} minDistance={1.5} makeDefault target={cameraTarget} />}
                </>}
            </Suspense>
        </>
    )
}

export default VRM;

// const getBone = (gltf: any, boneName: string) => {
//     const gltfNodes = gltf.parser.json.nodes;
//     const vrmExtension = gltf?.parser?.json?.extensions?.["VRM"] || gltf?.parser?.json?.extensions?.["VRMC_vrm"]
//     const humanBones = vrmExtension.humanoid.humanBones;
//     const bone = humanBones.find((humanBone: any) => humanBone.bone === boneName);
//     return gltfNodes[bone.node];
// }

// const rotateBone = (boneName: string, rotation: [number, number, number]) => {
//     const [x, y, z] = rotation;
//     let newGltf = gltfState;
//     const bone = getBone(newGltf, boneName);
//     x && newGltf.nodes[bone.name].rotateX(x);
//     y && newGltf.nodes[bone.name].rotateY(y);
//     z && newGltf.nodes[bone.name].rotateZ(z);
//     setGltfState(newGltf);
// }