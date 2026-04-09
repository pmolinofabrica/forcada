// main.js — Forcada Textiles
// Lógica principal del sitio

// Animaciones de entrada con IntersectionObserver
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view')
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observar elementos con animación
document.querySelectorAll('.animate-fade-up, .animate-fade-up-delay, .animate-fade-up-delay-2').forEach(el => {
  observer.observe(el)
})

// Nav: añadir sombra al hacer scroll
const nav = document.querySelector('nav.site-nav')
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('shadow-2xl')
    } else {
      nav.classList.remove('shadow-2xl')
    }
  }, { passive: true })
}

// Botones de segmento: tracking hover (para analítica futura)
const segmentBtns = document.querySelectorAll('#segmentos a')
segmentBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    // Highlight sutil en los otros botones
    segmentBtns.forEach(other => {
      if (other !== btn) other.style.opacity = '0.5'
    })
  })
  btn.addEventListener('mouseleave', () => {
    segmentBtns.forEach(other => { other.style.opacity = '' })
  })
})
