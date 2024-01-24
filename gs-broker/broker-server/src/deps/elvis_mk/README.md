# elvis.mk
3rd party elrang.mk plug-in for Elvis

## Contact Us
If you find any **bugs** or have a **problem** while using this library, please
[open an issue](https://github.com/inaka/elvis.mk/issues/new) in this repo
(or a pull request :)).

And you can check all of our open-source projects at [inaka.github.io](http://inaka.github.io).

## Usage

In order to include this plugin in your project you just need to add the
following in your Makefile:

```make
BUILD_DEPS = elvis_mk

dep_elvis_mk = git https://github.com/inaka/elvis.mk.git 1.0.0

DEP_PLUGINS = elvis_mk
```

## Help

Run `make help` in order to check what targets are available for
`elvis.mk`.

## Example

For example you can run `make elvis`:

```make
Loading files...
Loading src/your_module.erl
Applying rules...
# src/your_module.erl [FAIL]
  - operator_spaces
    - Missing space after "," on line 27
Loading files...
Loading Makefile
Applying rules...
# Makefile [OK]
Loading files...
Loading elvis.config
Applying rules...
# elvis.config [OK]
make: *** [elvis] Error 1
```
