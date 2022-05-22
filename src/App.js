// react-three-fiber is a way to express threejs declaratively: https://github.com/pmndrs/react-three-fiber
import { useFrame, useLoader } from "@react-three/fiber"
// use-cannon is a hook around the cannon.js physics library: https://github.com/pmndrs/use-cannon
import { Physics, useSphere, useBox, usePlane } from "@react-three/cannon"
// zustand is a minimal state-manager: https://github.com/pmndrs/zustand
import create from "zustand"

import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import React, { Suspense, useRef, useCallback, useMemo } from "react"
import { VRCanvas, useXREvent, useXR, useController } from "@react-three/xr"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import {FC, useEffect, useState} from 'react'
import {BufferGeometry} from 'three'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'


// const Model = ({fileUrl}) => {
//   const [geometry, setGeometry] = useState<BufferGeometry>(null)

//   useEffect(() => {
//     const stlLoader = new STLLoader()
//     stlLoader.load(fileUrl, geo => {
//       setGeometry(geo)
//     })
//   }, [])}

let geometryMandible = null

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
