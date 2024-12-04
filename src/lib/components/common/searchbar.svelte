<script lang="ts">
	export let searchQuery: string;
	export let handleSearch: () => void;

	const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>`;
</script>

<div class="w-full">
	<div class="relative">
		<input
			type="text"
			class="h-[55px] w-full rounded-xl border-2 border-app-input-border
             bg-app-input py-3 pl-12 pr-4 text-base text-app-text placeholder-app-text-muted
             transition-all duration-200 ease-in-out
             hover:bg-app-input-hover hover:placeholder-app-text focus:outline-none md:pl-14
             md:text-2xl"
			placeholder="닉네임"
			bind:value={searchQuery}
			on:keydown={(e) => e.key === 'Enter' && handleSearch()}
		/>
		<button class="absolute inset-y-0 right-5 flex items-center text-base text-app-text md:text-2xl" on:click={handleSearch}>검색</button>
		<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-app-text">
			{@html searchIcon}
		</div>
	</div>
</div>
