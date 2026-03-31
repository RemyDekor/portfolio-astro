<script lang="ts">
  import { activeIndex } from "../../pages/works/_index_stores";

  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
</script>

<!-- {$activeIndex} -->
<Canvas>
  <Scene activeIndex={$activeIndex} />
</Canvas>
