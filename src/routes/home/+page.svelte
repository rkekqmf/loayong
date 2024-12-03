<script>
	import Calculator from './components/calculator.svelte';
	import Homework from './components/homework.svelte';
</script>

<div class="flex gap-4">
	<section class="relative flex flex-[2] flex-col items-center justify-center gap-2 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-8 shadow-box">
		<Homework />
	</section>
	<div class="flex flex-[1] flex-col gap-4">
		<section class="relative flex flex-[2] items-center justify-center gap-9 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-8 shadow-box">
			<Calculator />
		</section>

		<section class="relative flex flex-[1] items-center justify-center gap-9 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-8 shadow-box">
			<Calculator />
		</section>
	</div>
</div>
