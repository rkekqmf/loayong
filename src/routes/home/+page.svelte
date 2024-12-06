<script>
	import Calculator from './components/calculator.svelte';
	import Homework from './components/homework.svelte';
	import ClassInfo from './components/class-info.svelte';
</script>

<div class="flex flex-col gap-4 md:flex-row">
	<section class="relative flex flex-[2] flex-col items-center justify-center gap-2 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] shadow-box">
		<Calculator />
	</section>
	<div class="flex flex-[1] flex-col gap-4">
		<Homework />

		<ClassInfo />
	</div>
</div>
