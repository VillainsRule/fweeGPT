import path from 'node:path';

await Bun.build({
    entrypoints: [path.join(import.meta.dirname, '../src/main.ts')],
    outdir: path.join(import.meta.dirname, '../dist'),
    target: 'node'
});