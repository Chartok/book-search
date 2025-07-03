/// <reference types="vite/client" />
// src/vite-env.d.ts
interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	// add other env vars here
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
