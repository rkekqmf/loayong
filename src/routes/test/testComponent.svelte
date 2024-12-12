<script>
	const { name = '', age = null, favouriteColors = [], isAvailable = false, onYes, onNo } = $props();
	import { getContext } from 'svelte';

	const user = getContext('user');
</script>

<p>My name is {name}!</p>
<p>My age is {age}!</p>
<p>My favourite colors are {favouriteColors.join(', ')}!</p>
<p>I am {isAvailable ? 'available' : 'not available'}</p>

<button onclick={onYes}>YES</button>

<button onclick={onNo}>NO</button>

<div>
	<h2>My Profile</h2>
	<p>Username: {user.username}</p>
	<p>Email: {user.email}</p>
	<button onclick={() => (user.username = 'Jane')}> Update username to Jane </button>
</div>
