import { Physics } from "@react-three/cannon"
import React from "react"
import { VRCanvas } from "@react-three/xr"
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'

let geometryMandible = null
const loader = new STLLoader();

loader.load(
  "https://annosend.blob.core.windows.net/stl-files/Mandible.stl",
  function (geometry) {
    geometryMandible = geometry;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

export default function () {
  return (
    <>
      <VRCanvas sRGB>
        <color attach="background" args={["#171720"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
          <mesh geometry={geometryMandible}>
            <meshStandardMaterial color="0xd3d3d3" />
          </mesh>
      </VRCanvas>
    </>
  )}
