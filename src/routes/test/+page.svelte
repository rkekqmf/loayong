<script lang="ts">
	import TestComponent from './testComponent.svelte';

	// count
	let count = $state(10);
	const doubleCount = $derived(count * 3);

	// input
	let inputElement: HTMLInputElement;
	let clientWidth = $state(50);
	$effect(() => {
		inputElement.focus();
		console.log(inputElement);
		console.log(clientWidth);
	});

	// traffic light
	const TRAFFIC_LIGHTS = ['red', 'orange', 'green'];
	let lightIndex = $state(0);

	const light = $derived(TRAFFIC_LIGHTS[lightIndex]);

	function nextLight() {
		lightIndex = (lightIndex + 1) % TRAFFIC_LIGHTS.length;
	}

	// time
	let time = $state(new Date().toLocaleTimeString());

	$effect(() => {
		const timer = setInterval(() => {
			time = new Date().toLocaleTimeString();
		}, 1000);

		return () => clearInterval(timer);
	});

	// onYes and onNo
	let isHappy = $state(true);

	function onAnswerNo() {
		isHappy = false;
	}

	function onAnswerYes() {
		isHappy = true;
	}

	import { setContext } from 'svelte';
	import createUserState from './createUserState.svelte.js';

	const user = createUserState({
		id: 1,
		username: 'unicorn42',
		email: 'unicorn42@example.com'
	});

	setContext('user', user);
</script>

<div>{doubleCount}</div>

<input class="px-4" bind:this={inputElement} bind:clientWidth bind:value={clientWidth} />

<button onclick={nextLight}>Next light</button>
<p>Light is: {light}</p>
<p>
	You must
	{#if light === 'red'}
		<span>STOP</span>
	{:else if light === 'orange'}
		<span>SLOW DOWN</span>
	{:else if light === 'green'}
		<span>GO</span>
	{/if}
</p>

<p>Current time: {time}</p>

<p>Are you happy?</p>
<TestComponent name="John" age={20} favouriteColors={['green', 'blue', 'red']} isAvailable onYes={onAnswerYes} onNo={onAnswerNo} />
<p style="font-size: 50px;">{isHappy ? '😀' : '😥'}</p>

<h1>Welcome back, {user.username}</h1>
<TestComponent onYes={onAnswerYes} onNo={onAnswerNo} />
