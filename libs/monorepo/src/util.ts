export type AbsolutePath = `/${string}`;

/** Check if the provided path as string is an absolute path. */
export function is_absolute_path(path: string): path is AbsolutePath {
	return path.startsWith("/");
}
