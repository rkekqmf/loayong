import { writable } from 'svelte/store';

export const searchStore = writable('');

export const activeComponents = writable(['calculator']);
