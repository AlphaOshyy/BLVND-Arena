import { useEffect, useRef, useState } from 'react'

const exhibits = [
  {name:'GTA VI',chapter:'01 / THE CITY',type:'FEATURED EXPERIENCE',image:'https://www.rockstargames.com/VI/_next/static/media/Official_Cover_Art_landscape.12.uu2irr.2_a.jpg?akim=1&imwidth=1920',blurb:'ENTER THE NEXT ERA.'},
  {name:'GHOST OF TSUSHIMA',chapter:'02 / THE LEGEND',type:'ACTION ADVENTURE',image:'/assets/games/ghost-of-tusima.jpg',blurb:'EVERY MOVE MATTERS.'},
  {name:'SPIDER-MAN MILES MORALES',chapter:'03 / THE HERO',type:'ACTION ADVENTURE',image:'/assets/games/spider-man-miles-morales.jpg',blurb:'OWN YOUR MOMENT.'},
  {name:'NFS PAYBACK',chapter:'04 / THE SPEED',type:'RACING EXPERIENCE',image:'/assets/games/nfs-payback.jpg',blurb:'NO LIMITS. ALL GAS.'},
  {name:'MORTAL KOMBAT 1',chapter:'05 / THE FIGHT',type:'VERSUS',image:'/assets/games/mortal-kombat-1.jpg',blurb:'CHOOSE YOUR FIGHT.'}
]
const vert=`
varying vec2 vUv;
void main() {vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`
const frag=`
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uMix;
uniform float uTime;
uniform float uHover;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec2 uFromSize;
uniform vec2 uToSize;
varying vec2 vUv;
vec2 cover(vec2 uv,vec2 texSize){
  float canvas=uResolution.x/uResolution.y;
  float photo=texSize.x/texSize.y;
  vec2 scale=canvas>photo?vec2(1.,photo/canvas):vec2(canvas/photo,1.);
  return (uv-.5)*scale+.5;
}
vec4 sampleFrame(sampler2D tex,vec2 uv,vec2 size,float drift){
  vec2 center=cover(uv,size);
  center.x+=drift;
  return texture2D(tex,clamp(center,vec2(.001),vec2(.999)));
}
void main(){
  vec2 uv=vUv;
  float t=clamp(uMix,0.,1.);
  float wave=sin(uv.y*27.+uTime*1.1+uPointer.y*3.)*.0035;
  float cursor=exp(-distance(uv,uPointer)*7.)*.015*uHover;
  float noise=sin(uv.y*85.+uTime*3.)*sin(uv.x*16.-uTime)*.018;
  float transition=smoothstep(0.,1.,t);
  float rip=sin((uv.y+transition)*27.)*.05*sin(3.14159265*transition);
  vec2 fromUv=uv+vec2(wave+cursor+noise*.15+rip,0.);
  vec2 toUv=uv+vec2(wave+cursor+noise*.15-rip,0.);
  vec4 a=sampleFrame(uFrom,fromUv,uFromSize,-transition*.18);
  vec4 b=sampleFrame(uTo,toUv,uToSize,(1.-transition)*.18);
  float wipe=smoothstep(transition-.20,transition+.20,uv.x+.14*sin(uv.y*10.+uTime));
  float blend=transition<.001?0.:transition>.999?1.:1.-wipe;
  vec4 color=mix(a,b,blend);
  float edges=.14*pow(1.-abs(uv.y-.5)*2.,4.);
  color.rgb=mix(color.rgb,vec3(.045,.025,.06),.12+edges);
  float scan=sin(uv.y*uResolution.y*1.1)*.013;
  color.rgb+=scan;
  color.rgb+=vec3(.08,.005,.035)*sin(3.14159265*transition);
  gl_FragColor=vec4(color.rgb,1.);
}
`

