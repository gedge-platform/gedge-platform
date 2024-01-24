%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%
%% @doc
%% This module implements the formatting of paragraphs.

-module(stdout_formatter_paragraph).

-include("stdout_formatter.hrl").

-export([format/1,
         format/2,
         to_string/1,
         to_string/2,
         display/1,
         display/2]).

-type paragraph() :: stdout_formatter:paragraph().
-type paragraph_props() :: stdout_formatter:paragraph_props().

-spec format(stdout_formatter:formattable()) ->
    stdout_formatter:formatted_block().
%% @doc
%% Formats a paragraph and returns a {@link formatted_block/0}.
%%
%% @see stdout_formatter:format/1.

format(Term) ->
    format(Term, #{}).

-spec format(stdout_formatter:formattable(), map()) ->
    stdout_formatter:formatted_block().
%% @doc
%% Formats a paragraph and returns a {@link formatted_block/0}.
%%
%% @see stdout_formatter:format/2.

format(#paragraph{} = Para, InheritedProps) ->
    Para1 = set_default_props(Para, InheritedProps),
    do_format(Para1);
format(Term, InheritedProps) ->
    format(to_internal_struct(Term), InheritedProps).

-spec to_string(stdout_formatter:formattable()) -> unicode:chardata().
%% @doc Formats a paragraph and returns a string.
%%
%% @see stdout_formatter:to_string/1.

to_string(Para) ->
    to_string(Para, #{}).

-spec to_string(stdout_formatter:formattable(), map()) -> unicode:chardata().
%% @doc Formats a paragraph and returns a string.
%%
%% @see stdout_formatter:to_string/2.

to_string(Para, InheritedProps) ->
    stdout_formatter:to_string(format(Para, InheritedProps)).

-spec display(stdout_formatter:formattable()) -> ok.
%% @doc Formats a paragraph and displays it on `stdout'.
%%
%% @see stdout_formatter:display/1.

display(Para) ->
    display(Para, #{}).

-spec display(stdout_formatter:formattable(), map()) -> ok.
%% @doc Formats a paragraph and displays it on `stdout'.
%%
%% @see stdout_formatter:display/2.

display(Para, InheritedProps) ->
    stdout_formatter:display(format(Para, InheritedProps)).

-spec to_internal_struct(term()) -> paragraph().
%% @private

to_internal_struct(Content) ->
    #paragraph{content = Content}.

-spec set_default_props(paragraph(), map()) -> paragraph().
%% @private

set_default_props(#paragraph{} = Para, InheritedProps) ->
    #paragraph{props = Props} = Para1 = maybe_set_format_string(Para),
    Defaults = #{format => "~p",
                 wrap_at => false,
                 bold => false,
                 fg => none,
                 bg => none},
    Props1 = stdout_formatter_utils:set_default_props(Props,
                                                      Defaults,
                                                      InheritedProps),
    Props2 = case Props1 of
                 #{inherited := #{title := true}} -> Props1#{bold => true};
                 _                                -> Props1
             end,
    Para1#paragraph{props = Props2}.

-spec maybe_set_format_string(paragraph()) -> paragraph().
%% @private

maybe_set_format_string(#paragraph{props = #{format := _}} = Para) ->
    Para;
maybe_set_format_string(#paragraph{content = Content, props = Props} = Para)
  when is_atom(Content) ->
    Para#paragraph{props = Props#{format => "~s"}};
maybe_set_format_string(#paragraph{content = Content, props = Props} = Para)
  when is_integer(Content) ->
    Para#paragraph{props = Props#{format => "~b"}};
maybe_set_format_string(#paragraph{content = Content, props = Props} = Para)
  when is_float(Content) ->
    Para#paragraph{props = Props#{format => "~f"}};
maybe_set_format_string(#paragraph{content = #formatted_block{},
                                   props = Props} = Para) ->
    Para#paragraph{props = Props#{format => subterms}};
maybe_set_format_string(#paragraph{content = #table{},
                                   props = Props} = Para) ->
    Para#paragraph{props = Props#{format => subterms}};
maybe_set_format_string(#paragraph{content = Content, props = Props} = Para)
  when is_list(Content) ->
    try
        case unicode:characters_to_list(Content) of
            {error, _, _} ->
                Para#paragraph{props = Props#{format => "~p"}};
            {incomplete, _, _} ->
                Para#paragraph{props = Props#{format => "~p"}};
            Content1 ->
                Para#paragraph{content = Content1,
                               props = Props#{format => none}}
        end
    catch
        _:badarg ->
            Para#paragraph{props = Props#{format => subterms}}
    end;
maybe_set_format_string(#paragraph{content = Content, props = Props} = Para)
  when is_binary(Content) ->
    case unicode:characters_to_list(Content) of
        {error, _, _} ->
            Para#paragraph{props = Props#{format => "~p"}};
        {incomplete, _, _} ->
            Para#paragraph{props = Props#{format => "~p"}};
        Content1 ->
            Para#paragraph{content = Content1,
                           props = Props#{format => none}}
    end;
maybe_set_format_string(#paragraph{props = Props} = Para) ->
    Para#paragraph{props = Props#{format => "~p"}}.

-spec do_format(paragraph()) -> stdout_formatter:formatted_block().
%% @private

do_format(#paragraph{props = #{format := subterms}} = Para) ->
    FormattedBlock = format_subterms(Para),
    do_format1(Para, FormattedBlock);
do_format(#paragraph{} = Para) ->
    FormattedBlock = apply_format_string(Para),
    do_format1(Para, FormattedBlock).

-spec do_format1(paragraph(), stdout_formatter:formatted_block()) ->
    stdout_formatter:formatted_block().
%% @private

do_format1(#paragraph{props = Props},
           #formatted_block{lines = FormattedLines,
                            props = BlockProps} = FormattedBlock) ->
    FormattedLines1 = wrap_long_lines(FormattedLines, Props),
    Width = case FormattedLines of
                [] ->
                    0;
                _ ->
                    lists:max([LWidth
                               || #formatted_line{props = #{width := LWidth}}
                                  <- FormattedLines1])
            end,
    Height = length(FormattedLines1),
    FormattedBlock#formatted_block{lines = FormattedLines1,
                                   props = BlockProps#{width => Width,
                                                       height => Height}}.

-spec apply_format_string(paragraph()) -> stdout_formatter:formatted_block().
%% @private

apply_format_string(#paragraph{content = Content,
                               props = #{format := FormatString} = Props}) ->
    String = case FormatString of
                 none -> Content;
                 _    -> io_lib:format(FormatString, [Content])
             end,
    Lines1 = stdout_formatter_utils:split_lines(String),
    Lines2 = [stdout_formatter_utils:expand_tabs(Line) || Line <- Lines1],
    {Width, Height} = stdout_formatter_utils:compute_text_block_size(Lines2),

    FormattedLines = [begin
                          LWidth = stdout_formatter_utils:displayed_length(
                                     Line),
                          #formatted_line{
                             content = Line,
                             props = #{width => LWidth,
                                       reformat_ok => [{Line, LWidth}]}}
                      end
                      || Line <- Lines2],

    FormattedLines1 = apply_colors(FormattedLines, Props),
    #formatted_block{lines = FormattedLines1,
                     props = #{width => Width,
                               height => Height}}.

-spec apply_colors([stdout_formatter:formatted_line()], paragraph_props()) ->
    [stdout_formatter:formatted_line()].
%% @private

apply_colors(Lines, Props) ->
    Colors = get_bold_and_colors(Props),
    [begin
         case Colors of
             none ->
                 Line;
             {Start, End} ->
                 Start1 = lists:flatten(Start),
                 End1 = lists:flatten(End),
                 Refmt1 = [{color_start, Start1, End1} | Refmt],
                 Refmt2 = Refmt1 ++ [{color_end, Start1, End1}],
                 Line#formatted_line{content = [Start1, Content, End1],
                                     props = LProps#{reformat_ok => Refmt2}}
         end
     end
     || #formatted_line{content = Content,
                        props = #{reformat_ok := Refmt} = LProps} = Line
        <- Lines].

-spec get_bold_and_colors(paragraph_props()) -> {string(), string()} | none.
%% @private

get_bold_and_colors(#{bold := true} = Props) ->
    case get_colors(Props) of
        {Start, End} -> {["\033[1m", Start], End};
        none         -> {"\033[1m", "\033[0m"}
    end;
get_bold_and_colors(Props) ->
    get_colors(Props).

-spec get_colors(paragraph_props()) ->
    {unicode:chardata(), unicode:chardata()} | none.
%% @private

get_colors(#{fg := none, bg := none}) -> none;
get_colors(#{fg := Fg, bg := Bg})     -> colors_to_escape_seqs(Fg, Bg).

-define(is_8color_based(Color),
        Color =:= black orelse
        Color =:= red orelse
        Color =:= green orelse
        Color =:= yellow orelse
        Color =:= blue orelse
        Color =:= magenta orelse
        Color =:= cyan orelse
        Color =:= white orelse
        Color =:= bright_black orelse
        Color =:= bright_red orelse
        Color =:= bright_green orelse
        Color =:= bright_yellow orelse
        Color =:= bright_blue orelse
        Color =:= bright_magenta orelse
        Color =:= bright_cyan orelse
        Color =:= bright_white orelse
        (Color >= 0 andalso Color =< 15)).

-spec colors_to_escape_seqs(stdout_formatter:color() | none,
                            stdout_formatter:color() | none) ->
    {unicode:chardata(), unicode:chardata()}.
%% @private

colors_to_escape_seqs(Fg, none)
  when ?is_8color_based(Fg) ->
    {["\033[", fg_8color(Fg), "m"],
     "\033[0m"};
colors_to_escape_seqs(none, Bg)
  when ?is_8color_based(Bg) ->
    {["\033[", bg_8color(Bg), "m"],
     "\033[0m"};
colors_to_escape_seqs(Fg, Bg)
  when ?is_8color_based(Fg) andalso ?is_8color_based(Bg) ->
    {["\033[", fg_8color(Fg), ";", bg_8color(Bg), "m"],
     "\033[0m"};
colors_to_escape_seqs(Fg, none) ->
    {[fg_color(Fg)],
     "\033[0m"};
colors_to_escape_seqs(none, Bg) ->
    {[bg_color(Bg)],
     "\033[0m"};
colors_to_escape_seqs(Fg, Bg) ->
    {[fg_color(Fg), bg_color(Bg)],
     "\033[0m"}.

-spec fg_8color(stdout_formatter:color_8palette()) -> string().
%% @private

fg_8color(Color) when Color =:= black   orelse Color =:= 0 -> "30";
fg_8color(Color) when Color =:= red     orelse Color =:= 1 -> "31";
fg_8color(Color) when Color =:= green   orelse Color =:= 2 -> "32";
fg_8color(Color) when Color =:= yellow  orelse Color =:= 3 -> "33";
fg_8color(Color) when Color =:= blue    orelse Color =:= 4 -> "34";
fg_8color(Color) when Color =:= magenta orelse Color =:= 5 -> "35";
fg_8color(Color) when Color =:= cyan    orelse Color =:= 6 -> "36";
fg_8color(Color) when Color =:= white   orelse Color =:= 7 -> "37";

fg_8color(Color) when Color =:= bright_black   orelse Color =:=  8 -> "90";
fg_8color(Color) when Color =:= bright_red     orelse Color =:=  9 -> "91";
fg_8color(Color) when Color =:= bright_green   orelse Color =:= 10 -> "92";
fg_8color(Color) when Color =:= bright_yellow  orelse Color =:= 11 -> "93";
fg_8color(Color) when Color =:= bright_blue    orelse Color =:= 12 -> "94";
fg_8color(Color) when Color =:= bright_magenta orelse Color =:= 13 -> "95";
fg_8color(Color) when Color =:= bright_cyan    orelse Color =:= 14 -> "96";
fg_8color(Color) when Color =:= bright_white   orelse Color =:= 15 -> "97".

-spec bg_8color(stdout_formatter:color_8palette()) -> string().
%% @private

bg_8color(Color) when Color =:= black   orelse Color =:= 0 -> "40";
bg_8color(Color) when Color =:= red     orelse Color =:= 1 -> "41";
bg_8color(Color) when Color =:= green   orelse Color =:= 2 -> "42";
bg_8color(Color) when Color =:= yellow  orelse Color =:= 3 -> "43";
bg_8color(Color) when Color =:= blue    orelse Color =:= 4 -> "44";
bg_8color(Color) when Color =:= magenta orelse Color =:= 5 -> "45";
bg_8color(Color) when Color =:= cyan    orelse Color =:= 6 -> "46";
bg_8color(Color) when Color =:= white   orelse Color =:= 7 -> "47";

bg_8color(Color) when Color =:= bright_black   orelse Color =:=  8 -> "100";
bg_8color(Color) when Color =:= bright_red     orelse Color =:=  9 -> "101";
bg_8color(Color) when Color =:= bright_green   orelse Color =:= 10 -> "102";
bg_8color(Color) when Color =:= bright_yellow  orelse Color =:= 11 -> "103";
bg_8color(Color) when Color =:= bright_blue    orelse Color =:= 12 -> "104";
bg_8color(Color) when Color =:= bright_magenta orelse Color =:= 13 -> "105";
bg_8color(Color) when Color =:= bright_cyan    orelse Color =:= 14 -> "106";
bg_8color(Color) when Color =:= bright_white   orelse Color =:= 15 -> "107".

-define(is_8bit_int(I), I >= 0 andalso I =< 255).

-spec fg_color(stdout_formatter:color_256palette() |
               stdout_formatter:true_color()) -> unicode:chardata().
%% @private

fg_color(Index) when ?is_8bit_int(Index) ->
    ["\033[38;5;", integer_to_list(Index), "m"];
fg_color({R, G, B})
  when ?is_8bit_int(R) andalso ?is_8bit_int(G) andalso ?is_8bit_int(B) ->
    ["\033[38;2", [[";", integer_to_list(I)] || I <- [R, G, B]], "m"].

-spec bg_color(stdout_formatter:color_256palette() |
               stdout_formatter:true_color()) -> unicode:chardata().
%% @private

bg_color(Index) when ?is_8bit_int(Index) ->
    ["\033[48;5;", integer_to_list(Index), "m"];
bg_color({R, G, B})
  when ?is_8bit_int(R) andalso ?is_8bit_int(G) andalso ?is_8bit_int(B) ->
    ["\033[48;2", [[";", integer_to_list(I)] || I <- [R, G, B]], "m"].

-spec format_subterms(paragraph()) -> stdout_formatter:formatted_block().
%% @private

format_subterms(#paragraph{content = Subterms, props = Props}) ->
    InheritedProps = stdout_formatter_utils:merge_inherited_props(Props),
    InheritedProps1 = maps:remove(wrap_at, InheritedProps),
    FormattedSubterms = case is_list(Subterms) of
                            true ->
                                [stdout_formatter:format(Subterm,
                                                         InheritedProps1)
                                 || Subterm <- Subterms];
                            false ->
                                [stdout_formatter:format(Subterms,
                                                         InheritedProps1)]
                        end,
    concat_formatted_subterms(FormattedSubterms, #formatted_block{}).

-spec concat_formatted_subterms([stdout_formatter:formatted_block()],
                                stdout_formatter:formatted_block()) ->
    stdout_formatter:formatted_block().
%% @private

concat_formatted_subterms(
  [FormattedBlock | Rest],
  #formatted_block{lines = []}) ->
    concat_formatted_subterms(Rest, FormattedBlock);
concat_formatted_subterms(
  [#formatted_block{lines = []} | Rest],
  Result) ->
    concat_formatted_subterms(Rest, Result);
concat_formatted_subterms(
  [#formatted_block{lines = [FirstNewLine | NewLines]} | Rest],
  #formatted_block{lines = Lines, props = Props} = Result) ->
    %% We take the last line of the already-concatenated block, and the
    %% first line of the next block to merge them. The width is adjusted
    %% to match the new size after concatenation.
    [LastLine | RevLines] = lists:reverse(Lines),
    #formatted_line{content = LastLineContent,
                    props = LastLineProps} = LastLine,
    #formatted_line{content = FirstNewLineContent,
                    props = FirstNewLineProps} = FirstNewLine,
    #{width := LastLineWidth,
      reformat_ok := LastLineRefmt} = LastLineProps,
    #{width := FirstNewLineWidth,
      reformat_ok := FirstNewLineRefmt} = FirstNewLineProps,
    LastLineRefmt1 = case {LastLineRefmt, FirstNewLineRefmt} of
                         _ when is_list(LastLineRefmt) andalso
                                is_list(FirstNewLineRefmt) ->
                             LastLineRefmt ++ FirstNewLineRefmt;
                         {derived_from_previous_sibling, _} ->
                             %% A derived line followed by something
                             %% else: we only remember the "something
                             %% else" part.
                             FirstNewLineRefmt;
                         _ ->
                             false
                     end,
    LastLine1 = LastLine#formatted_line{
                  content = [LastLineContent, FirstNewLineContent],
                  props = LastLineProps#{
                            width => LastLineWidth + FirstNewLineWidth,
                            reformat_ok => LastLineRefmt1}},

    NewLines1 = case LastLineRefmt1 of
                    false ->
                        %% We also indent the remaining lines of the new
                        %% block so it keeps its internal alignement.
                        Padding = lists:duplicate(LastLineWidth, $\s),
                        [NewLine#formatted_line{
                           content = [Padding, NewLineContent],
                           props = NewLineProps#{
                                     width => LastLineWidth + NewLineWidth}}
                         || #formatted_line{content = NewLineContent,
                                            props = #{width := NewLineWidth} =
                                            NewLineProps} =
                            NewLine <- NewLines];
                    _ ->
                        NewLines
                end,

    Lines1 = lists:reverse([LastLine1 | RevLines]) ++ NewLines1,

    %% We put the resulting list of lines back into the block. We also
    %% need to adjust the width in the properties.
    BlockWidth = lists:max([LWidth
                            || #formatted_line{props = #{width := LWidth}}
                               <- Lines1]),
    BlockHeight1 = length(Lines1),
    Props1 = Props#{width => BlockWidth,
                    height => BlockHeight1},
    Result1 = Result#formatted_block{lines = Lines1,
                                     props = Props1},
    concat_formatted_subterms(Rest, Result1);
concat_formatted_subterms([], Result) ->
    Result.

-spec wrap_long_lines([stdout_formatter:formatted_line()],
                      paragraph_props()) ->
    [stdout_formatter:formatted_line()].
%% @private

wrap_long_lines(FormattedLines, #{wrap_at := false}) ->
    FormattedLines;
wrap_long_lines(FormattedLines, #{wrap_at := WrapAt})
  when is_integer(WrapAt) andalso WrapAt > 0 ->
    do_wrap_long_lines(FormattedLines, WrapAt, []).

-spec do_wrap_long_lines([stdout_formatter:formatted_line()],
                         pos_integer(),
                         [stdout_formatter:formatted_line()]) ->
    [stdout_formatter:formatted_line()].
%% @private

do_wrap_long_lines(
  [#formatted_line{props = #{reformat_ok :=
                             derived_from_previous_sibling}} | Rest],
  WrapAt,
  WrappedLines) ->
    %% This line will be recomputed from another line, we can drop it.
    do_wrap_long_lines(Rest, WrapAt, WrappedLines);
do_wrap_long_lines(
  [#formatted_line{props = #{reformat_ok := false}} = Line | Rest],
  WrapAt,
  WrappedLines) ->
    %% This line can't be reformatted, we keep it as is.
    do_wrap_long_lines(Rest, WrapAt, WrappedLines ++ [Line]);
do_wrap_long_lines(
  [#formatted_line{props = #{width := Width}} = Line | Rest],
  WrapAt,
  WrappedLines) when Width =< WrapAt ->
    %% The line fits into the defined limit, we keep it as is.
    do_wrap_long_lines(Rest, WrapAt, WrappedLines ++ [Line]);
do_wrap_long_lines(
  [#formatted_line{props = #{reformat_ok := Refmt} = Props} = Line | Rest],
  WrapAt,
  WrappedLines) when is_list(Refmt) ->
    %% This line didn't match the previous conditions, we must reformat
    %% it.
    [{Content, LWidth} | OtherLines] = wrap_content(Refmt, WrapAt, [], 0, []),
    Line1 = Line#formatted_line{content = Content,
                                props = Props#{width => LWidth}},
    OtherLines1 = [Line#formatted_line{
                     content = OtherContent,
                     props = Props#{width => OtherLWidth,
                                    reformat_ok =>
                                    derived_from_previous_sibling}}
                   || {OtherContent, OtherLWidth} <- OtherLines],
    do_wrap_long_lines(Rest, WrapAt, WrappedLines ++ [Line1 | OtherLines1]);
do_wrap_long_lines([], _, WrappedLines) ->
    WrappedLines.

-spec wrap_content(stdout_formatter:content_if_reformat(),
                   pos_integer(),
                   stdout_formatter:content_if_reformat(),
                   non_neg_integer(),
                   [stdout_formatter:content_if_reformat()]) ->
    nonempty_list({unicode:chardata(), non_neg_integer()}).
%% @private

wrap_content([{Color, _, _} = Content | Rest], WrapAt,
             CurrentLine, CurrentWidth, Result)
  when Color =:= color_start orelse Color =:= color_end ->
    %% A color tag is pushed to the current line as is. It is being
    %% handled later on in maybe_reapply_color().
    wrap_content(Rest, WrapAt, [Content | CurrentLine], CurrentWidth, Result);
wrap_content([{_, Width} = Content | Rest], WrapAt,
             CurrentLine, CurrentWidth, Result)
  when CurrentWidth + Width =< WrapAt ->
    %% This chunk fits in the current line (we are still below the
    %% WrapAt limit), so push it and move on.
    wrap_content(Rest, WrapAt,
                 [Content | CurrentLine], CurrentWidth + Width,
                 Result);
wrap_content([{Chunk, Width} = Content | Rest], WrapAt,
             CurrentLine, CurrentWidth, Result) ->
    %% Take #1: We try to find a space inside the chunk being handled so
    %% it fits inside WrapAt in the end.
    WrapChunkAt = WrapAt - CurrentWidth,
    case wrap_chunk(Chunk, Width, WrapChunkAt) of
        nomatch ->
            %% Take #2: We look up spaces in previous chunks.
            case retry_wrap_content(CurrentLine, [], []) of
                nomatch ->
                    %% Take #3: No space in the current line at all. We
                    %% cut the chunk in the middle of nowhere to fit
                    %% into WrapAt.
                    {LeftPart, RightPart} = wrap_chunk(
                                              Chunk, Width, WrapChunkAt,
                                              force),

                    %% The wrap_chunk() above always succeeds, we can
                    %% finish the current line with the left part and
                    %% add it to the result, reapplying colors if
                    %% necessary.
                    %%
                    %% The right part is pushed back to the data to
                    %% handle so the recursion takes care of it.
                    CurrentLine1 = [LeftPart | CurrentLine],
                    Rest1 = [RightPart | Rest],
                    {NewCurrentLine,
                     NewCurrentWidth,
                     NewResult} = maybe_reapply_color(CurrentLine1, Result),
                    wrap_content(Rest1, WrapAt,
                                 NewCurrentLine, NewCurrentWidth, NewResult);

                {LeftChunks, RightChunks} ->
                    %% We could split one of the previous chunks. The
                    %% left ones finish the current line which is added
                    %% to the result. The right ones are pushed back to
                    %% the data to handle.
                    Rest1 = RightChunks ++ [Content | Rest],
                    {NewCurrentLine,
                     NewCurrentWidth,
                     NewResult} = maybe_reapply_color(LeftChunks, Result),
                    wrap_content(Rest1, WrapAt,
                                 NewCurrentLine, NewCurrentWidth, NewResult)
            end;

        {LeftPart, RightPart} ->
            %% We could split the chunk being handled. Its left part
            %% finished the current line which is added to the result.
            %% The right part is pushed back to the data to handle.
            CurrentLine1 = [LeftPart | CurrentLine],
            Rest1 = [RightPart | Rest],
            {NewCurrentLine,
             NewCurrentWidth,
             NewResult} = maybe_reapply_color(CurrentLine1, Result),
            wrap_content(Rest1, WrapAt,
                         NewCurrentLine, NewCurrentWidth, NewResult)
    end;
wrap_content([], _, CurrentLine, _, Result) ->
    {"", 0, NewResult} = maybe_reapply_color(CurrentLine, Result),
    regen_lines(NewResult, []).

-spec retry_wrap_content(stdout_formatter:content_if_reformat(),
                         stdout_formatter:content_if_reformat(),
                         stdout_formatter:content_if_reformat()) ->
    nomatch |
    {stdout_formatter:content_if_reformat(),
     stdout_formatter:content_if_reformat()}.

retry_wrap_content([{Color, _, _} = Content | Rest], Left, Right)
  when Color =:= color_start orelse Color =:= color_end ->
    retry_wrap_content(Rest, Left, [Content | Right]);
retry_wrap_content([{Chunk, Width} = Content | Rest], Left, Right)
  when is_integer(Width) ->
    case wrap_chunk(Chunk, Width, Width) of
        nomatch ->
            retry_wrap_content(Rest, Left, [Content | Right]);
        {LeftPart, RightPart} ->
            Left1 = lists:reverse([LeftPart | Left]) ++ Rest,
            Right1 = [RightPart | Right],
            {Left1, Right1}
    end;
retry_wrap_content([], _, _) ->
    nomatch.

-spec wrap_chunk(unicode:chardata(), non_neg_integer(), non_neg_integer()) ->
    {{unicode:chardata(), non_neg_integer()},
     {unicode:chardata(), non_neg_integer()}} |
    nomatch.
%% @private

wrap_chunk(Chunk, Width, MaxWidth) ->
    wrap_chunk(Chunk, Width, MaxWidth, " ").

-spec wrap_chunk
(unicode:chardata(), non_neg_integer(), non_neg_integer(), force) ->
    {{unicode:chardata(), non_neg_integer()},
     {unicode:chardata(), non_neg_integer()}};
(unicode:chardata(), non_neg_integer(), non_neg_integer(), unicode:chardata()) ->
    {{unicode:chardata(), non_neg_integer()},
     {unicode:chardata(), non_neg_integer()}} |
    nomatch.
%% @private

wrap_chunk(Chunk, _, MaxWidth, force) ->
    %% The caller wants to split the string exactly at the specified
    %% `MaxWidth' because a previous attempt to split on a whitespace
    %% failed.
    LeftPart = string:trim(string:slice(Chunk, 0, MaxWidth), trailing),
    RightPart = string:trim(string:slice(Chunk, MaxWidth), leading),
    {{LeftPart, stdout_formatter_utils:displayed_length(LeftPart)},
     {RightPart, stdout_formatter_utils:displayed_length(RightPart)}};
wrap_chunk(Chunk, Width, MaxWidth, WrapOn) when Width >= MaxWidth ->
    %% The caller wants to split the string so the left part is
    %% `MaxWidth' columns at most. Therefore we split it at this mark
    %% and look up a space character backward.
    LeftPart0 = string:slice(Chunk, 0, MaxWidth),
    case string:find(LeftPart0, WrapOn, trailing) of
        nomatch ->
            nomatch;
        RightPart0 ->
            %% A space was found and `RightPart0' is the substring
            %% starting from it. We have to use that to recover the
            %% index of that space character.
            Index = MaxWidth - stdout_formatter_utils:displayed_length(
                                 RightPart0),

            %% Now that we have the position of the space character, we
            %% can split the original string at that index.
            LeftPart = string:trim(string:slice(Chunk, 0, Index), trailing),
            RightPart = string:trim(string:slice(Chunk, Index), leading),
            {{LeftPart, stdout_formatter_utils:displayed_length(LeftPart)},
             {RightPart, stdout_formatter_utils:displayed_length(RightPart)}}
    end.

-spec maybe_reapply_color(stdout_formatter:content_if_reformat(),
                          [stdout_formatter:content_if_reformat()]) ->
    {stdout_formatter:content_if_reformat(), non_neg_integer(),
     [stdout_formatter:content_if_reformat()]}.
%% @private

maybe_reapply_color(CurrentLine, Result) ->
    case find_applied_color(CurrentLine) of
        nomatch ->
            {[], 0,
             [CurrentLine | Result]};
        {color_start, Start, End} ->
            {[{color_start, Start, End}], 0,
             [[{color_end, Start, End} | CurrentLine] | Result]}
    end.

-spec find_applied_color(stdout_formatter:content_if_reformat()) ->
    {color_start, string(), string()} | nomatch.
%% @private

find_applied_color([{color_start, _, _} = Color | _]) ->
    Color;
find_applied_color([{color_end, _, _} | _]) ->
    nomatch;
find_applied_color([_ | Rest]) ->
    find_applied_color(Rest);
find_applied_color([]) ->
    nomatch.

-spec regen_lines([stdout_formatter:content_if_reformat()],
                  [{unicode:chardata(), non_neg_integer()}]) ->
    [{unicode:chardata(), non_neg_integer()}].
%% @private

regen_lines([Parts | Rest], Result) ->
    case cleanup_line_and_reverse(Parts) of
        [] ->
            regen_lines(Rest, Result);
        Parts1 ->
            Line = regen_line(Parts1, "", 0),
            regen_lines(Rest, [Line | Result])
    end;
regen_lines([], Result) ->
    Result.

-spec cleanup_line_and_reverse(stdout_formatter:content_if_reformat()) ->
    stdout_formatter:content_if_reformat().
%% @private

cleanup_line_and_reverse(Line) ->
    Line1 = lists:filter(fun
                             ({"", 0}) -> false;
                             (_)       -> true
                         end, Line),
    cleanup_line_and_reverse1(Line1, []).

-spec cleanup_line_and_reverse1(stdout_formatter:content_if_reformat(),
                                stdout_formatter:content_if_reformat()) ->
    stdout_formatter:content_if_reformat().
%% @private

cleanup_line_and_reverse1([{color_end, _, _}, {color_start, _, _} | Rest],
                          Result) ->
    cleanup_line_and_reverse1(Rest, Result);
cleanup_line_and_reverse1([Content | Rest], Result) ->
    cleanup_line_and_reverse1(Rest, [Content | Result]);
cleanup_line_and_reverse1([], Result) ->
    Result.

-spec regen_line(stdout_formatter:content_if_reformat(),
                 unicode:chardata(),
                 non_neg_integer()) ->
    {unicode:chardata(), non_neg_integer()}.
%% @private

regen_line([{color_start, Start, _} | Rest], Line, Width) ->
    regen_line(Rest, Line ++ Start, Width);
regen_line([{color_end, _, End} | Rest], Line, Width) ->
    regen_line(Rest, Line ++ End, Width);
regen_line([{Chunk, ChunkWidth} | Rest], Line, Width)
  when is_integer(ChunkWidth) ->
    regen_line(Rest, Line ++ Chunk, Width + ChunkWidth);
regen_line([], Line, Width) ->
    {Line, Width}.
