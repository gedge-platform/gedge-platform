# stdout_formatter: Format paragraphs and tables for a human-readable text output

[![Build Status](https://travis-ci.com/rabbitmq/stdout_formatter.svg?branch=master)](https://travis-ci.com/rabbitmq/stdout_formatter)
[![Coverage Status](https://coveralls.io/repos/github/rabbitmq/stdout_formatter/badge.svg?branch=master)](https://coveralls.io/github/rabbitmq/stdout_formatter)
[![Hex version](https://img.shields.io/hexpm/v/stdout_formatter.svg "Hex version")](https://hex.pm/packages/stdout_formatter)

**stdout_formatter** is a pure [Erlang application](http://www.erlang.org/)
which allows an application to format paragraphs and tables as text,
usually to display it on a terminal. It only depends on standard
Erlang/OTP applications; no external dependency is required. It doesn't
use native code either (neither port drivers nor NIFs).

stdout_formatter can be used inside Elixir projects, like any other
Erlang library. You can find an example later in this README.

stdout_formatter is distributed under the terms of both the **Apache
License v2** and **Mozilla Public Licence v1.1**; see `LICENSE`.

## Integrate to your project

stdout_formatter uses [Rebar 3](http://www.rebar3.org/) as its build
system so it can be integrated to many common build systems.

### Rebar

stdout_formatter is available as a [Hex.pm
package](https://hex.pm/packages/stdout_formatter). Thus you can simply
list it as a package dependency in your `rebar.config`:

```erlang
{deps, [stdout_formatter]}.
```

### Erlang.mk

Erlang.mk knows about stdout_formatter. You just need to add
`stdout_formatter` as a dependency in your `Makefile`:

```make
DEPS = stdout_formatter
dep_stdout_formatter = git https://github.com/rabbitmq/stdout_formatter.git v0.1.0
```

### Mix

You can use stdout_formatter in your Elixir
project. stdout_formatter is available as a [Hex.pm
package](https://hex.pm/packages/stdout_formatter). Thus you can simply
list its name in your `mix.exs`:

```elixir
def project do
  [
    deps: [{:stdout_formatter, "~> 0.1.0"}]
  ]
end
```

## Getting started

### Format and display a paragraph of text

In this example, we want to format a long paragraph of text to fit it in
an 80-columns terminal and display it directly.

```erlang
-include_lib("stdout_formatter/include/stdout_formatter.hrl").

Text = "Lorem ipsum dolor (...) est laborum.",

stdout_formatter:display(
  #paragraph{
    content = Text
    props = #{wrap_at => 72}}).
```
```
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.
```

### Format and display a simple table

In this example, we want to format a table and display it directly.

```erlang
-include_lib("stdout_formatter/include/stdout_formatter.hrl").

Data = [
         ["Top left", "Top right"],
         ["Bottom left", "Bottom right"]
       ],

stdout_formatter:display(
  #table{
    rows = Data}).
```
```
┌───────────┬────────────┐
│Top left   │Top right   │
├───────────┼────────────┤
│Bottom left│Bottom right│
└───────────┴────────────┘
```

### Format and display a complex table with paragraphs inside

In this example, we mix the previous examples to put a paragraph inside
a table and we start to use colors.

```erlang
-include_lib("stdout_formatter/include/stdout_formatter.hrl").

Text = "Lorem ipsum dolor (...) est laborum.",

Data = [
         #row{
           cells = [
             "Initial data",
             "Result"],
           props = #{title => true}},
         #row{
           cells = [
             "The famous Lorem Ipsum sample",
             #paragraph{
               content = Text,
               props = #{wrap_at => 40}}]}
       ],

stdout_formatter:display(
  #table{
    rows = Data}).
```
```
┌─────────────────────────────┬───────────────────────────────────────┐
│Initial data                 │Result                                 │
├─────────────────────────────┼───────────────────────────────────────┤
│The famous Lorem Ipsum sample│Lorem ipsum dolor sit amet, consectetur│
│                             │adipiscing elit, sed do eiusmod tempor │
│                             │incididunt ut labore et dolore magna   │
│                             │aliqua. Ut enim ad minim veniam, quis  │
│                             │nostrud exercitation ullamco laboris   │
│                             │nisi ut aliquip ex ea commodo          │
│                             │consequat. Duis aute irure dolor in    │
│                             │reprehenderit in voluptate velit esse  │
│                             │cillum dolore eu fugiat nulla pariatur.│
│                             │Excepteur sint occaecat cupidatat non  │
│                             │proident, sunt in culpa qui officia    │
│                             │deserunt mollit anim id est laborum.   │
└─────────────────────────────┴───────────────────────────────────────┘
```

In the example above, what does not appear is the fact the the first row
is using bold text.
