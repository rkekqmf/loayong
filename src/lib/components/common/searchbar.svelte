<script lang="ts">
	export let searchQuery: string;
	export let handleSearch: () => void;

	const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>`;
</script>

<div class="relative w-full">
	<input
		type="text"
		class="peer h-[55px] w-full rounded-xl bg-bg-300 py-3 pl-12 pr-4 text-base placeholder-text-200 transition-colors duration-200 ease-in-out focus:border-2 focus:border-primary-100 focus:bg-bg-200 focus:outline-none md:pl-14 md:text-2xl"
		placeholder="닉네임"
		bind:value={searchQuery}
		on:keydown={(e) => e.key === 'Enter' && handleSearch()}
	/>
	<button class="absolute inset-y-0 right-5 flex items-center text-base text-text-200 transition-colors duration-200 ease-in-out hover:text-text-100 md:text-2xl" on:click={handleSearch}>검색</button>
	<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-200 transition-colors duration-200 ease-in-out peer-focus:text-primary-100">
		{@html searchIcon}
	</div>
</div>
