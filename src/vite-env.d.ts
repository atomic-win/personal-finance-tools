/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GA_MEASUREMENT_ID?: string;
}

declare module '*?worker' {
	const WorkerFactory: new () => Worker;
	export default WorkerFactory;
}
