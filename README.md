![Logo](admin/gree_aircon.png)
# ioBroker.gree_aircon

[![NPM version](http://img.shields.io/npm/v/iobroker.gree_aircon.svg)](https://www.npmjs.com/package/iobroker.gree_aircon)
[![Downloads](https://img.shields.io/npm/dm/iobroker.gree_aircon.svg)](https://www.npmjs.com/package/iobroker.gree_aircon)
[![Dependency Status](https://img.shields.io/david/weltmeyer/iobroker.gree_aircon.svg)](https://david-dm.org/weltmeyer/iobroker.gree_aircon)
[![Known Vulnerabilities](https://snyk.io/test/github/weltmeyer/ioBroker.gree_aircon/badge.svg)](https://snyk.io/test/github/weltmeyer/ioBroker.gree_aircon)

[![NPM](https://nodei.co/npm/iobroker.gree_aircon.png?downloads=true)](https://nodei.co/npm/iobroker.gree_aircon/)

**Tests:**: [![Travis-CI](http://img.shields.io/travis/weltmeyer/ioBroker.gree_aircon/master.svg)](https://travis-ci.org/weltmeyer/ioBroker.gree_aircon)

## gree_aircon adapter for ioBroker

gree air description

## Developer manual
This section is intended for the developer. It can be deleted later

### Getting started

You are almost done, only a few steps left:
1. Create a new repository on GitHub with the name `ioBroker.gree_aircon`

1. Push all files to the GitHub repo. The creator has already set up the local repository for you:  
	```bash
	git push origin master
	```
1. Head over to [main.js](main.js) and start programming!

### Scripts in `package.json`
Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description                                              |
|-------------|----------------------------------------------------------|
| `test:js`   | Executes the tests you defined in `*.test.js` files.     |
| `test:package`    | Ensures your `package.json` and `io-package.json` are valid. |
| `test` | Performs a minimal test run on package files and your tests. |
| `coverage` | Generates code coverage using your test files. |

### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

### Publishing the adapter
See the documentation of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	```bash
	npm pack
	```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	```bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	```

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.gree_aircon`)
1. Execute `iobroker upload gree_aircon` on the ioBroker host

## Changelog

### 0.0.1
* (jan weltmeyer) initial release

## License
MIT License

Copyright (c) 2019 jan weltmeyer <jan@weltmeyer.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.