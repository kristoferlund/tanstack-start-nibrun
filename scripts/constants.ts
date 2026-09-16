import { join } from 'node:path';

export const PROJECT_DIR = join(import.meta.dir, '..');
export const DIST_DIR = join(PROJECT_DIR, 'dist');
export const BINARY_FILE = join(DIST_DIR, 'app');
export const SERVER_ENTRY = join(PROJECT_DIR, '.output', 'server', 'index.mjs');
export const MIGRATIONS_DIR = join(PROJECT_DIR, 'src', 'db', 'migrations');

/**
 * The app is deployed on linux x64 (glibc), so builds target it by default: `bun run build`
 * then produces the same artifact on every machine instead of one that silently depends on
 * whoever ran it.
 *
 * Override with BUILD_TARGET to pick any other Bun compile target, e.g. `bun-linux-x64-musl`
 * (Alpine) or `bun-linux-x64-baseline` (CPUs without AVX2). Use `host` to compile for the
 * current machine — see `build:local`.
 *
 * Cross-compiling downloads a *released* Bun for the target platform, so the version in
 * `.bun-version` has to be one npm actually serves.
 */
const DEFAULT_BUILD_TARGET = 'bun-linux-x64';

const buildTarget = process.env.BUILD_TARGET || DEFAULT_BUILD_TARGET;

/**
 * `undefined` means "let Bun pick the host platform".
 */
export const BUILD_TARGET =
  buildTarget === 'host' ? undefined : (buildTarget as Bun.Build.CompileTarget);
