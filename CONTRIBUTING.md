# Contributing to OptriSpace Frontend

[![Lint](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/lint.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/lint.yml)
[![Spell](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/spell.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/spell.yml)
[![Docker Build](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/docker-image.yml/badge.svg)](https://github.com/optriment/optrispace-frontend-v2/actions/workflows/docker-image.yml)

## Getting Started

- Before starting your work, ensure an issue exist for it. If not feel free to
  [create one](https://github.com/optriment/optrispace-frontend-v2/issues/new).

- You can also take a look into the issues tagged
  [Good First Issue](https://github.com/optriment/optrispace-frontend-v2/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
  and
  [Help Wanted](https://github.com/optriment/optrispace-frontend-v2/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

- Add a comment on the issue and wait for the issue to be assigned before you
  start working on it. This helps to avoid multiple people working on similar issues.

- If the solution is complex, propose the solution on the issue and wait for one
  of the core contributors to approve before going into the implementation. This
  helps in shorter turn around times in merging PRs.

- For new feature requests, provide a convincing reason to add this feature.
  Real-life business use-cases will be super helpful.

- Feel free to join our [Discord Community](https://discord.gg/7WEbtmuqtv),
  if you need further discussions with the core team.

## Workflow for Pull Requests

- In order to contribute, please fork off of the `master` branch and make your
  changes there. Your commit messages should detail why you made your change in
  addition to what you did (unless it is a tiny change).

- If you need to pull in any changes from `master` after making your fork
  (for example, to resolve potential merge conflicts), please avoid using
  `git merge` and instead, `git rebase` your branch. This will help us review
  your change more easily.

- Please make sure you respect the coding style for this project. Also, even
  though we do CI testing, please test your code and ensure that it builds
  locally before submitting a pull request.

- Thank you for your help!

## Requirements

- [Node.js](https://nodejs.org/en/download/releases) v16 or 17
- One of the supported browsers (Chrome, Opera, Firefox, Brave)
- Installed and configured [MetaMask Extension](https://metamask.io/)
  in your browser
- Some amount of [test tokens](https://testnet.binance.org/faucet-smart) in
  your wallet to execute transactions on blockchain
- Text editor or IDE with installed EditorConfig extension

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

## Developing locally with a remote blockchain network

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

## Sentry Setup

We use Sentry for error tracking. In order to set it up in your local environment, you need to follow the steps below:

1. Create a new Sentry account if you don't have one already.
2. Create a new project in Sentry named "optrispace". Make sure to select "Next.js" as the platform when creating the project.
3. Get the DSN (Data Source Name) from the Sentry project settings.
4. Add the DSN to your local `.env.local` file. Make sure to replace `YOUR_SENTRY_DSN` with your actual DSN:
5. Restart your development server to ensure that the new environment variable is picked up by the application.

Errors that occur in your local environment will now be reported to Sentry under your "optrispace" project.

## Linting

To check the formatting of your code:

```sh
make lint
```

If you get errors, you can fix them with:

```sh
npm run lint-fix
```
