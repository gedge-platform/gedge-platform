%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%
%% @doc
%% This module is the entry point to format structured text.
%%
%% == Which function to use ==
%%
%% There are three "levels of formatting":
%% <ol>
%% <li>{@link format/1} returns an internal structure where the text
%%  is already formatted but not ready for display: it is mostly used
%%  internally.</li>
%% <li>{@link to_string/1} formats the given argument and returns a
%%  string ready to be displayed or stored.</li>
%% <li>{@link display/1} does the same thing as {@link to_string/1} but
%%  displays the result on `stdout' directly (and returns nothing).</li>
%% </ol>
%%
%% == Examples ==
%%
%% To automatically wrap a paragraph to fit it in 30 columns and display
%% it:
%%
%% ```
%% -include_lib("stdout_formatter/include/stdout_formatter.hrl").
%%
%% stdout_formatter:display(
%%   #paragraph{
%%     content = "This module is the entry point to format structured text.",
%%     props = #{wrap_at => 30}}).
%% '''
%% ```
%% This module is the entry
%% point to format structured
%% text.
%% '''
%%
%% To format a table and display it:
%%
%% ```
%% -include_lib("stdout_formatter/include/stdout_formatter.hrl").
%%
%% stdout_formatter:display(
%%   #table{
%%     rows = [["Top left", "Top right"], ["Bottom left", "Bottom right"]],
%%     props = #{}}).
%% '''
%% ```
%% ┌───────────┬────────────┐
%% │Top left   │Top right   │
%% ├───────────┼────────────┤
%% │Bottom left│Bottom right│
%% └───────────┴────────────┘
%% '''

-module(stdout_formatter).

-include("stdout_formatter.hrl").

-export([format/1,
         format/2,
         to_string/1,
         to_string/2,
         display/1,
         display/2]).

-type paragraph() :: #paragraph{}.
%% A paragraph of text to format.
%%
%% The content can be a string or any Erlang term. The format string can
%% be specified as a property (See {@link paragraph_props/0}). If it is
%% missing, it will be guessed from the Erlang term.

-type paragraph_props() :: #{format => string() | none | subterms,
                             wrap_at => pos_integer() | false,
                             bold => boolean(),
                             fg => color() | none,
                             bg => color() | none,
                             inherited => map()}.
%% Paragraph properties.
%%
%% The properties are:
%% <ul>
%% <li>`format': the format string to present the content.</li>
%% <li>`wrap_at': the number of columns after which the lines are wrapped.</li>
%% <li>`bold': `true' if the content must be dispalyed as bold characters.</li>
%% <li>`fg': the color to use as foreground.</li>
%% <li>`bg': the color to use as background.</li>
%% </ul>

-type table() :: #table{}.
%% A table to format.
%%
%% It is made of a list of rows. Each row is either a {@link row/0} or
%% a list of cells. Each cell is either a {@link cell/0} or a {@link
%% formattable/0}.

-type table_props() :: #{border_drawing => border_drawing(),
                         border_style => border_style(),
                         cell_padding => padding(),
                         inherited => map()}.
%% Table properties.
%%
%% The properties are:
%% <ul>
%% <li>`border_drawing': the type of line drawing to use.</li>
%% <li>`border_style': the style of borders.</li>
%% </ul>

-type border_drawing() :: ansi | ascii | none.
%% The line drawing technic.
%%
%% <ul>
%% <li>`ansi': borders are drawn with ANSI escape sequences.</li>
%% <li>`ascii': borders are drawn with US-ASCII characters.</li>
%% <li>`none': no border drawn.</li>
%% </ul>

-type border_style() :: thin.
%% The style of borders.

-type padding_value() :: non_neg_integer().
-type padding() :: padding_value() |
                   {padding_value(), padding_value()} |
                   {padding_value(), padding_value(),
                    padding_value(), padding_value()}.
%% The number of columns/lines of horizontal/vertical padding.

-type row() :: #row{}.
%% A row in a table.
%%
%% See {@link table/0}.

-type row_props() :: #{title => boolean(),
                       title_repeat => pos_integer() | false,
                       inherited => map()}.
%% Row properties.
%%
%% The properties are:
%% <ul>
%% <li>`title': `true' if cells are all title cells.</li>
%% <li>`title_repeat': whether to repeat the title rows and how often.
%%  [NOT IMPLEMENTED]</li>
%% </ul>

-type cell() :: #cell{}.
%% A cell in a table row.
%%
%% See {@link table/0}.

-type cell_props() :: #{title => boolean(),
                        padding => padding(),
                        inherited => map()}.
%% Cell properties.
%%
%% The properties are:
%% <ul>
%% <li>`title': `true' if the cells is a title (i.e. content is bold).</li>
%% </ul>

-type formatted_block() :: #formatted_block{}.
%% A formatted block.
%%
%% It is the result of the {@link format/1} and {@link format/2}
%% functions. It contains a list of {@link formatted_line/0}.

-type formatted_block_props() :: #{width := non_neg_integer(),
                                   height := non_neg_integer()}.
%% Formatted block properties.
%%
%% The properties are:
%% <ul>
%% <li>`width': Number of columns of the widest line.</li>
%% <li>`height': Number of lines.</li>
%% </ul>

-type formatted_line() :: #formatted_line{}.
%% A formatted line.

-type formatted_line_props() :: #{width := non_neg_integer(),
                                  reformat_ok := content_if_reformat()}.
%% Formatted line properties.
%%
%% The properties are:
%% <ul>
%% <li>`width': Number of columns of the line.</li>
%% <li>`reformat_ok': Content used to reformat the line if relevant,
%%  e.g. to rewrap a paragraph.</li>
%% </ul>

-type content_if_reformat() :: [{unicode:chardata(), non_neg_integer()} |
                                {color_start, string(), string()} |
                                {color_end, string(), string()}]
                               | derived_from_previous_sibling
                               | false.

-type color() :: color_8palette()
               | color_256palette()
               | true_color().
%% A color name, index or value.

-type color_8palette() :: black
                        | red
                        | green
                        | yellow
                        | blue
                        | magenta
                        | cyan
                        | white
                        | bright_black
                        | bright_red
                        | bright_green
                        | bright_yellow
                        | bright_blue
                        | bright_magenta
                        | bright_cyan
                        | bright_white
                        | 0..15.
%% Color name (atom) or index in the ANSI escape sequence
%% color palette.

-type color_256palette() :: byte().
%% Color index in the ANSI 256-color palette.

-type true_color() :: {Red :: byte(), Green :: byte(), Blue :: byte()}.
%% Three-byte tuple corresponding to RGB 24-bit channel values.

-type formattable() :: paragraph() |
                       table() |
                       formatted_block() |
                       term().

-export_type([formatted_block/0,
              formatted_block_props/0,
              formatted_line/0,
              formatted_line_props/0,

              paragraph/0,
              paragraph_props/0,
              table/0,
              table_props/0,
              row/0,
              row_props/0,
              cell/0,
              cell_props/0,

              formattable/0,
              color/0,
              color_8palette/0,
              color_256palette/0,
              true_color/0,
              content_if_reformat/0]).

-spec format(formattable()) -> formatted_block().
%% @doc
%% Formats a term and returns a {@link formatted_block/0}.
%%
%% @param Term Term to format.
%% @returns A {@link formatted_block/0}.

format(Term) ->
    format(Term, #{}).

-spec format(formattable(), map()) -> formatted_block().
%% @doc
%% Formats a term and returns a {@link formatted_block/0}.
%%
%% It will use the specified inherited properties.
%%
%% @param Term Term to format.
%% @param InheritedProps Inherited properties map.
%% @returns A {@link formatted_block/0}.

format(#formatted_block{} = Formatted, _) ->
    Formatted;
format(#table{} = Table, InheritedProps) ->
    stdout_formatter_table:format(Table, InheritedProps);
format(Term, InheritedProps) ->
    stdout_formatter_paragraph:format(Term, InheritedProps).

-spec to_string(formattable()) -> unicode:chardata().
%% @doc Formats a term and returns a string.
%%
%% @param Term Term to format as a string.
%% @returns A string of the formatted term.

to_string(Term) ->
    to_string(Term, #{}).

-spec to_string(formattable(), map()) -> unicode:chardata().
%% @doc Formats a term and returns a string.
%%
%% It will use the specified inherited properties.
%%
%% @param Term Term to format as a string.
%% @param InheritedProps Inherited properties map.
%% @returns A string of the formatted term.

to_string(#formatted_block{lines = Lines}, _) ->
    lists:flatten(
      lists:join(
        "\n",
        lists:map(
          fun(#formatted_line{content = Line}) ->
                  io_lib:format("~s", [Line])
          end, Lines)));
to_string(Term, InheritedProps) ->
    to_string(format(Term, InheritedProps)).

-spec display(formattable()) -> ok.
%% @doc Formats a term and displays it on `stdout'.
%%
%% @param Term Term to format and display.

display(Term) ->
    display(Term, #{}).

-spec display(formattable(), map()) -> ok.
%% @doc Formats a term and displays it on `stdout'.
%%
%% It will use the specified inherited properties.
%%
%% @param Term Term to format and display.
%% @param InheritedProps Inherited properties map.

display(#formatted_block{lines = Lines}, _) ->
    lists:foreach(
      fun(#formatted_line{content = Line}) ->
              io:format("~s~n", [Line])
      end,
      Lines);
display(Term, InheritedProps) ->
    display(format(Term, InheritedProps)).
