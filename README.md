# 👮‍♂️ env-police

**Stop breaking production because you forgot an environment variable.**

`env-police` is a **zero-config CLI tool** that scans your source code for usage of `process.env` variables and strictly verifies that they are defined in your `.env` file. If any variables are missing, it throws an error—making it ideal for preventing runtime crashes and blocking faulty deployments in CI/CD pipelines.

---

## 🚀 Features

* 🔍 **Auto-Scan**
  Recursively scans all `.js`, `.jsx`, `.ts`, and `.tsx` files.

* 🧠 **Smart Detection**
  Detects both:

  * Standard usage: `process.env.API_KEY`
  * Destructuring: `const { API_KEY } = process.env`

* 🛑 **CI/CD Ready**
  Exits with **error code `1`** if required environment variables are missing.

* ⚙️ **Zero Configuration**
  Works out of the box with sensible defaults.

---

## 📦 Installation

You can run `env-police` directly with `npx`, or install it locally as a development dependency (recommended).

### Using npx (one-time use)

```bash
npx env-police
```

### Install locally (recommended)

```bash
npm install --save-dev env-police
```

Then add it to your `package.json` scripts:

```json
{
  "scripts": {
    "prebuild": "env-police",
    "build": "react-scripts build"
  }
}
```

---

## 🛠 Command Line Options

Run `env-police --help` to see all available options.

| Option         | Alias | Description                                                       | Default  |
| -------------- | ----- | ----------------------------------------------------------------- | -------- |
| `--path <dir>` | `-p`  | Directory to scan for source code. Recursively scans JS/TS files. | `./src`  |
| `--env <file>` | `-e`  | Path to the environment file to validate against.                 | `./.env` |
| `--version`    | `-V`  | Output the current version number.                                | —        |
| `--help`       | `-h`  | Display help information.                                         | —        |

---

## 📖 Usage Examples

### 1. Standard Usage (React / Node defaults)

Scans `./src` and validates against `./.env`.

```bash
npx env-police
```

---

### 2. Scan a Custom Folder

If your backend code lives in a `server` directory:

```bash
npx env-police --path ./server
```

---

### 3. Use a Custom Environment File

Useful for production or environment-specific setups:

```bash
npx env-police --env .env.production
```

---

### 4. Scan Everything in the Project Root

Helpful for small projects or root-level scripts
(`node_modules` is ignored automatically).

```bash
npx env-police --path .
```

---

## 🤖 How It Works

1. Reads and parses keys from your `.env` file.
2. Recursively scans all source files in the specified `--path`.
3. Extracts environment variable usage using regex:

   * `process.env.VAR_NAME`
   * `const { VAR_NAME } = process.env`
4. Compares detected variables with keys in the `.env` file.
5. Reports missing variables:

   * **Exit code `1`** → Missing variables (fail)
   * **Exit code `0`** → All variables present (success)

---

## ✅ Why Use env-police?

* Prevents runtime crashes caused by missing environment variables
* Catches configuration issues **before deployment**
* Perfect for CI/CD pipelines and production-grade applications
* Zero setup, fast execution, and framework-agnostic

