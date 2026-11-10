import { useEffect } from 'react'

/** One global motion director for editorial scroll reveals and section progress. */
export default function MotionDirector() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const elements = [...document.querySelectorAll('.blvnd-editorial-feature .section-copy, .blvnd-editorial-feature .gaming-art, .blvnd-editorial-games .section-heading, .blvnd-editorial-games .game-card, .blvnd-editorial-rates .section-heading, .blvnd-editorial-rates .package-card, .blvnd-editorial-crew .crew-content, .blvnd-editorial-final .cta-inner')]
    elements.forEach((el,i) => { el.classList.add('blvnd-on-scroll'); el.style.setProperty('--stagger', (i%4)*85+'ms') })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('blvnd-visible'); observer.unobserve(entry.target) } })
    }, {threshold:.08,rootMargin:'0px 0px -30px 0px'})
    elements.forEach(el=>observer.observe(el))
    let scheduled=false
    const onScroll=()=>{
      if(scheduled)return
      scheduled=true
      requestAnimationFrame(()=>{
        const h=Math.max(1,document.documentElement.scrollHeight-innerHeight)
        document.documentElement.style.setProperty('--blvnd-scroll-progress',(scrollY/h*100).toFixed(2)+'%')
        scheduled=false
      })
    }
    window.addEventListener('scroll',onScroll,{passive:true})
    onScroll()
    return()=>{observer.disconnect();window.removeEventListener('scroll',onScroll);elements.forEach(el=>{el.classList.remove('blvnd-on-scroll','blvnd-visible');el.style.removeProperty('--stagger')});document.documentElement.style.removeProperty('--blvnd-scroll-progress')}
  },[])
  return null
}
