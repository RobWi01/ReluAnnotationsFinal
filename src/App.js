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
  const welcome = useStore((state) => state.welcome)
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
        <Physics
          iterations={20}
          tolerance={0.0001}
          defaultContactMaterial={{
            friction: 0.9,
            restitution: 0.7,
            contactEquationStiffness: 1e7,
            contactEquationRelaxation: 1,
            frictionEquationStiffness: 1e7,
            frictionEquationRelaxation: 2,
          }}
          gravity={[0, -4, 0]}
          allowSleep={false}
          // Adjust to the headset refresh rate
          step={1 / 90}>
          <mesh geometry={geometryMandible}>
            <meshStandardMaterial color="0xd3d3d3" />
          </mesh>
        </Physics>
      </VRCanvas>
      <div className="startup" style={{ display: welcome ? "block" : "none" }}>
        * once in vr press trigger to start
      </div>
    </>
  )}
