<script lang="ts">
  import { T, useTask } from "@threlte/core";

  import { watch } from "runed";

  import type { EventHandler } from "../../../lib/utils/createEventHandler";

  import { Spring } from "svelte/motion";
  import { createToggleStore } from "../../../lib/utils/stores";

  // @ts-expect-error - No Type delcaration for shader
  import sphericCubeVert from "./sphericCube.vert";
  // @ts-expect-error - No Type delcaration for shader
  import sphericCubeFrag from "./sphericCube.frag";
  import { onMount } from "svelte";

  const { activeIndex } = $props();

  const cubeSize = 1;
  const sphereRadius = 0.6180339887; // golden ratio
  const details = Math.pow(2, 6);

  function hexToNormalizedRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          /*	r */ parseInt(result[1], 16) / 255,
          /*	g */ parseInt(result[2], 16) / 255,
          /*	b */ parseInt(result[3], 16) / 255,
        ]
      : null;
  }

  const color1 = hexToNormalizedRgb(
    getComputedStyle(document.body).getPropertyValue("--highlight-color1")
  );
  const color2 = hexToNormalizedRgb(
    getComputedStyle(document.body).getPropertyValue("--highlight-color2")
  );

  const initialRoundness = 0;
  const roundnessTarget = createToggleStore(0, 1);

  const springParams = {
    roundToSquare: {
      stiffness: 0.055,
      damping: 0.12,
    },
    squareToRound: {
      stiffness: 0.1,
      damping: 0.35,
    },
  };

  const roundness = new Spring(initialRoundness, {
    ...springParams.squareToRound,
    precision: 0.0001,
  });

  $effect(() => {
    roundness.set($roundnessTarget);
  });

  const handleEvent: EventHandler = () => {
    if ($roundnessTarget === 1) {
      roundness.stiffness = springParams.roundToSquare.stiffness;
      roundness.damping = springParams.roundToSquare.damping;
    } else {
      roundness.stiffness = springParams.squareToRound.stiffness;
      roundness.damping = springParams.squareToRound.damping;
    }
    roundnessTarget.toggle();
  };

  watch(() => activeIndex, handleEvent, { lazy: true });

  let time = $state(0);

  useTask((delta) => {
    time += delta;
  });
</script>

<T.Group rotation={[0, 0, 0]}>
  <!-- <T.Mesh
    onclick={handleClick}
    onpointerenter={() => {
      document.body.style.cursor = "pointer";
    }}
    onpointerleave={() => {
      document.body.style.cursor = "default";
    }}
  > -->
  <T.Mesh>
    {#if $roundnessTarget === 1}
      <T.SphereGeometry args={[sphereRadius, details, details]} />
    {:else}
      <T.BoxGeometry
        args={[cubeSize, cubeSize, cubeSize, details, details, details]}
      />
    {/if}
    <T.MeshBasicMaterial visible={false} />
  </T.Mesh>
  <T.Mesh>
    <T.BoxGeometry
      args={[cubeSize, cubeSize, cubeSize, details, details, details]}
    />
    <T.ShaderMaterial
      uniforms={{
        cubeSize: { value: cubeSize },
        sphereRadius: { value: sphereRadius },
        lightDir: { value: [0, 0.4, 2] },
        color1: { value: color1 },
        color2: { value: color2 },
      }}
      uniforms.roundness={{ value: roundness.current }}
      uniforms.noiseIntensity={{ value: Math.sin(time * 2) * 0.3 }}
      uniforms.noiseOffset={{ value: time * 0.075 }}
      uniforms.noiseScale={{ value: Math.sin(time * 0.5) * 0.5 + 0.5 }}
      vertexShader={sphericCubeVert}
      fragmentShader={sphericCubeFrag}
    />
  </T.Mesh>
</T.Group>
