import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 150
const COLORS = ['#194102', '#CDD883', '#E9FEDC']

export default function FloatingParticles() {
  const pointsRef = useRef()

  const { positions, colors, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors    = new Float32Array(PARTICLE_COUNT * 3)
    const speeds    = new Float32Array(PARTICLE_COUNT)
    const offsets   = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12   // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8   // z

      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      speeds[i]  = 0.1 + Math.random() * 0.25
      offsets[i] = Math.random() * Math.PI * 2
    }
    return { positions, colors, speeds, offsets }
  }, [])

  // Store mutable positions array in a ref for animation
  const posRef = useRef(positions.slice())

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    const arr = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Slow upward drift
      arr[i * 3 + 1] += speeds[i] * 0.004
      // Horizontal oscillation
      arr[i * 3] = posRef.current[i * 3] + Math.sin(t * 0.4 + offsets[i]) * 0.15

      // Reset when particle drifts above visible range
      if (arr[i * 3 + 1] > 5) {
        arr[i * 3 + 1] = -5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
