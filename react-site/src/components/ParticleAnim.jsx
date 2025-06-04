import { useRef, useEffect } from 'react';

export default function ParticleAnim() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const orbit = { radius: 0, xOffset: 0, yOffset: -60 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      orbit.radius = canvas.height / 4;
    };
    window.addEventListener('resize', resize);
    resize();

    let counter = 0;
    const particles = [];
    let uid = 0;
    class Particle {
      constructor(radius, offset) {
        this.radius = radius;
        this.offset = offset;
        this.id = uid++;
        this.speed = 0.01;
      }
      update() {
        this.x = canvas.width/2 + orbit.xOffset + Math.sin(this.id + counter*this.speed) * -(orbit.radius + this.offset);
        this.y = canvas.height/2 + orbit.yOffset + Math.cos(this.id + counter*this.speed) * (orbit.radius + this.offset);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
      }
    }
    for (let i=0;i<50;i++) {
      particles.push(new Particle(Math.random()*5+2, Math.random()*20));
    }
    const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'rgba(255,224,51,0.4)';
      particles.forEach(p => { p.update(); p.draw(); });
      counter++;
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{position:'absolute',top:0,left:0,width:'100vw',height:'100vh',zIndex:-1}} />;
}
