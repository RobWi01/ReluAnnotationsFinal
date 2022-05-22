import { DefaultXRControllers, Interactive, ARCanvas } from '@react-three/xr'
// import { Box, Plane } from 'drei/shapes'
// import { OrbitControls } from 'drei/OrbitControls'
import { Text } from 'drei/Text'
import React, { useState } from 'react'
// import { useFrame } from 'react-three-fiber'
// import { BufferGeometry, InterleavedBuffer, InterleavedBufferAttribute, Vector3 } from 'three'

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  )
}

function Button(props: any) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState<any>('blue')

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
      <Box color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]} size={[10, 10, 10]} {...props}>
        <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle"  attachArray={undefined} attachObject={undefined}>
          Hello react-xr!
        </Text>
      </Box>
    </Interactive>
  )
}

export function App() {
  return (
    <ARCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Button position={[0, 0, 0]} />
      <DefaultXRControllers />
    </ARCanvas>
  )
}
