# @cankode/packages

> Work in progress


## Packages

[@cankode/builder](/packages/@cankode/builder)
[@cankode/test-runner-browser](/packages/@cankode/test-runner-browser)
[@cankode/tester](/packages/@cankode/tester)
[@cankode/test-runner-node](/packages/@cankode/test-runner-node)


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