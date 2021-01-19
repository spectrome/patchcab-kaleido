<script lang="ts">
  import { Analyser } from 'Tone';
  import { onMount, scale, getEnergy, Faceplate, Knob, Patch, Switch } from '@patchcab/core';
  import shader from './kaleido.lib';

  export let state = {
    valueX: 0.5,
    valueY: 0.5,
    valueZ: 0.5,
    valueQ: 0.5,
    scaleX: 0,
    scaleY: 0,
    scaleZ: 0,
    scaleQ: 0,
    range: 'low' as 'low' | 'mid' | 'high',
  };

  let node = new Analyser('fft', 1024);

  let level = 0;

  $: x = scale(Math.min(state.valueX + state.scaleX * level, 1), [0, 1], [0, 10], 2);
  $: y = scale(Math.min(state.valueY + state.scaleY * level, 1), [0, 1], [0, 3], 2);
  $: z = Math.min(state.valueZ + state.scaleZ * level, 1);
  $: q = Math.min(state.valueQ + state.scaleQ * level, 1);

  const loop = () => {
    requestAnimationFrame(loop);
    const energy = getEnergy(node, state.range);
    level = scale(energy, [-100, -30], [0, 1]);
  };

  onMount(() => {
    loop();
  });
</script>

<style>
  container {
    position: absolute;
    top: 20px;
    left: 20px;
    width: calc(100% - 40px);
    padding-top: 56.25%;
    pointer-events: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }

  canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
</style>

<Faceplate color="#1D1E22">
  <container><canvas use:shader={{ x, y, z, q }} /></container>

  <Knob size="s" label="x" x={20} y={200} bind:value={state.valueX} min={0} max={1} precision={2} />
  <Knob size="s" label="y" x={90} y={200} bind:value={state.valueY} min={0} max={1} precision={2} />
  <Knob size="s" label="z" x={160} y={200} bind:value={state.valueZ} min={0} max={1} precision={2} />
  <Knob size="s" label="q" x={230} y={200} bind:value={state.valueQ} min={0} max={1} precision={2} />

  <Knob size="s" x={20} y={265} bind:value={state.scaleX} min={0} max={1} precision={2} />
  <Knob size="s" x={90} y={265} bind:value={state.scaleY} min={0} max={1} precision={2} />
  <Knob size="s" x={160} y={265} bind:value={state.scaleZ} min={0} max={1} precision={2} />
  <Knob size="s" x={230} y={265} bind:value={state.scaleQ} min={0} max={1} precision={2} />

  <Patch label="audio" x={32} y={320} name="audio-1" input={node} />

  <Switch x={102} y={320} bind:value={state.range} label="low" set="low" />
  <Switch x={172} y={320} bind:value={state.range} label="mid" set="mid" />
  <Switch x={242} y={320} bind:value={state.range} label="high" set="high" />
</Faceplate>
