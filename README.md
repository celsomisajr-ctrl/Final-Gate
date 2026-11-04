# Final Gate

A one-life 3D boss fight that runs in the browser, on desktop and phone.

Pick a hero (Swordsman, Shaman, Archer, Gunner or Brawler), spend 10 stat points, choose two skills, then open the gate. The boss and its four powers are rolled fresh every attempt, and you only get one life.

**Play:** https://celsomisajr-ctrl.github.io/Final-Gate/

## Controls

| | Desktop | Phone |
|---|---|---|
| Move | WASD or arrow keys | Drag on the arena (left half in landscape) |
| Skills | 1 and 2 (or Q and E) | Skill buttons |
| Ultimate | R | Ultimate button |
| Basic attack | Automatic when the boss is in range | Automatic |
| Pause | Esc | Pause button |

Turn your phone sideways for the full-screen layout with the joystick on the left and skills on the right.

## Tech

Everything is in one self-contained `index.html`: game logic, a small hand-written WebGL 3D renderer, synthesized sound effects, and no external libraries. It works offline. If a device can't run WebGL, the game falls back to a flat 2D view.
