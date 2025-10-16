<!-- src/routes/+layout.svelte -->
<script>
  import '../app.pcss';
  
  let { children } = $props();
</script>

{@render children()}
