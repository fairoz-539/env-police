# env-police

A zero-configuration CLI tool that ensures environment variable consistency.

`env-police` scans your source code for usage of `process.env` variables and verifies that they are defined in your `.env` file. If required variables are missing, the process exits with an error code, preventing runtime crashes and blocking faulty deployments in CI/CD pipelines.

## Features

* **Recursive Scanning:** Automatically scans all `.js`, `.jsx`, `.ts`, and `.tsx` files in the specified directory.
* **Smart Detection:** Identifies both standard usage (`process.env.KEY`) and destructuring patterns (`const { KEY } = process.env`).
* **CI/CD Integration:** Designed to fail build pipelines (Exit Code 1) if the environment configuration is incomplete.
* **Zero Configuration:** Works immediately with sensible defaults (scans `./src` and checks against `./.env`).

## Installation

You can execute the tool directly via `npx` or install it as a development dependency.

### One-time execution

```bash
npx env-police
```

### Local installation (Recommended)

Installing locally ensures version consistency across your team and CI environments.

```bash
npm install --save-dev env-police
```

## Usage

### Basic Usage

Run the command in your project root. By default, it scans the `src` directory and compares usages against the `.env` file.

```bash
npx env-police
```

### NPM Script Integration

For continuous integration, it is recommended to add `env-police` to your build scripts in `package.json`. This ensures the build fails if environment variables are missing.

```json
{
  "scripts": {
    "prebuild": "env-police",
    "build": "react-scripts build"
  }
}
```

## CLI Options

The tool accepts several flags to customize behavior.

| Option | Alias | Description | Default |
| --- | --- | --- | --- |
| `--path <dir>` | `-p` | Directory to scan for source code. | `./src` |
| `--env <file>` | `-e` | Path to the environment file to validate against. | `./.env` |
| `--version` | `-V` | Output the current version number. | — |
| `--help` | `-h` | Display help information. | — |

## Examples

**Scan a custom server directory:**

```bash
npx env-police --path ./server
```

**Validate against a production environment file:**

```bash
npx env-police --env .env.production
```

**Scan the project root (ignoring node_modules):**

```bash
npx env-police --path .
```

## Technical Details

When executed, `env-police` performs the following operations:

1. **Parse:** Reads the specified `.env` file and extracts defined keys.
2. **Scan:** Recursively walks through the target directory to find JavaScript and TypeScript files.
3. **Analyze:** Uses static analysis to find instances of `process.env` usage.
4. **Validate:** Compares the used variables against the defined keys.
   * If all variables are present, the process exits with code `0`.
   * If variables are missing, it lists them in the console and exits with code `1`.

## License

ISC
