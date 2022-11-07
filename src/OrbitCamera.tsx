import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const OrbitCamera = () => {
    const { camera, gl } = useThree();

    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);
            controls.minDistance = 1;
            controls.maxDistance = 10;
            controls.target.set(0, 0.75, 0);
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );

    return <></>
}

export default OrbitCamera;