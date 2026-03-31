---
title: Interactive globe
heroImage: img-00.jpg
subtitle: "Geolocated stories in a 3D navigation experience"
focusLevel: 1
tags:
  - code
  - design
year: 2020
tasks:
  - prototyping
  - interaction design
  - programming
tools:
  - React 17
  - ThreeJs
  - GSAP
  - glsl
---

TODO
add video (globe_record_l or globe_record_s, also screenshots of SDF in comments)

- Mobile first UI
- Carefully designed animations and transitions (camera, UI, etc.)
- Custom shaders for a unique result: night/day blending, atmospheric effect, stars background

Delivered:
- Self-contained, configurable React component, with dependancies on Threejs and GSAP
- Minimal EventBus pattern (no redux on the project)

Fun detail: "Real-time" sun direction, using (approximative) geolocation and time of the year
