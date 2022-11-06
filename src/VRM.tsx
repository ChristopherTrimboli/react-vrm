import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const VRM = () => {
    const gltf = useLoader(GLTFLoader, '../vrms/setuna.vrm')
    console.log(gltf);
    return (
        <Suspense fallback={null}>
            <primitive object={gltf.scene} />
        </Suspense>
    )
}

export default VRM;