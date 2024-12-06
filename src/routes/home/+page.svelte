<script>
	import Calculator from './components/calculator.svelte';
	import Homework from './components/homework.svelte';
</script>

<div class="flex flex-col gap-4 md:flex-row">
	<section class="relative flex flex-[2] flex-col items-center justify-center gap-2 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] shadow-box">
		<Calculator />
	</section>
	<div class="flex flex-[1] flex-col gap-4">
		<Homework />

		<section class="relative flex h-full items-center justify-center gap-9 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-8 shadow-box">
			<div class="text-center text-white">
				<h2>Title</h2>
				<p>description</p>
			</div>
		</section>
	</div>
</div>
