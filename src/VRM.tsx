import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { cloneGltf } from "./helpers";

const getBone = (gltf: any, boneName: string) => {
    const gltfNodes = gltf.parser.json.nodes;
    const vrmExtension = gltf?.parser?.json?.extensions?.["VRM"] || gltf?.parser?.json?.extensions?.["VRMC_vrm"]
    const humanBones = vrmExtension.humanoid.humanBones;
    const bone = humanBones.find((humanBone: any) => humanBone.bone === boneName);
    return gltfNodes[bone.node];
}

interface VRMProps {
    url: string;
    position?: [number, number, number];
    updatePosition?: (position: [number, number, number]) => void;
    isClientUser?: boolean;
}

const VRM = ({ url, position, updatePosition, isClientUser }: VRMProps) => {
    const [gltfState, setGltfState] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const gltf = useMemo(() => useLoader(GLTFLoader, url), [url]);

    useEffect(() => {
        const gltfSceneClone = cloneGltf(gltf)
        setGltfState(gltfSceneClone);
    }, [gltf]);

    useEffect(() => {
        gltfState?.scene && setIsLoaded(true);
    }, [gltfState]);

    useEffect(() => {
        if (position && gltfState) {
            const [x, y, z] = position;
            let newGltf = gltfState;
            if (x !== null && x !== undefined && x !== newGltf.scene.position.x) {
                newGltf.scene.position.setX(x);
            }
            if (y !== null && y !== undefined && y !== newGltf.scene.position.y) {
                newGltf.scene.position.setY(y);
            }
            if (z !== null && z !== undefined && z !== newGltf.scene.position.z) {
                newGltf.scene.position.setZ(z);
            }
            setGltfState(newGltf);
        }
    }, [position, gltfState])

    const rotateBone = (boneName: string, rotation: [number, number, number]) => {
        const [x, y, z] = rotation;
        let newGltf = gltfState;
        const bone = getBone(newGltf, boneName);
        x && newGltf.nodes[bone.name].rotateX(x);
        y && newGltf.nodes[bone.name].rotateY(y);
        z && newGltf.nodes[bone.name].rotateZ(z);
        setGltfState(newGltf);
    }

    const movePosition = (position: [number, number, number]) => {
        const [x, y, z] = position;
        let newGltf = gltfState;
        newGltf.scene.position.set(
            newGltf.scene.position.x + x,
            newGltf.scene.position.y + y,
            newGltf.scene.position.z + z
        );
        setGltfState(newGltf);
        updatePosition && updatePosition([newGltf.scene.position.x, newGltf.scene.position.y, newGltf.scene.position.z]);
    }

    useEffect(() => {
        if (isClientUser) {
            const handleKeyPress = (event: KeyboardEvent) => {
                switch (event.key) {
                    case "w": {
                        movePosition([0, 0, -0.1]);
                        break;
                    }
                    case "a": {
                        movePosition([-0.1, 0, 0]);
                        break;
                    }
                    case "s": {
                        movePosition([0, 0, 0.1]);
                        break;
                    }
                    case "d": {
                        movePosition([0.1, 0, 0]);
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
        <Suspense fallback={null}>
            {isLoaded && <primitive object={gltfState.scene} />}
        </Suspense>
    )
}

export default VRM;