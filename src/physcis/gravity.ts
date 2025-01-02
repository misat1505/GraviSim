import { dt, G } from "@/constants";
import { Body } from "@/types/Body";

const computeGravitationalForce = (
  body1: Body,
  body2: Body
): [number, number] => {
  // odległość między ciałami jako wektor [x, y]
  const r = [
    body2.position[0] - body1.position[0],
    body2.position[1] - body1.position[1],
  ];

  // odległość
  const distance = Math.sqrt(r[0] ** 2 + r[1] ** 2);
  if (distance === 0) return [0, 0];

  // F = G * m1 * m2 / r^2
  const forceMagnitude = (G * body1.mass * body2.mass) / distance ** 2;

  // normalizacja
  const forceDirection = [r[0] / distance, r[1] / distance];

  // wektor sił [x, y]
  return [
    forceMagnitude * forceDirection[0],
    forceMagnitude * forceDirection[1],
  ];
};

export const updatePositionsAndVelocities = (bodies: Body[]): Body[] => {
  const forces = bodies.map(() => [0, 0] as [number, number]);

  // dla każdego ciała obliczenie siły wobec wszystkich pozostałych
  for (let i = 0; i < bodies.length; i++) {
    for (let j = 0; j < bodies.length; j++) {
      if (i !== j) {
        const force = computeGravitationalForce(bodies[i], bodies[j]);
        forces[i][0] += force[0];
        forces[i][1] += force[1];
      }
    }
  }

  return bodies.map((body, index) => {
    // a = F / m
    const acceleration = [
      forces[index][0] / body.mass,
      forces[index][1] / body.mass,
    ];

    // v = v0 + a * t
    const newVelocity = [
      body.velocity[0] + acceleration[0] * dt,
      body.velocity[1] + acceleration[1] * dt,
    ];

    // x = x0 + v * t
    const newPosition = [
      body.position[0] + newVelocity[0] * dt,
      body.position[1] + newVelocity[1] * dt,
    ];

    return {
      ...body,
      velocity: newVelocity,
      position: newPosition,
      trace: [...body.trace, newPosition],
    } as Body;
  });
};
