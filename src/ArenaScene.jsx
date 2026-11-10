import { useEffect, useRef } from 'react'

/**
 * BLVND / THE HARDWARE
 * A sculpted controller, constructed from real Three.js geometry.
 * The scene follows the pointer and page scroll, with a clean static fallback.
 */
export default function ArenaScene() {
  const mount = useRef(null)
  useEffect(() => {
    const host = mount.current
    if (!host || !window.WebGLRenderingContext || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let destroyed = false, frame = 0, renderer, observer
    const cleanup = []
    const geometries = [], materials = []
    const start = async () => {
      try {
        const T = await import('three')
        if (destroyed) return
        const scene = new T.Scene()
        const camera = new T.PerspectiveCamera(35, 1, 0.1, 80)
        camera.position.set(0, 0.2, 12.5)
        renderer = new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})
        renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7))
        renderer.outputColorSpace = T.SRGBColorSpace
        renderer.toneMapping = T.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.6
        renderer.setClearColor(0x050508,0)
        renderer.domElement.setAttribute('aria-hidden','true')
        host.appendChild(renderer.domElement)
        const body = new T.Group()
        scene.add(body)
        const mat=(color,roughness=.38,metalness=.16,emissive=0x000000,intensity=0)=> {
          const m=new T.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:intensity})
          materials.push(m)
          return m
        }
        const shell=mat(0xeff0f2,.29,.28), shadow=mat(0x10131c,.45,.22)
        const grip=mat(0x20222d,.59,.1), accent=mat(0xff2f97,.3,.4,0xaa0b51,.35)
        const blue=mat(0x65d9ff,.22,.4,0x31a3ff,.6)
        const pearl=mat(0xffffff,.3,.3), dark=mat(0x080b11,.24,.35)
        const make=(geometry,material,parent=body,x=0,y=0,z=0)=>{
          geometries.push(geometry)
          const mesh=new T.Mesh(geometry,material)
          mesh.position.set(x,y,z)
          parent.add(mesh)
          return mesh
        }
        const rounded=(w,h,d,r,material,x,y,z)=>{
          const s=new T.Shape(),a=-w/2,b=-h/2
          s.moveTo(a+r,b)
          s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r)
          s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h)
          s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r)
          s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b)
          const geo=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.065,bevelThickness:.07,curveSegments:8})
          const mesh=make(geo,material,body,x,y,z)
          return mesh
        }
        // Broad central case and sculpted asymmetric hand grips.
        rounded(4.35,1.48,.64,.64,shell,0,.05,.0)
        for (const sign of [-1,1]) {
          const handle=make(new T.CapsuleGeometry(.66,1.28,9,18),shell,body,sign*1.82,-.63,-.12)
          handle.rotation.z=sign*.29
          make(new T.SphereGeometry(.68,24,16),shell,body,sign*1.84,-.24,.20).scale.set(1.2,.9,.8)
          make(new T.CapsuleGeometry(.38,.68,6,16),shadow,body,sign*1.93,-.86,-.32).rotation.z=sign*.28
        }
        // Glossy dark faceplate plus central touch surface.
        rounded(3.1,1.19,.11,.45,grip,0,.19,.64)
        const touch=rounded(1.42,.67,.065,.12,dark,0,.36,.8)
        touch.rotation.x=-.06
        rounded(1.27,.035,.012,.015,accent,0,.035,.90)
        // Central jewel, small speaker slots, option / share buttons.
        make(new T.OctahedronGeometry(.15),blue,body,0,-.16,1.01)
        for (let i=-3;i<=3;i++) {
          make(new T.BoxGeometry(.035,.008,.015),pearl,body,i*.083,-.50,.91)
        }
        for (const x of [-.93,.93]) {
          make(new T.BoxGeometry(.14,.038,.04),pearl,body,x,.56,.91)
        }
        // Analog sticks with dimensional collars and offset cap geometry.
        const sticks=[[-.88,-.20],[.84,-.36]]
        sticks.forEach(([x,y])=>{
          make(new T.CylinderGeometry(.38,.39,.13,48),shadow,body,x,y,.91).rotation.x=Math.PI/2
          make(new T.CylinderGeometry(.30,.30,.15,48),dark,body,x,y,1.04).rotation.x=Math.PI/2
          make(new T.CylinderGeometry(.245,.245,.022,48),grip,body,x,y,1.14).rotation.x=Math.PI/2
          make(new T.TorusGeometry(.285,.014,8,48),blue,body,x,y,1.15)
        })
        // Direction pad with individually extruded arms.
        for (const [x,y,w,h] of [[-1.66,.29,.16,.62],[-1.66,.29,.62,.16]]) {
          const m=make(new T.BoxGeometry(w,h,.12),dark,body,x,y,.91)
          m.rotation.z=.035
        }
        // Face cluster. Four offset candy-coloured embossed buttons.
        const buttons=[[1.66,.61,0xff71bd],[1.99,.30,0x70d7ff],[1.66,0,0xd8c4ff],[1.33,.30,0x9af1df]]
        buttons.forEach(([x,y,color])=>{
          const m=mat(color,.19,.22,color,.16)
          make(new T.CylinderGeometry(.135,.135,.115,32),m,body,x,y,.91).rotation.x=Math.PI/2
          make(new T.CircleGeometry(.083,24),pearl,body,x,y,1.002)
        })
        // Rear shoulder paddles visible above silhouette.
        for (const sign of [-1,1]) {
          const shoulder=rounded(1.0,.26,.26,.12,shadow,sign*1.63,.99,-.25)
          shoulder.rotation.z=-sign*.14
          make(new T.BoxGeometry(.72,.065,.09),accent,body,sign*1.67,1.12,-.11).rotation.z=-sign*.14
        }
        // A layered luminous portal serves as a stage, not a random wireframe.
        const stage=new T.Group()
        scene.add(stage)
        const ringMat=new T.MeshBasicMaterial({color:0xff2e8c,transparent:true,opacity:.56})
        const ringMat2=new T.MeshBasicMaterial({color:0x6edfff,transparent:true,opacity:.22})
        materials.push(ringMat,ringMat2)
        ;[[3.45,.022,ringMat],[4.15,.012,ringMat2],[4.8,.008,ringMat2]].forEach(([r,t,m],i)=>{
          const mesh=make(new T.TorusGeometry(r,t,6,130),m,stage)
          mesh.rotation.x=i===1?.34:-.2
          mesh.rotation.y=i===2?.4:0
        })
        // Disc, broken scanlines and an illuminated floor ellipse.
        const lineMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.09,side:T.DoubleSide})
        materials.push(lineMat)
        for(let i=0;i<9;i++){
          const y=-3.1+i*.78
          make(new T.PlaneGeometry(12,.008),lineMat,stage,0,y,-2.5)
        }
        const light1=new T.PointLight(0xff2c97,65,16)
        light1.position.set(-4,3,5)
        scene.add(light1)
        const light2=new T.PointLight(0x6ad5ff,50,15)
        light2.position.set(4,-2,4)
        scene.add(light2)
        scene.add(new T.AmbientLight(0xffffff,1.8))
        let pointerX=0,pointerY=0,scroll=0,visible=true
        const mouse=e=>{pointerX=(e.clientX/window.innerWidth-.5);pointerY=(e.clientY/window.innerHeight-.5)}
        const onScroll=()=>{scroll=Math.min(1.5,window.scrollY/Math.max(1,window.innerHeight))}
        const resize=()=>{
          if(!renderer)return
          const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight)
          renderer.setSize(w,h,false)
          camera.aspect=w/h
          camera.fov=w<640?48:35
          camera.updateProjectionMatrix()
        }
        window.addEventListener('pointermove',mouse,{passive:true})
        window.addEventListener('scroll',onScroll,{passive:true})
        window.addEventListener('resize',resize,{passive:true})
        cleanup.push(()=>window.removeEventListener('pointermove',mouse),()=>window.removeEventListener('scroll',onScroll),()=>window.removeEventListener('resize',resize))
        observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting})
        observer.observe(host)
        const render=t=>{
          if(destroyed)return
          if(visible&&!document.hidden){
            const time=t*.001
            const mobile=host.clientWidth<640
            const x=mobile?0:.38
            body.position.x+=(x-body.position.x)*.035
            body.position.y=Math.sin(time*.8)*.11-scroll*.55
            body.rotation.x+=((-.14+pointerY*.18+scroll*.55)-body.rotation.x)*.045
            body.rotation.y+=((-.29+pointerX*.44+scroll*.92)-body.rotation.y)*.04
            body.rotation.z+=((-.1+Math.sin(time*.4)*.045+scroll*.14)-body.rotation.z)*.045
            const scale=mobile?.67:1
            body.scale.setScalar(scale*(1+scroll*.14))
            stage.rotation.z=time*.025
            stage.rotation.y=pointerX*.13
            renderer.render(scene,camera)
          }
          frame=requestAnimationFrame(render)
        }
        resize()
        onScroll()
        frame=requestAnimationFrame(render)
      } catch(error) {
        console.warn('BLVND 3D fallback active',error)
      }
    }
    start()
    return()=>{
      destroyed=true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      cleanup.forEach(fn=>fn())
      geometries.forEach(g=>g.dispose())
      materials.forEach(m=>m.dispose())
      renderer?.dispose()
      renderer?.domElement?.remove()
    }
  },[])
  return <div ref={mount} className="blvnd-three-scene" aria-hidden="true"/>
}
