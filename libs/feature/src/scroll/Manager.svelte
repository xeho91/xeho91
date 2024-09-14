<script lang="ts" context="module">
export type ScrollDirection = "down" | "up";

const SAFETY = 10;

class State {
	#previous_window_y = 0;
	#window_y = $state(0);
	window_inner_height = $state(0);
	body_client_height = $state(0);

	set window_y(offset: number) {
		this.#previous_window_y = this.window_y;
		this.#window_y = offset;
	}

	public get window_y(): number {
		return this.#window_y;
	}

	public get max_window_y(): number {
		const { body_client_height, window_inner_height } = this;
		return body_client_height - window_inner_height;
	}

	public get is_at_top(): boolean {
		return this.window_y <= 0 + SAFETY;
	}

	public get is_at_bottom(): boolean {
		return this.window_y >= this.max_window_y - SAFETY;
	}

	public get direction(): ScrollDirection {
		return this.#previous_window_y > this.window_y ? "up" : "down";
	}
}

export const scroll = new State();
</script>

<svelte:window
	bind:scrollY={scroll.window_y}
	bind:innerHeight={scroll.window_inner_height}
/>

<svelte:body bind:clientHeight={scroll.body_client_height} />
