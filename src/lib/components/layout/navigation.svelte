<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// 테마 스토어 생성
	const theme = writable(typeof window !== 'undefined' ? localStorage.getItem('theme') || '' : 'theme-dark');

	// 테마 아이콘 데이터
	const themes = [
		{ id: '', icon: '🌿', label: '기본' },
		{ id: 'theme-dark', icon: '🌙', label: '다크' },
		{ id: 'theme-light', icon: '☀️', label: '라이트' }
	];

	// 테마 변경 함수
	function setTheme(newTheme: string) {
		document.documentElement.className = newTheme;
		localStorage.setItem('theme', newTheme);
		theme.set(newTheme);
	}

	// 초기 테마 설정
	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			setTheme(savedTheme);
		}
	});
</script>

<nav class=" z-50 flex min-h-[65px] w-full items-center justify-between bg-bg-300 px-4">
	<a href="/" class="text-2xl font-bold transition-colors hover:text-emerald-300"> MO </a>

	<div class="flex items-center gap-2">
		<!-- <div class="flex">
			<div class="h-[65px] w-[100px] bg-primary-100 text-center">primary-100</div>
			<div class="h-[65px] w-[100px] bg-primary-200 text-center">primary-200</div>
			<div class="h-[65px] w-[100px] bg-primary-300 text-center">primary-300</div>
			<div class="h-[65px] w-[100px] bg-accent-100 text-center">accent-100</div>
			<div class="h-[65px] w-[100px] bg-accent-200 text-center">accent-200</div>
			<div class="h-[65px] w-[100px] bg-text-100 text-center">text-100</div>
			<div class="h-[65px] w-[100px] bg-text-200 text-center">text-200</div>
			<div class="h-[65px] w-[100px] bg-bg-100 text-center">bg-100</div>
			<div class="h-[65px] w-[100px] bg-bg-200 text-center">bg-200</div>
			<div class="h-[65px] w-[100px] bg-bg-300 text-center">bg-300</div>
		</div> -->
		<!-- {#each themes as { id, icon, label }}
			<button class="rounded-full p-2 transition-all duration-200 hover:scale-110 {$theme === id ? 'bg-app-input' : ''}" on:click={() => setTheme(id)} title={label}>
				<span class="text-xl">{icon}</span>
			</button>
		{/each} -->
	</div>
</nav>

<style>
	button {
		border: none;
		cursor: pointer;
		background: transparent;
	}

	button:hover {
		animation: bounce 0.5s;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}
</style>
