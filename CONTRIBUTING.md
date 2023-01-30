# Contributing to OptriSpace Frontend

[![Lint](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/lint.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/lint.yml)
[![Spell](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/spell.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/spell.yml)
[![Docker Build](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/docker-image.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/docker-image.yml)

The development branch is `master`.\
This is the default branch that all Pull Requests (PR) should be made against.

Requirements:

- [Node.js](https://nodejs.org/en/) version 16 or 17

## For Windows users

We highly recommend to install EditorConfig extension to your editor to have
consistent settings with our codebase.

Please make sure that you've valid settings for Git:

```sh
git config --global core.autocrlf
```

If the result is `true`, you need to change it to `false`:

```sh
git config --global core.autocrlf false
```

## Developing locally with remote backend

Please follow instructions below to install frontend locally.

1. [Fork](https://help.github.com/articles/fork-a-repo/)
   this repository to your own GitHub account

2. [Clone](https://help.github.com/articles/cloning-a-repository/)
   it to your local device

3. Create a new branch:

   ```sh
   git checkout -b YOUR_BRANCH_NAME
   ```

4. Install the dependencies with:

   ```sh
   make setup
   ```

5. Copy the environment variables:

   ```sh
   cp .env.local.example .env.local
   ```

6. Run the web server:

   ```sh
   make run
   ```

The last command will start the web server on
[http://localhost:3000/](http://localhost:3000/).

## Linting

To check the formatting of your code:

```sh
make lint
```

If you get errors, you can fix them with:

```sh
npm run lint-fix
```
