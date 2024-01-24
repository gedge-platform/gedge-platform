%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%
%% @doc
%% This module contains utility functions used by other modules in this
%% library.

-module(stdout_formatter_utils).

-export([set_default_props/3,
         merge_inherited_props/1,
         split_lines/1,
         expand_tabs/1,
         compute_text_block_size/1,
         displayed_length/1,
         remove_escape_sequences/1]).

-define(TAB_SIZE, 8).

-spec set_default_props(map(), map(), map()) -> map().
%% @doc
%% Fills the initial properties map with default and inherited values.
%%
%% For each property, the value comes from the first source which
%% provides one, with the following order of precedence:
%% <ol>
%% <li>the initial properties map</li>
%% <li>the inherited properties</li>
%% <li>the default properties</li>
%% </ol>
%%
%% In the end, the final properties map contains exactly the same keys
%% as those in the default properties map, plus the `inherited' key
%% which contains the inherited properties map.
%%
%% @param Props Initial properties map.
%% @param Defaults Default properties map.
%% @param InheritedProps Inherited properties map.
%% @returns the completed properties map.

set_default_props(Props, Defaults, InheritedProps) ->
    Props1 = maps:merge(InheritedProps, Props),
    Props2 = maps:merge(Defaults, Props1),
    Props3 = Props2#{inherited => InheritedProps},
    Props4 = maps:filter(
               fun
                   (inherited, _) -> true;
                   (Key, _) -> maps:is_key(Key, Defaults)
               end,
               Props3),
    Props4.

-spec merge_inherited_props(map()) -> map().
%% @doc
%% Prepares the properties map to pass to the child terms.
%%
%% The current term's properties are merged with the inherited
%% properties map it initially received (as stored in the `inherited'
%% key), the current term's properties having precedence.
%%
%% The result can be used to pass to child terms' formatting function.
%%
%% @param Props Current term's properties map.
%% @returns the computed inherited properties map to pass to child terms.

merge_inherited_props(#{inherited := InheritedProps} = Props) ->
    maps:merge(maps:remove(inherited, InheritedProps),
               maps:remove(inherited, Props));
merge_inherited_props(Props) ->
    Props.

-spec split_lines(unicode:chardata()) -> [unicode:chardata()].
%% @doc
%% Splits a text into a list of lines.
%%
%% @param Text Text to split into lines.
%% @returns the list of lines.

split_lines(Text) ->
    [string:trim(Line, trailing, [$\r,$\n]) ||
     Line <- string:split(Text, "\n", all)].

-spec expand_tabs(unicode:chardata()) -> unicode:chardata().
%% @doc
%% Expands tab characters to spaces.
%%
%% Tab characters are replaced by spaces so that the content is aligned
%% on 8-column boundaries.
%%
%% @param Line Line of text to expand.
%% @returns the same line with tab characters expanded.

expand_tabs(Line) ->
    Parts = string:split(Line, "\t", all),
    do_expand_tabs(Parts, []).

-spec do_expand_tabs([unicode:chardata()], unicode:chardata()) ->
    unicode:chardata().
%% @private

do_expand_tabs([Part], ExpandedParts) ->
    lists:reverse([Part | ExpandedParts]);
do_expand_tabs([Part | Rest], ExpandedParts) ->
    Width = displayed_length(Part),
    Padding = ?TAB_SIZE - (Width rem 8),
    ExpandedPart = [Part, lists:duplicate(Padding, $\s)],
    do_expand_tabs(Rest, [ExpandedPart | ExpandedParts]).

-spec compute_text_block_size([unicode:chardata()]) ->
    {ColumnsCount :: non_neg_integer(), RowsCount :: non_neg_integer()}.
%% @doc
%% Computes the size of the rectangle which contains the given list of
%% lines.
%%
%% The size is returned as the number of columns and rows.
%%
%% @param Lines List of text lines.
%% @returns the columns and rows count of the rectangle containing the
%%  lines.

compute_text_block_size(Lines) when is_list(Lines) ->
    compute_text_block_size(Lines, 0, 0).

-spec compute_text_block_size([unicode:chardata()],
                              non_neg_integer(),
                              non_neg_integer()) ->
    {ColumnsCount :: non_neg_integer(), RowsCount :: non_neg_integer()}.
%% @private

compute_text_block_size([Line | Rest], MaxWidth, MaxHeight) ->
    Width = displayed_length(Line),
    NewMaxWidth = case Width > MaxWidth of
                      true  -> Width;
                      false -> MaxWidth
                  end,
    compute_text_block_size(Rest, NewMaxWidth, MaxHeight + 1);
compute_text_block_size([], MaxWidth, MaxHeight) ->
    {MaxWidth, MaxHeight}.

displayed_length(Line) ->
    WithoutEscSeq = remove_escape_sequences(Line),
    string:length(WithoutEscSeq).

remove_escape_sequences(Line) ->
    re:replace(Line, "\e\\[[^m]+m", "", [global, {return, list}]).
