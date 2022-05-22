import { Text } from 'drei/Text'
import React, { useState } from 'react'
import { DefaultXRControllers, ARCanvas, Interactive } from '@react-three/xr'
import './styles.css'

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  )
}
const buttonSize = [0.2, 0.1, 0.1]

function Button(props: any) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState<any>('blue')
  console.log(hover);

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  // @ts-ignore
  return (
    <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
      <Box color={color} size={buttonSize} {...props}>
        <Text
          position={[props.position[0] + 0.05, props.position[1] - 0.08, props.position[2] + 0.6]}
          fontSize={0.05}
          color="#000"
          anchorX="left" attachArray={undefined} attachObject={undefined}>
          Hello
        </Text>
      </Box>
    </Interactive>
  )
}

// const add3DSize(3ds: [number,number,number]): [number,number,number] => []

// const startingPoint = -buttonSize[0] * 1.5

export default function App() {
  // Default values

  /**
   * Directions: x is from left to right on the phone (positive is going right)
   *             y is from top to bottom on the phone (positive is going up)
   *             z is as if we put finger through the phone (negative z is in front of us)
   */
  return (
    <ARCanvas camera= { {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: [0, 0, 0]}
    }>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Button position={[-0.4, 0.1, -0.5]} />
      <Button position={[-0.1, 0.1, -0.5]} />
      <Button position={[0.2, 0.1, -0.5]} />
      <Button position={[0.5, 0.1, -0.5]} />

      <DefaultXRControllers />
    </ARCanvas>
  )
}
