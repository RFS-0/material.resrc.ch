import vercel from 'solid-start-vercel';
import solid from 'solid-start/vite';
import devtools from 'solid-devtools/vite';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [
        devtools({
                autoname: true,
            },
        ),
        solid({
            ssr: false,
            adapter: vercel({}),
        })],
    server: {
        port: 3000,
    }
});
