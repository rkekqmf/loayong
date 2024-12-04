<script>
	const tableTitles = ['TA', 'TB', 'TC'];
	const values = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.0, 0.4, 0.4, 0.4, 0.4, 0.4];
</script>

<section class="relative flex flex-[2] flex-col items-center justify-center gap-9 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-8 shadow-box">
	<h2 class=" text-center font-bold text-white">Title</h2>
	<p class=" text-center text-white/70">(description)</p>

	<div class="flex gap-6">
		<!-- Farming Column -->
		<div class="flex flex-col">
			<div class="mb-3 border-b border-white/20 pb-3 text-center text-white">subTitle</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="col-span-3 grid grid-cols-3">
					{#each tableTitles as title}
						<div class="text-center text-white">{title}</div>
					{/each}
				</div>
				{#each values as value}
					<div class="text-center text-white">{value}</div>
				{/each}
			</div>
		</div>

		<!-- Farming Column -->
		<div class="flex flex-col">
			<div class="mb-3 border-b border-white/20 pb-3 text-center text-white">XD</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="col-span-3 grid grid-cols-3">
					<div class="text-center text-white">T1</div>
					<div class="text-center text-white">T2</div>
					<div class="text-center text-white">T3</div>
				</div>
				{#each values as value}
					<div class="text-center text-white">{value}</div>
				{/each}
			</div>
		</div>
	</div>
</section>
