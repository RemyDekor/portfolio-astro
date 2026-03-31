<script lang="ts">
  import { onMount } from "svelte";
  import { filtersState } from "../features/filters/store";

  onMount(() => {
    const ret = filtersState.listen((v) => console.log("in Filters.svelte", v));
    return () => {
      ret();
    };
  });
</script>

<div class="filters">
  {#each Object.keys($filtersState) as key, index}
    <input
      type="checkbox"
      id={`filter-${key}`}
      name={`filter-${key}`}
      bind:checked={
        () => $filtersState[key],
        (value) => {
          filtersState.setKey(key, value);
        }
      }
    />
    <label for={`filter-${key}`} class="underlined interactive">{key}</label>
    {#if index !== Object.keys($filtersState).length - 1}
      <span class="separator">|</span>
    {/if}
  {/each}
</div>

<style>
  .filters {
    width: fit-content;
    pointer-events: auto;

    display: flex;

    margin: 0;
    font-size: 1.3rem;

    text-shadow:
      0 0.1ex 0.5em var(--bg-color),
      0 0.1ex 1.5em var(--bg-color);
  }
  .filters input[type="checkbox"] {
    opacity: 0;
    position: absolute;
  }

  .filters label {
    cursor: pointer;
    border-radius: 0.333rem;
    transition: all 0.15s ease;

    @media (any-hover: hover) {
      &:hover {
        opacity: 1 !important;
      }
    }
  }

  .filters input[type="checkbox"]:focus-visible + label {
    text-underline-offset: 0.5ex;
  }

  .filters input[type="checkbox"]:checked + label {
    text-underline-offset: 0.55ex;
    text-decoration-thickness: 0.35ex;
    font-weight: 600;
  }

  .filters:has(input[type="checkbox"]:checked)
    :not(input[type="checkbox"]:checked, :focus-visible)
    + label {
    opacity: 0.5;
  }

  .filters .separator {
    padding-inline: 1.2ch;
  }
</style>
