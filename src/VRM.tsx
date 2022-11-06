import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const getBone = (gltf: any, boneName: string) => {
    const gltfNodes = gltf.parser.json.nodes;
    const vrmExtension = gltf?.parser?.json?.extensions?.["VRM"] || gltf?.parser?.json?.extensions?.["VRMC_vrm"]
    const humanBones = vrmExtension.humanoid.humanBones;
    const bone = humanBones.find((humanBone: any) => humanBone.bone === boneName);
    return gltfNodes[bone.node];
}

interface VRMProps {
    url: string;
}

const VRM = ({ url }: VRMProps) => {
    const [gltfState, setGltfState] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const gltf = useMemo(() => useLoader(GLTFLoader, url), [url]);

    const rotateBone = (boneName: string, rotation: [number, number, number]) => {
        const [x, y, z] = rotation;
        let newGltf = gltfState;
        const bone = getBone(newGltf, boneName);
        x && newGltf.nodes[bone.name].rotateX(x);
        y && newGltf.nodes[bone.name].rotateY(y);
        z && newGltf.nodes[bone.name].rotateZ(z);
        setGltfState(newGltf);
    }

    useEffect(() => {
        console.log(gltf);
        setGltfState(gltf);
    }, [gltf]);

    useEffect(() => {
        gltfState?.scene && setIsLoaded(true);
    }, [gltfState]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "a") {
                rotateBone("leftUpperArm", [0.5, 0.5, 0.5]);
            }
            if (event.key === "d") {
                rotateBone("rightUpperArm", [0.5, 0.5, 0.5]);
            }
            if (event.key === "w") {
                rotateBone("rightUpperLeg", [0.5, 0.5, 0.5]);
            }
            if (event.key === "s") {
                rotateBone("leftUpperLeg", [0.5, 0.5, 0.5]);
            }
        }
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [rotateBone]);

    return (
        <Suspense fallback={null}>
            {isLoaded && <primitive object={gltfState.scene} />}
        </Suspense>
    )
}

export default VRM;