import { writable } from 'svelte/store';

export const searchStore = writable('');

export const activeComponents = writable(['calculator']);

export const activeSection = writable('arkpassive');

export const sectionToggles = writable({
	sasagae: true,
	arkpassive: true,
	'combat-stats': true,
	equipment: true,
	collections: true,
	achievements: true
});
