<script module lang="ts">
  const normalizeArrayVec3 = ([x, y, z]: [number, number, number]) => {
    const length = Math.sqrt(x * x + y * y + z * z);
    return [x / length, y / length, z / length] as [number, number, number];
  };
</script>

<script lang="ts">
  import { interactivity } from "@threlte/extras";
  import { T } from "@threlte/core";

  import { watch } from "runed";

  import * as THREE from "three";
  import MainShape from "./MainShape/MainShape.svelte";
  import { spring } from "svelte/motion";
  import { type EventHandler } from "../../lib/utils/createEventHandler";

  const sceneScale = 0.125;

  const { activeIndex } = $props();

  interactivity();
  const ORIGIN = new THREE.Vector3();

  let cameraRef: THREE.PerspectiveCamera | undefined = $state();

  const randomRotationAxisValue = () => {
    return (Math.random() * 2 - 1) * 2;
  };

  const sceneRotations: Array<[number, number, number]> = [
    [0, 0, 0],
    [randomRotationAxisValue(), randomRotationAxisValue(), 0],
    [0, randomRotationAxisValue(), randomRotationAxisValue()],
    [randomRotationAxisValue(), 0, randomRotationAxisValue()],
    [0, randomRotationAxisValue(), randomRotationAxisValue()],
    [randomRotationAxisValue(), randomRotationAxisValue(), 0],
  ];

  let activeRotationIndex = $state(0);

  const activeRotation = spring(
    { value: sceneRotations[0] },
    { stiffness: 0.008, damping: 0.12, precision: 0.0001 }
  );

  $effect(() => {
    $activeRotation.value && cameraRef?.lookAt(ORIGIN);
  });

  const handleEvent: EventHandler = (evt) => {
    activeRotationIndex = (activeRotationIndex + 1) % sceneRotations.length;
    activeRotation.set({
      value: sceneRotations[activeRotationIndex],
    });
  };

  watch(() => activeIndex, handleEvent, { lazy: true });
</script>

<T.PerspectiveCamera
  bind:ref={cameraRef}
  makeDefault={true}
  position={[1, 0, 0]}
  fov={20}
  oncreate={(ref) => {
    ref.lookAt(ORIGIN);
  }}
/>

<T.Group
  scale={[sceneScale, sceneScale, sceneScale]}
  rotation={$activeRotation.value}
>
  <MainShape {activeIndex} />
</T.Group>
