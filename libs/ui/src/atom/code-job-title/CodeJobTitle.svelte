<script context="module" lang="ts">
export const JOB_TITLES = [
	"software",
	"full-stack",
	"front-end",
	"back-end",
	"web",
	"Svelte",
	"React",
	"TypeScript",
	"JavaScript",
	"Node.js",
] as const;
export type JobTitle = (typeof JOB_TITLES)[number];

class Writetyper {
	#current_job_title_index = 0;
	#current_char_index = 0;
	public output = $state<string>(this.job_title);

	#typing_char_interval: NodeJS.Timeout | undefined;
	#backspacing_output_interval: NodeJS.Timeout | undefined;

	constructor() {
		setTimeout(() => {
			this.#start_backspacing_output();
		}, 1000);
	}

	public get job_title(): JobTitle {
		return JOB_TITLES[this.#current_job_title_index] as JobTitle;
	}

	#update_index(): void {
		if (this.#current_job_title_index === JOB_TITLES.length - 1) this.#current_job_title_index = 0;
		else this.#current_job_title_index++;
	}

	#start_backspacing_output(): void {
		this.#backspacing_output_interval = this.#create_backspacing_output_interval();
	}

	#create_backspacing_output_interval(): NodeJS.Timeout {
		return setInterval(() => {
			this.#backspace_output();
		}, 60);
	}

	#backspace_output(): void {
		if (!this.output) this.#stop_backspacing_output();
		else this.output = this.output.slice(0, -1);
	}

	#stop_backspacing_output(): void {
		clearInterval(this.#backspacing_output_interval);
		this.#backspacing_output_interval = undefined;
		this.#update_index();
		this.#start_typing_char();
	}

	#start_typing_char(): void {
		this.#typing_char_interval = this.#create_char_interval();
	}

	#create_char_interval(): NodeJS.Timeout {
		return setInterval(() => {
			this.#print_char();
		}, 120);
	}

	#print_char() {
		const { job_title } = this;
		if (this.#current_char_index < job_title.length) {
			this.output += job_title[this.#current_char_index];
			this.#current_char_index++;
		} else {
			this.#stop_typing_char();
		}
	}

	#stop_typing_char(): void {
		clearInterval(this.#typing_char_interval);
		this.#typing_char_interval = undefined;
		this.#current_char_index = 0;
		setTimeout(() => {
			this.#start_backspacing_output();
		}, 1000);
	}

	public clear_intervals(): void {
		this.#stop_typing_char();
		this.#stop_backspacing_output();
	}
}
</script>

<script lang="ts">
	import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";

	import { Code } from "#semantic/code/mod";

	interface Props extends WithClass {}

	let { class: class_ }: Props = $props();

	const writetyper = new Writetyper();

	$effect(() => {
		() => writetyper.clear_intervals();
	});
</script>

<Code color="accent" class={merge_classes("code-job-title", class_)}>
	{writetyper.output}
</Code>
