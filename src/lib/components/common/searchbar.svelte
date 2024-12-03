<script lang="ts">
	export let searchQuery: string;
	export let handleSearch: () => void;

	const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>`;
</script>

<div class="w-full">
	<div class="relative">
		<input
			type="text"
			class="h-[55px] w-full rounded-xl border-2 border-app-input-border
             bg-app-input py-3 pl-20 pr-4 text-2xl text-app-text
             placeholder-app-text-muted transition-all duration-200
             ease-in-out hover:bg-app-input-hover hover:placeholder-app-text
             focus:outline-none"
			placeholder="안녕하세용 검색입니당"
			bind:value={searchQuery}
			on:keydown={(e) => e.key === 'Enter' && handleSearch()}
		/>
		<button class="absolute inset-y-0 right-5 flex items-center text-2xl text-app-text" on:click={handleSearch}>검색</button>
		<div class="pointer-events-none absolute inset-y-0 left-5 flex items-center text-2xl text-app-text">
			{@html searchIcon}
		</div>
	</div>
</div>