export default function ExperienceGallery({onBook}) {
  const host=useRef(null)
  const bridge=useRef({change:null,pointer:null})
  const [current,setCurrent]=useState(0)
  const [webgl,setWebgl]=useState(false)
  const indexRef=useRef(0)
  const touchStart=useRef(null)
  const navigate=step=>{
    const next=(indexRef.current+step+exhibits.length)%exhibits.length
    if (next===indexRef.current) return
    indexRef.current=next
    setCurrent(next)
    bridge.current.change?.(next)
  }
  useEffect(()=>{
    const container=host.current
    if(!container||!window.WebGLRenderingContext||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    let dead=false,renderer,scene,camera,mesh,frame=0,observer
    const textures=[], cleanup=[]
    const init=async()=>{
      try {
        const THREE=await import('three')
        if(dead)return
        const load=async url=>{
          const loader=new THREE.TextureLoader()
          return new Promise(resolve=>{
            loader.load(url,t=>{
              t.colorSpace=THREE.SRGBColorSpace
              t.minFilter=THREE.LinearFilter
              t.magFilter=THREE.LinearFilter
              textures.push(t)
              resolve(t)
            },undefined,()=>resolve(null))
          })
        }
        const all=await Promise.all(exhibits.map(x=>load(x.image)))
        if(dead){all.filter(Boolean).forEach(t=>t.dispose());return}
        // Use whichever images loaded, replacing broken frames with the first successful texture.
        const fallback=all.find(Boolean)
        if(!fallback)return
        const loaded=all.map(t=>t||fallback)
        renderer=new THREE.WebGLRenderer({alpha:false,antialias:false,powerPreference:'high-performance'})
        renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6))
        renderer.outputColorSpace=THREE.SRGBColorSpace
        renderer.domElement.setAttribute('aria-hidden','true')
        container.appendChild(renderer.domElement)
        scene=new THREE.Scene()
        camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10)
        camera.position.z=1
        const resolution=new THREE.Vector2(1,1)
        const first=indexRef.current
        const uniforms={
          uFrom:{value:loaded[first]},uTo:{value:loaded[first]},uMix:{value:0},
          uTime:{value:0},uHover:{value:0},uPointer:{value:new THREE.Vector2(.5,.5)},
          uResolution:{value:resolution},uFromSize:{value:new THREE.Vector2(1,1)},
          uToSize:{value:new THREE.Vector2(1,1)}
        }
        const dims=(t,v)=>{
          const image=t.image||{width:1,height:1}
          v.set(image.width||1,image.height||1)
        }
        dims(loaded[first],uniforms.uFromSize.value)
        dims(loaded[first],uniforms.uToSize.value)
        const geometry=new THREE.PlaneGeometry(2,2)
        const material=new THREE.ShaderMaterial({vertexShader:vert,fragmentShader:frag,uniforms})
        mesh=new THREE.Mesh(geometry,material)
        scene.add(mesh)
        let previous=0,elapsed=0,from=first,to=first,progress=1,active=true
        bridge.current.change=next=>{
          // Every transition starts from the fully resolved previous frame.
          from=to
          to=next
          uniforms.uFrom.value=loaded[from]
          uniforms.uTo.value=loaded[to]
          dims(loaded[from],uniforms.uFromSize.value)
          dims(loaded[to],uniforms.uToSize.value)
          progress=0
          uniforms.uMix.value=0
        }
        const resize=()=>{
          if(!renderer)return
          const w=Math.max(container.clientWidth,1),h=Math.max(container.clientHeight,1)
          renderer.setSize(w,h,false)
          resolution.set(w,h)
        }
        const pointer=e=>{
          const rect=container.getBoundingClientRect()
          uniforms.uPointer.value.set((e.clientX-rect.left)/rect.width,1-(e.clientY-rect.top)/rect.height)
          uniforms.uHover.value=1
        }
        const leave=()=>{uniforms.uHover.value=0}
        const draw=timestamp=>{
          if(dead)return
          const dt=Math.min((timestamp-previous)/1000||0,.05)
          previous=timestamp
          if(active&&!document.hidden){
            elapsed+=dt
            if(progress<1){
              progress=Math.min(1,progress+dt/1.05)
              const ease=progress*progress*(3-2*progress)
              uniforms.uMix.value=ease
              if(progress>=1){
                uniforms.uFrom.value=loaded[to]
                dims(loaded[to],uniforms.uFromSize.value)
                uniforms.uMix.value=0
                from=to
              }
            }
            uniforms.uTime.value=elapsed
            renderer.render(scene,camera)
          }
          frame=requestAnimationFrame(draw)
        }
        window.addEventListener('resize',resize,{passive:true})
        container.addEventListener('pointermove',pointer,{passive:true})
        container.addEventListener('pointerleave',leave)
        cleanup.push(()=>window.removeEventListener('resize',resize),()=>container.removeEventListener('pointermove',pointer),()=>container.removeEventListener('pointerleave',leave))
        observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting})
        observer.observe(container)
        resize()
        setWebgl(true)
        frame=requestAnimationFrame(draw)
      }catch(err){console.warn('BLVND gallery fallback active',err)}
    }
    init()
    return()=>{
      dead=true
      cancelAnimationFrame(frame)
      bridge.current.change=null
      observer?.disconnect()
      cleanup.forEach(fn=>fn())
      mesh?.geometry.dispose()
      mesh?.material.dispose()
      textures.forEach(t=>t.dispose())
      renderer?.dispose()
      renderer?.domElement?.remove()
    }
  },[])
  const item=exhibits[current]
  return <section className="blvnd-experience" aria-label="Explore featured BLVND experiences">
    <div className="blvnd-experience-kicker"><span>02 / THE COLLECTION</span><span>EXPLORE THE GAMES</span></div>
    <div ref={host} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();navigate(1)}if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1)}}} onTouchStart={e=>{touchStart.current=e.touches[0]?.clientX??null}} onTouchEnd={e=>{if(touchStart.current===null)return;const delta=(e.changedTouches[0]?.clientX??touchStart.current)-touchStart.current;if(Math.abs(delta)>55)navigate(delta<0?1:-1);touchStart.current=null}} className={'blvnd-experience-stage'+(webgl?' webgl-ready':'')} style={{backgroundImage:`linear-gradient(180deg,rgba(4,4,8,.12),rgba(4,4,8,.5)),url("${item.image}")`}}>
      <div className="blvnd-experience-scrim"/>
      <div className="blvnd-experience-copy" key={current}>
        <span>{item.chapter} · {item.type}</span>
        <h2>{item.name}</h2>
        <p>{item.blurb}</p>
        <button onClick={()=>onBook(item.name)} className="blvnd-experience-book">BOOK THIS GAME <span aria-hidden="true">↗</span></button>
      </div>
      <div className="blvnd-experience-controls">
        <span className="blvnd-experience-counter">{String(current+1).padStart(2,'0')} <i/> {String(exhibits.length).padStart(2,'0')}</span>
        <button type="button" onClick={()=>navigate(-1)} aria-label="Previous game">←</button>
        <button type="button" onClick={()=>navigate(1)} aria-label="Next game">→</button>
      </div>
      <div className="blvnd-experience-index">BLVND / SELECT YOUR NEXT EXPERIENCE</div>
    </div>
    <div className="blvnd-experience-tabs">
      {exhibits.map((entry,i)=><button key={entry.name} onClick={()=>{if(i!==current){indexRef.current=i;setCurrent(i);bridge.current.change?.(i)}}} className={i===current?'active':''} aria-pressed={i===current}><small>0{i+1}</small><span>{entry.name}</span></button>)}
    </div>
  </section>
}
