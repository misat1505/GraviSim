import { AU } from "@/constants";
import { Body } from "../types/Body";

const G = 6.67430e-11;
const massOfSun = 1.989e30;

const calculateInitialVelocity = (position: [number, number], massOfSun: number): [number, number] => {
  const r = Math.sqrt(position[0] ** 2 + position[1] ** 2);
  const v = Math.sqrt(G * massOfSun / r);
  
  const velocityX = -position[1] / r * v;
  const velocityY = position[0] / r * v;

  return [velocityX, velocityY];
};

const mercury_position: [number, number] = [-0.388481 * AU, -0.157692 * AU];
const venus_position: [number, number] = [0.453472 * AU, 0.523121 * AU];
const earth_position: [number, number] = [-0.178600 * AU, 0.887224 * AU];
const mars_position: [number, number] = [-0.521577 * AU, 1.381600 * AU];
const jupiter_position: [number, number] = [1.056247 * AU, 4.578783 * AU];
const saturn_position: [number, number] = [9.463669 * AU, -1.482112 * AU];
const uranus_position: [number, number] = [11.103997 * AU, 14.799690 * AU];
const neptune_position: [number, number] = [29.892156 * AU, -0.313781 * AU];

export const bodies: Body[] = [
  {
    name: "Sun",
    mass: 1.989e30,
    position: [0, 0],
    velocity: [0, 0],
    size: 1_391_000_000,
    color: "yellow",
    trace: [[0, 0]],
    isShowingTrace: true,
  },
  {
    name: "Mercury",
    mass: 3.285e23,
    position: mercury_position,
    velocity: calculateInitialVelocity(mercury_position, massOfSun),
    size: 4_880_000,
    color: "gray",
    trace: [mercury_position],
    isShowingTrace: true,
  },
  {
    name: "Venus",
    mass: 4.867e24,
    position: venus_position,
    velocity: calculateInitialVelocity(venus_position, massOfSun),
    size: 12_104_000,
    color: "orange",
    trace: [venus_position],
    isShowingTrace: true,
  },
  {
    name: "Earth",
    mass: 5.972e24,
    position: earth_position,
    velocity: calculateInitialVelocity(earth_position, massOfSun),
    size: 12_742_000,
    color: "blue",
    trace: [earth_position],
    isShowingTrace: true,
  },
  {
    name: "Mars",
    mass: 6.39e23,
    position: mars_position,
    velocity: calculateInitialVelocity(mars_position, massOfSun),
    size: 6_779_000,
    color: "red",
    trace: [mars_position],
    isShowingTrace: true,
  },
  {
    name: "Jupiter",
    mass: 1.898e27,
    position: jupiter_position,
    velocity: calculateInitialVelocity(jupiter_position, massOfSun),
    size: 139_820_000,
    color: "brown",
    trace: [jupiter_position],
    isShowingTrace: true,
  },
  {
    name: "Saturn",
    mass: 5.683e26,
    position: saturn_position,
    velocity: calculateInitialVelocity(saturn_position, massOfSun),
    size: 116_460_000,
    color: "goldenrod",
    trace: [saturn_position],
    isShowingTrace: true,
  },
  {
    name: "Uranus",
    mass: 8.681e25,
    position: uranus_position,
    velocity: calculateInitialVelocity(uranus_position, massOfSun),
    size: 50_724_000,
    color: "cyan",
    trace: [uranus_position],
    isShowingTrace: true,
  },
  {
    name: "Neptune",
    mass: 1.024e26,
    position: neptune_position,
    velocity: calculateInitialVelocity(neptune_position, massOfSun),
    size: 49_244_000,
    color: "blueviolet",
    trace: [neptune_position],
    isShowingTrace: true,
  },
];
