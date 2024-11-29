import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.widgets import Slider

G = 6.67430e-11
AU = 1.496e11
dt = 3600 * 24
n_steps = 365

SCALE_FACTOR = 0.000005


class Body:
    def __init__(self, name, mass, position, velocity, size):
        self.name = name
        self.mass = mass
        self.position = np.array(position, dtype=np.float64)
        self.velocity = np.array(velocity, dtype=np.float64)
        self.size = size * SCALE_FACTOR

    def __repr__(self):
        return f"{self.name}: pos={self.position}, vel={self.velocity}"


def compute_gravitational_force(body1, body2):
    r = body2.position - body1.position
    distance = np.linalg.norm(r)
    if distance == 0:
        return np.array([0.0, 0.0])
    force_magnitude = G * body1.mass * body2.mass / distance**2
    force_direction = r / distance
    return force_magnitude * force_direction


def update_positions_and_velocities(bodies):
    forces = {body: np.zeros(2) for body in bodies}
    for i, body1 in enumerate(bodies):
        for j, body2 in enumerate(bodies):
            if i != j:
                forces[body1] += compute_gravitational_force(body1, body2)
    for body in bodies:
        acceleration = forces[body] / body.mass
        body.velocity += acceleration * dt
        body.position += body.velocity * dt


sun = Body("Sun", 1.989e30, [0, 0], [0, 0], 1_391_000)
mercury = Body("Mercury", 3.285e23, [0.39 * AU, 0], [0, 47.87e3], 4_880)
venus = Body("Venus", 4.867e24, [0.723 * AU, 0], [0, 35.02e3], 12_104)
earth = Body("Earth", 5.972e24, [AU, 0], [0, 29.78e3], 12_742)
mars = Body("Mars", 6.39e23, [1.5 * AU, 0], [0, 24.077e3], 6_779)
jupiter = Body("Jupiter", 1.898e27, [5.2 * AU, 0], [0, 13.07e3], 139_820)
saturn = Body("Saturn", 5.683e26, [9.5 * AU, 0], [0, 9.69e3], 116_460)
uranus = Body("Uranus", 8.681e25, [19.8 * AU, 0], [0, 6.81e3], 50_724)
neptune = Body("Neptune", 1.024e26, [30.1 * AU, 0], [0, 5.43e3], 49_244)
bodies = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]

fig, ax = plt.subplots(figsize=(12, 12))
ax.set_xlim(-35 * AU, 35 * AU)
ax.set_ylim(-35 * AU, 35 * AU)
ax.set_aspect('equal')

points = {
    body: ax.plot([], [], 'o', label=body.name, markersize=body.size, alpha=0.8)[0]
    for body in bodies
}
ax.legend()

labels = {
    body: ax.text(
        body.position[0], body.position[1] + body.size * AU * 0.0000005,
        body.name, fontsize=8, ha='center', color='black'
    )
    for body in bodies
}

trail_lines = {
    body: ax.plot([], [], '-', lw=0.5, alpha=0.5)[0]
    for body in bodies if body.name != "Sun"
}
positions_history = {body: ([], []) for body in bodies if body.name != "Sun"}


def init():
    for point in points.values():
        point.set_data([], [])
    for label in labels.values():
        label.set_position((0, 0))
    for trail in trail_lines.values():
        trail.set_data([], [])
    return list(points.values()) + list(labels.values()) + list(trail_lines.values())


def update(frame):
    update_positions_and_velocities(bodies)
    for body, point in points.items():
        point.set_data([body.position[0]], [body.position[1]])
        labels[body].set_position((body.position[0], body.position[1] + body.size * AU * 0.0000005))
        if body.name != "Sun":
            positions_history[body][0].append(body.position[0])
            positions_history[body][1].append(body.position[1])
            trail_lines[body].set_data(positions_history[body][0], positions_history[body][1])
    return list(points.values()) + list(labels.values()) + list(trail_lines.values())


def update_mass(val, body_name):
    body = next(b for b in bodies if b.name == body_name)
    body.mass = body.mass * val


slider_positions = [
    [0.85, 0.6 + i * 0.03, 0.1, 0.04] for i in range(len(bodies))
]
sliders = {}
for i, body in enumerate(bodies[::-1]):
    ax_slider = plt.axes(slider_positions[i], facecolor='lightgoldenrodyellow')
    slider = Slider(ax_slider, body.name, 0.1, 10, valinit=1, valstep=0.1)
    slider.on_changed(lambda val, body_name=body.name: update_mass(val, body_name))
    sliders[body.name] = slider

ax_slider_label = plt.axes([0.85, 0.9, 0.1, 0.02], frameon=False)
ax_slider_label.axis("off")
ax_slider_label.text(
    0.5, 0.5, "Change mass", ha="center", va="center", fontsize=16, color="black"
)


ani = FuncAnimation(fig, update, frames=n_steps, init_func=init, blit=True, interval=50)

plt.show()
