import { useEffect, useRef } from 'react'

/* A self-contained Three.js scene. It never intercepts booking clicks. */
export default function ArenaScene() {
  const holder = useRef(null)
  useEffect(() => {
    const host = holder.current
    if (!host || !window.WebGLRenderingContext || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let renderer, scene, camera, raf = 0, disposed = false, observer
    let geometries = [], materials = []
    let active = true
    const init = async () => {
      try {
        const THREE = await import('three')
        if (disposed) return
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        host.appendChild(renderer.domElement)
        renderer.domElement.setAttribute('aria-hidden', 'true')
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
        camera.position.set(0, 0, 12)
        const group = new THREE.Group()
        scene.add(group)
        const pink = new THREE.MeshBasicMaterial({ color: 0xff4b9f, wireframe: true, transparent: true, opacity: 0.62 })
        const lavender = new THREE.MeshBasicMaterial({ color: 0x9c79ff, wireframe: true, transparent: true, opacity: 0.27 })
        const cyan = new THREE.MeshBasicMaterial({ color: 0x7ae9ff, wireframe: true, transparent: true, opacity: 0.42 })
        materials.push(pink, lavender, cyan)
        const coreGeo = new THREE.IcosahedronGeometry(2, 2)
        const core = new THREE.Mesh(coreGeo, lavender)
        group.add(core); geometries.push(coreGeo)
        ;[[2.8, 0.035, pink, 0.38, 0.25], [3.35, 0.023, cyan, 1.1, 0.5], [3.95, 0.015, lavender, 0.2, 1.25]].forEach(([r, tube, mat, x, y]) => {
          const geometry = new THREE.TorusGeometry(r, tube, 5, 112)
          const mesh = new THREE.Mesh(geometry, mat)
          mesh.rotation.set(x, y, 0)
          group.add(mesh); geometries.push(geometry)
        })
        const count = 180
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const radius = 3.9 + Math.random() * 3.8
          const angle = Math.random() * Math.PI * 2
          positions[i*3] = Math.cos(angle)*radius
          positions[i*3+1] = (Math.random()-.5)*8
          positions[i*3+2] = Math.sin(angle)*radius-1
        }
        const particleGeo = new THREE.BufferGeometry()
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particleMat = new THREE.PointsMaterial({ color: 0xffb2db, size: .035, transparent: true, opacity: .65 })
        geometries.push(particleGeo); materials.push(particleMat)
        const particles = new THREE.Points(particleGeo, particleMat)
        scene.add(particles)
        let mx = 0, my = 0
        const pointer = (e) => {
          mx = (e.clientX / window.innerWidth - .5) * .35
          my = (e.clientY / window.innerHeight - .5) * .2
        }
        const resize = () => {
          if (!renderer || disposed) return
          const w = host.clientWidth || 1, h = host.clientHeight || 1
          renderer.setSize(w,h,false)
          camera.aspect = w/h
          camera.updateProjectionMatrix()
        }
        const render = (t) => {
          if (disposed) return
          if (active && !document.hidden) {
            const time = t * 0.00018
            group.rotation.y += ((time + mx) - group.rotation.y) * .015
            group.rotation.x += ((Math.sin(time*.8)*.13 + my) - group.rotation.x)*.018
            core.rotation.z = time*.55
            particles.rotation.y = -time*.13
            renderer.render(scene,camera)
          }
          raf = requestAnimationFrame(render)
        }
        window.addEventListener('resize', resize, {passive:true})
        window.addEventListener('pointermove', pointer, {passive:true})
        observer = new IntersectionObserver(entries => {active = entries[0].isIntersecting}, {threshold:0})
        observer.observe(host)
        resize()
        raf = requestAnimationFrame(render)
        host._cleanupScene = () => {
          window.removeEventListener('resize', resize)
          window.removeEventListener('pointermove', pointer)
        }
      } catch (err) {
        console.warn('BLVND 3D scene unavailable; static hero remains visible.', err)
      }
    }
    init()
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      host._cleanupScene?.()
      geometries.forEach(g=>g.dispose())
      materials.forEach(m=>m.dispose())
      renderer?.dispose()
      renderer?.domElement?.remove()
    }
  }, [])
  return <div ref={holder} className="blvnd-three-scene" aria-hidden="true" />
}
