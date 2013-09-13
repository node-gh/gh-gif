# GH Gif [![NPM version](https://badge.fury.io/js/gh-gif.png)](http://badge.fury.io/js/gh-gif) [![Dependency Status](https://david-dm.org/node-gh/gh-gif.png)](https://david-dm.org/node-gh/gh-gif)

![DaftPunktocat](http://zno.io/RMu9/daftpunktocat.gif)

NodeGH plugin for commenting on pull requests/issues using GIF reactions.

> Maintained by [Zeno Rocha](https://github.com/zenorocha).

## Install

```
[sudo] npm install -g gh-gif
```

## Usage

```
gh gif
```

Option             | Usage        | Type
---                | ---          | ---
`-n`, `--number`   | **Required** | `Boolean`
`-R`, `--reaction` | **Required** | `String`
`-r`, `--repo`     | *Optional*   | `String`
`-u`, `--user`     | *Optional*   | `String`

#### Examples

* **Shortcut** for commenting on a pull request/issue with a happy reaction.

    ```
gh gif 75 --reaction happy
    ```

* Comment on a pull request/issue with a happy reaction.

    ```
gh gif --number 75 --reaction happy
    ```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* v0.0.1 September 12, 2013
    * Start plugin using [gh-boilerplate](https://github.com/node-gh/gh-boilerplate)

## License

[MIT License](http://zenorocha.mit-license.org) © Zeno Rocha