import { useEffect, useRef, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import Matter from 'matter-js';
import { assets } from '../assets/assets';

const SCALE = 0.6;

const capsules = [
    { src: assets.gravityCapsule1, w: 233, h: 49 },
    { src: assets.gravityCapsule2, w: 327, h: 61 },
    { src: assets.gravityCapsule3, w: 373, h: 85 },
    { src: assets.gravityCapsule4, w: 222, h: 96 },
    { src: assets.gravityCapsule5, w: 213, h: 93 },
    { src: assets.gravityCapsule6, w: 174, h: 76 },
    { src: assets.gravityCapsule7, w: 184, h: 67 },
    { src: assets.gravityCapsule8, w: 202, h: 73 },
    { src: assets.gravityCapsule9, w: 257, h: 112 },
];

export default function GravityCapsules({ className = '', obstacleRefs }: { className?: string; obstacleRefs?: RefObject<HTMLElement | null>[] }) {
    const { pathname } = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLImageElement | null)[]>([]);
    const startedRef = useRef(false);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        startedRef.current = false;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !startedRef.current) {
                    startedRef.current = true;
                    startPhysics(container);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(container);

        return () => {
            observer.disconnect();
            if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
        };
    }, [pathname]);

    function startPhysics(container: HTMLDivElement) {
        const { Engine, Runner, Bodies, Composite, Events } = Matter;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const engine = Engine.create();
        engineRef.current = engine;

        const ground = Bodies.rectangle(width / 2, height + 25, width * 2, 50, { isStatic: true });
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, { isStatic: true });
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, { isStatic: true });

        const bodies = capsules.map((c, i) => {
            const w = c.w * SCALE;
            const h = c.h * SCALE;
            const x = Math.random() * (width - w) + w / 2;
            const y = -200 - i * 130;
            return Bodies.rectangle(x, y, w, h, {
                chamfer: { radius: h / 2 },
                restitution: 0.4,
                friction: 0.6,
                frictionAir: 0.005,
                angle: (Math.random() - 0.5) * 0.6,
            });
        });

        const staticBodies = [ground, leftWall, rightWall];

        if (obstacleRefs?.length) {
            const containerRect = container.getBoundingClientRect();
            for (const ref of obstacleRefs) {
                const obstacleEl = ref.current;
                if (!obstacleEl) continue;
                const obstacleRect = obstacleEl.getBoundingClientRect();
                staticBodies.push(
                    Bodies.rectangle(
                        obstacleRect.left - containerRect.left + obstacleRect.width / 2,
                        obstacleRect.top - containerRect.top + obstacleRect.height / 2,
                        obstacleRect.width,
                        obstacleRect.height,
                        { isStatic: true }
                    )
                );
            }
        }

        Composite.add(engine.world, [...staticBodies, ...bodies]);

        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        Events.on(engine, 'afterUpdate', () => {
            bodies.forEach((body, i) => {
                const el = itemRefs.current[i];
                if (!el) return;
                const w = capsules[i].w * SCALE;
                const h = capsules[i].h * SCALE;
                el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
            });
        });
    }

    return (
        <div ref={containerRef} className={className}>
            {capsules.map((c, i) => (
                <img
                    key={c.src}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    src={c.src}
                    alt=""
                    className="absolute top-0 left-0 will-change-transform"
                    style={{ width: c.w * SCALE, height: c.h * SCALE }}
                />
            ))}
        </div>
    );
}
