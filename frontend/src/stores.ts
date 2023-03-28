import { writable } from "svelte/store";

export const logged = writable(localStorage.getItem('logged'))
logged.subscribe(val => localStorage.setItem('logged', val === 'true' ? 'true' : 'false'))

export const id = writable(localStorage.getItem('id') || '0')
id.subscribe(val => localStorage.setItem('id', val))