import { fileURLToPath } from 'node:url';
export default {
	build: {
		rollupOptions: {
			external: [fileURLToPath(new URL('src/style.css', import.meta.url))]
		}
	}
};