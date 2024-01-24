

# Accept header(s) for Erlang/Elixir #

Copyright (c) 2016 Ilya Khaprov <<i.khaprov@gmail.com>>.

__Version:__ 0.3.5

[![Hex.pm](https://img.shields.io/hexpm/v/accept.svg?maxAge=2592000?style=plastic)](https://hex.pm/packages/accept)
[![Hex.pm](https://img.shields.io/hexpm/dt/accept.svg?maxAge=2592000)](https://hex.pm/packages/accept)
[![Build Status](https://travis-ci.org/deadtrickster/accept.svg?branch=version-3)](https://travis-ci.org/deadtrickster/accept)
[![Coverage Status](https://coveralls.io/repos/github/deadtrickster/accept/badge.svg?branch=master)](https://coveralls.io/github/deadtrickster/accept?branch=master)

## TOC 
- [Accept](#accept-header) 
- [Accept-Encoding](#accept-encoding-header)
- [Contributing](#contributing) 
- [License](#license)

## Headers

### Accept

[RFC](https://tools.ietf.org/html/rfc7231#section-5.3.2)

#### Parsing

```erlang

1> accept_header:parse("text/*;q=0.3, text/html;q=0.7, text/html;level=1,"
                       "text/html;level=2;q=0.4, */*;q=0.5").
[{media_range,"text","*",0.3,[]},
 {media_range,"text","html",0.7,[]},
 {media_range,"text","html",1,[{"level","1"}]},
 {media_range,"text","html",0.4,[{"level","2"}]},
 {media_range,"*","*",0.5,[]}]

```

#### Content Negotiation

```erlang

2> accept_header:negotiate("text/*;q=0.3, text/html;q=0.7, text/html;level=1,"
                           "text/html;level=2;q=0.4, */*;q=0.5",
                           ["text/html;level=2", "text/html;level-3"]).
"text/html;level-3"

```

`"text/html;level-3"` returned because `"text/html;level=2"` matches to
`text/html;level=2;q=0.4` with score 0.4 and most specific match for
`"text/html;level-3"` is `text/html;q=0.7` with score 0.7.

```erlang

3> accept_header:negotiate("application/xml,application/xhtml+xml,"
3>                         "text/html;q=0.9,text/plain;q=0.8,image/png,image/*;q=0.9,*/*;q=0.5",
3>                         ["text/n3",
3>                          "application/rdf+xml"]).
"text/n3"

```

Negotiate preserves user-defined order for equally scored alternatives.

### Accept-Encoding

[RFC](https://tools.ietf.org/html/rfc7231#section-5.3.4)

#### Parsing

```erlang

1> accept_encoding_header:parse("gzip;q=1.0, identity; q=0.5, *;q=0").
[{content_coding,"gzip",1.0,[]},
 {content_coding,"identity",0.5,[]},
 {content_coding,"*",0,[]}]

```

#### Content Negotiation

```erlang

1> accept_encoding_header:negotiate("compress, gzip",
1>                                  ["identity", "compress"]).
"compress"

2> accept_encoding_header:negotiate("gzip;q=1.0, identity; q=0.5, *;q=0",
2>                                  ["identity", "sdc", "gzip", "compress"]).
"gzip"

3> accept_encoding_header:negotiate("compress, gzip, *;q=0",
3>                                  ["qwe"]).
undefined

```

Negotiate preserves user-defined order for equally scored alternatives.

## Contributing

Sections order:

`Types -> Macros -> Callbacks -> Public API -> Deprecations -> Private Parts`

install git precommit hook:

```
   ./bin/pre-commit.sh install
```

Pre-commit check can be skipped passing `--no-verify` option to git commit.

## License

MIT


## Modules ##


<table width="100%" border="0" summary="list of modules">
<tr><td><a href="https://github.com/deadtrickster/accept/blob/master/doc/accept_encoding_header.md" class="module">accept_encoding_header</a></td></tr>
<tr><td><a href="https://github.com/deadtrickster/accept/blob/master/doc/accept_header.md" class="module">accept_header</a></td></tr></table>

