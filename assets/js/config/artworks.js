// Artwork Registry
// This file contains metadata for all artworks in the gallery

export const ARTWORKS = [
  {
    id: 'falling-star-trails',
    title: 'Falling Star Trails',
    description: 'Mesmerizing streams of light cascade downward, creating an ethereal meteor shower effect that never ends.',
    module: () => import('../artworks/falling-star-trails.js')
  },
  {
    id: 'abstract-fluid',
    title: 'Abstract Fluid',
    description: 'Flow fields guided by Perlin noise create an ever-shifting landscape of organic movement and energy.',
    module: () => import('../artworks/abstract-fluid.js')
  },
  {
    id: 'magnetic-particles-orbit',
    title: 'Magnetic Particles Orbit',
    description: 'Hundreds of particles dance through a noise field, creating hypnotic patterns reminiscent of cosmic forces.',
    module: () => import('../artworks/magnetic-particles-orbit.js')
  },
  {
    id: 'digital-dna-helix',
    title: 'Digital DNA Helix',
    description: 'A wave-driven double helix rotates endlessly, evoking the elegant structure of life itself.',
    module: () => import('../artworks/digital-dna-helix.js')
  },
  {
    id: 'particle-warp-field',
    title: 'Particle Warp Field',
    description: 'Particles accelerate toward a gravitational center, warping space and time in their spiraling trajectories.',
    module: () => import('../artworks/particle-warp-field.js')
  },
  {
    id: 'neural-pulse-grid',
    title: 'Neural Pulse Grid',
    description: 'A living network of interconnected nodes pulses with energy, resembling synaptic connections in a digital brain.',
    module: () => import('../artworks/neural-pulse-grid.js')
  },
  {
    id: 'quantum-mirror',
    title: 'Quantum Mirror',
    description: 'Particles explode outward in perfect symmetry, creating a kaleidoscopic dance of light and shadow.',
    module: () => import('../artworks/quantum-mirror.js')
  },
  {
    id: 'ocean-currents',
    title: 'Ocean Currents',
    description: 'Flowing wave patterns ebb and surge across the canvas, capturing the eternal rhythm of the sea.',
    module: () => import('../artworks/ocean-currents.js')
  },
  {
    id: 'spiral-nebula',
    title: 'Spiral Nebula',
    description: 'Countless particles spiral outward in graceful arms, mimicking the birth of stars in distant galaxies.',
    module: () => import('../artworks/spiral-nebula.js')
  },
  {
    id: 'breathing-mandala',
    title: 'Breathing Mandala',
    description: 'Geometric forms pulse and rotate in harmonious synchronicity, creating a meditative living pattern.',
    module: () => import('../artworks/breathing-mandala.js')
  },
  {
    id: 'recursive-echoes',
    title: 'Recursive Echoes',
    description: 'Concentric waves ripple outward from an invisible source, each echo fading into the void like memories.',
    module: () => import('../artworks/recursive-echoes.js')
  },
  {
    id: 'dynamic-vector-flow',
    title: 'Dynamic Vector Flow',
    description: 'Countless threads of light weave through noise-driven pathways, creating a tapestry of perpetual motion.',
    module: () => import('../artworks/dynamic-vector-flow.js')
  },
  {
    id: 'shuriken',
    title: 'Shuriken',
    description: 'Particles trace parametric paths in spinning formations, drawing ancient symbols of balance and energy.',
    module: () => import('../artworks/Shuriken.js')
  },
  {
    id: 'lumintree',
    title: 'LuminTree',
    description: 'A luminous fractal tree sways with the breath of invisible wind, its branches reaching toward infinite recursion.',
    module: () => import('../artworks/LuminTree.js')
  },
  {
    id: 'harmonic-interference',
    title: 'Harmonic Interference',
    description: 'Waves collide and merge, generating intricate moiré patterns that shimmer like ripples on a cosmic pond.',
    module: () => import('../artworks/Harmonic-Interference.js')
  },
  {
    id: 'morphing-hexagrid',
    title: 'Morphing Hexagrid',
    description: 'A crystalline lattice breathes and rotates, each hexagonal cell pulsing with synchronized mathematical life.',
    module: () => import('../artworks/Morphing-Hexagrid.js')
  }
];