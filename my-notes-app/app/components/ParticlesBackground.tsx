"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { MoveDirection, OutMode, type Container, type ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container) => {
        console.log("Particles container loaded:", container);
    };

    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: { value: "#000000" }, // Black background
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" }, // hover grabs lines
                    onClick: { enable: false }, // no click interaction
                },
                modes: {
                    grab: {
                        distance: 200,
                        links: { opacity: 0.5 },
                    },
                },
            },
            particles: {
                color: { value: "#ffffff" }, // White particles
                links: {
                    color: "#ffffff", // White connecting lines
                    distance: 150,
                    enable: true,
                    opacity: 0.4, // subtle lines
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.6, // very subtle movement
                    direction: MoveDirection.none,
                    outModes: { default: OutMode.out },
                },
                number: {
                    value: 200, // not too crowded
                    density: { enable: true, area: 800 },
                },
                opacity: { value: 0.4 },
                size: { value: { min: 1, max: 3 } }, // smaller dots
            },
            detectRetina: true,
        }),
        []
    );

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="absolute top-0 left-0 w-full h-full -z-10"
        />
    );
}
