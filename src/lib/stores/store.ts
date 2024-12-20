import { writable } from 'svelte/store';

export const searchStore = writable('');

export const activeComponents = writable(['calculator']);

export const activeSection = writable('character-info');

export const sectionToggles = writable({
	'character-info': true,
	'combat-stats': true,
	equipment: true,
	collections: true,
	achievements: true
});
