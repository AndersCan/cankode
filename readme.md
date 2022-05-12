# typed-packages

> Work in progress


## Packages

[typed-builder](/packages/typed-builder)
[typed-test-runner-browser](/packages/typed-test-runner-browser)
[typed-tester](/packages/typed-tester)
[typed-option](/packages/typed-option)
[typed-test-runner-node](/packages/typed-test-runner-node)
[typed-web-workers](/packages/typed-web-workers)


## Developing
🤷
### Issues

If using [Volta](https://volta.sh/):
Volta and pnpm@7 installed via `npm i -g pnpm` will not work well

Either:
Have to be explicit when running pnpm commands

```
volta run --node 14 pnpm test --recursive
```

Or install `pnpm` via `brew` (`brew install pnpm`)