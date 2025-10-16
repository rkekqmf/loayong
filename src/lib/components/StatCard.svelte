<!-- components/StatCard.svelte -->
<script lang="ts">
  export let value: string | number;
  export let description: string;
  export let icon: string = '';
</script>

<div class="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center hover:border-primary-500/50 transition-all duration-300">
  {#if icon}
    <div class="text-3xl mb-3">{icon}</div>
  {/if}
  <div class="text-3xl font-bold text-primary-500 mb-2">{value}</div>
  <div class="text-gray-400">{description}</div>
</div>