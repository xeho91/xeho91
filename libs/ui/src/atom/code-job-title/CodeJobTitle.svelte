<script context="module" lang="ts">
export const JOB_TITLES = [
	"software",
	"full-stack",
	"front-end",
	"back-end",
	"web",
	"TypeScript",
	"JavaScript",
	"Node.js",
	"Rust",
	"Svelte",
	"React",
] as const;
export type JobTitle = (typeof JOB_TITLES)[number];
</script>

<script lang="ts">
	import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";
	import { typewriter } from "@xeho91/lib-feature/transition";
	import { onMount, tick } from "svelte";

	import { Code } from "#semantic/code/mod";

	interface Props extends WithClass {}

	let { class: class_ }: Props = $props();

	let is_finished = $state(true);
	let is_mounted = $state(false);
	let current_job_title_index = $state(0);
	let job_title = $derived(JOB_TITLES[current_job_title_index] as JobTitle);

	function handle_intro_end() {
		is_finished = true;
	}

	function handle_outro_end() {
		if (current_job_title_index === JOB_TITLES.length - 1) {
			current_job_title_index = 0;
		} else {
			current_job_title_index++;
		}
		is_finished = false;
	}

	onMount(async () => {
		await tick();
		is_mounted = true;
	});
</script>

<Code color="accent" class={merge_classes("code-job-title", class_)}>
	{#if !is_mounted}
		<span
			out:typewriter|global={{ delay: 5_000, speed: 2 }}
			onoutroend={handle_outro_end}
		>
			{job_title}
		</span>
	{:else if !is_finished}
		<span
			in:typewriter|global={{ speed: 1 }}
			out:typewriter|global={{ delay: 2_000, speed: 2 }}
			onintroend={handle_intro_end}
			onoutroend={handle_outro_end}
		>
			{job_title}
		</span>
	{/if}
</Code>
