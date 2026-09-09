import { mkdir, rm } from 'node:fs/promises';
import {
  BINARY_FILE,
  BUILD_TARGET,
  DIST_DIR,
  MIGRATIONS_DIR,
  PROJECT_DIR,
  SERVER_ENTRY,
} from './constants';

const vite = Bun.spawn(['bun', '--bun', 'vite', 'build'], {
  cwd: PROJECT_DIR,
  stderr: 'inherit',
  stdout: 'inherit',
});

if ((await vite.exited) !== 0) {
  process.exit(1);
}

await rm(DIST_DIR, { force: true, recursive: true });
await mkdir(DIST_DIR, { recursive: true });

const result = await Bun.build({
  entrypoints: [SERVER_ENTRY],
  compile: {
    outfile: BINARY_FILE,
    assets: [MIGRATIONS_DIR],
    // omitted entirely (not set to undefined) so Bun falls back to the host platform
    ...(BUILD_TARGET ? { target: BUILD_TARGET } : {}),
  },
  format: 'esm',
});

if (!result.success) {
  console.error(...result.logs);
  process.exit(1);
}
