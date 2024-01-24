%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%
%% @doc
%% This module implements the formatting of tables.

-module(stdout_formatter_table).

-include_lib("eunit/include/eunit.hrl").
-include("stdout_formatter.hrl").

-export([format/1,
         format/2,
         display/1,
         display/2,
         to_string/1,
         to_string/2]).

-ifdef(TEST).
-export([set_default_table_props/2,
         set_default_row_props/2,
         set_default_cell_props/2,
         normalize_rows_and_cells/2,
         compute_cols_widths/1,
         format_cell/1]).
-endif.

-type table() :: stdout_formatter:table().
-type row() :: stdout_formatter:row().
-type cell() :: stdout_formatter:cell().

-type normalized_cell() :: #cell{content ::
                                 stdout_formatter:formatted_block()}.
-type normalized_row() :: #row{cells :: [normalized_cell()]}.

-type cells() :: [stdout_formatter:cell() | stdout_formatter:formattable()].
-type rows() :: [stdout_formatter:row() | cells()].

-type padding_value() :: stdout_formatter:padding_value().

-spec format(stdout_formatter:table() | rows()) ->
    stdout_formatter:formatted_block().
%% @doc
%% Formats a table and returns a {@link formatted_block/0}.
%%
%% @see stdout_formatter:format/1.

format(Table) ->
    format(Table, #{}).

-spec format(stdout_formatter:table() | rows(), map()) ->
    stdout_formatter:formatted_block().
%% @doc
%% Formats a table and returns a {@link formatted_block/0}.
%%
%% @see stdout_formatter:format/2.

format(#table{rows = []}, _) ->
    %% An empty table is formatted as a nul block: no content and a
    %% width and height of zero.
    #formatted_block{};
format(#table{rows = Rows} = Table, InheritedProps) ->
    %% 1. We set default properties for the entire table.
    Table1 = set_default_table_props(Table, InheritedProps),

    %% 2. We normalize rows and cells. At the end, all rows are
    %%    represented as #row{} records, all cells are represented as a
    %%    #cell{} records and they contain a #formatted_block{} internal
    %%    structure (i.e. plain formatted lines of text). Also, if a row
    %%    has less cells, then we append empty cells. This simplifies
    %%    what follows because all rows have the same number of columns.
    NormalizedRows = normalize_rows_and_cells(Table1, Rows),

    %% 3. We compute the width of each column, thanks to the previous
    %%    step which took care of formatting the cells' content.
    ColsWidths = compute_cols_widths(NormalizedRows),

    %% 4. We format all lines of all rows. Note that a cell may contain
    %%    multiple lines. Among line, we also have vertical and
    %%    horizontal borders to separate cells.
    {Lines, Width, Height} = format_lines(Table1, NormalizedRows, ColsWidths),

    %% We can return the formatted internal structure.
    #formatted_block{lines = Lines,
                     props = #{width => Width,
                               height => Height}};
format(Rows, InheritedProps) when is_list(Rows) ->
    format(to_internal_struct(Rows), InheritedProps).

-spec to_string(stdout_formatter:table() | rows()) ->
    unicode:chardata().
%% @doc
%% Formats a table and returns a string.
%%
%% @see stdout_formatter:to_string/1.

to_string(Table) ->
    to_string(Table, #{}).

-spec to_string(stdout_formatter:table() | rows(), map()) ->
    unicode:chardata().
%% @doc
%% Formats a table and returns a string.
%%
%% @see stdout_formatter:to_string/2.

to_string(Table, InheritedProps) ->
    stdout_formatter:to_string(format(Table, InheritedProps)).

-spec display(stdout_formatter:table() | rows()) -> ok.
%% @doc
%% Formats a table and displays it on `stdout'.
%%
%% @see stdout_formatter:display/1.

display(Table) ->
    display(Table, #{}).

-spec display(stdout_formatter:table() | rows(), map()) -> ok.
%% @doc
%% Formats a table and displays it on `stdout'.
%%
%% @see stdout_formatter:display/2.

display(Table, InheritedProps) ->
    stdout_formatter:display(format(Table, InheritedProps)).

-spec to_internal_struct(rows()) -> table().
%% @private

to_internal_struct([] = Rows) ->
    #table{rows = Rows};
to_internal_struct([_ | _] = Rows) ->
    #table{rows = Rows}.

-spec set_default_table_props(table(), map()) -> table().
%% @private

set_default_table_props(#table{props = Props} = Table, InheritedProps) ->
    Defaults = #{border_drawing => ansi,
                 border_style => thin,
                 cell_padding => 0},
    Props1 = stdout_formatter_utils:set_default_props(Props,
                                                      Defaults,
                                                      InheritedProps),
    Table#table{props = Props1}.

-spec set_default_row_props(row(), map()) -> row().
%% @private

set_default_row_props(#row{props = Props} = Row, InheritedProps) ->
    Defaults = #{title => false,
                 title_repeat => 20},
    Props1 = stdout_formatter_utils:set_default_props(Props,
                                                      Defaults,
                                                      InheritedProps),
    Row#row{props = Props1}.

-spec set_default_cell_props(cell(), map()) -> cell().
%% @private

set_default_cell_props(#cell{props = Props} = Cell, InheritedProps) ->
    Padding = case InheritedProps of
                  #{cell_padding := P} -> P;
                  _                    -> 0
              end,
    Defaults = #{title => false,
                 padding => Padding},
    Props1 = stdout_formatter_utils:set_default_props(Props,
                                                      Defaults,
                                                      InheritedProps),
    Cell#cell{props = Props1}.

-spec normalize_rows_and_cells(table(), rows()) -> [normalized_row()].
%% @private

normalize_rows_and_cells(#table{props = TableProps}, Rows) ->
    %% The first step is to ensure all rows are represented as # row{}
    %% records and cells are represented as #cell{} records and contain
    %% already formatted content.
    %%
    %% While here, we also set default properties for rows if they are
    %% missing.
    InheritedProps = stdout_formatter_utils:merge_inherited_props(TableProps),
    Rows1 = [normalize_row_and_cells(Row, InheritedProps) || Row <- Rows],

    %% The second step is to ensure all rows have the same number of
    %% columns. If a row has less, empty cells are appended.
    Rows2 = fill_missing_cells(Rows1),

    %% The third step is to compute cell padding when there is an
    %% isolated cell which has a specific padding (as opposed to cell
    %% padding set globally at the table level.
    compute_cells_padding(Rows2).

-spec normalize_row_and_cells(row() | cells(), map()) -> normalized_row().
%% @private

normalize_row_and_cells(Row, InheritedProps) ->
    Row1 = any_to_row_record(Row, InheritedProps),
    #row{cells = Cells, props = RowProps} = Row1,
    InheritedProps1 = stdout_formatter_utils:merge_inherited_props(RowProps),
    Cells1 = [normalize_cell(Cell, InheritedProps1) || Cell <- Cells],
    Row1#row{cells = Cells1}.

-spec any_to_row_record(row() | cells(), map()) -> row().
%% @private

any_to_row_record(#row{} = Row, InheritedProps) ->
    set_default_row_props(Row, InheritedProps);
any_to_row_record(Cells, InheritedProps) when is_list(Cells) ->
    any_to_row_record(#row{cells = Cells}, InheritedProps).

-spec normalize_cell(cell() | stdout_formatter:formattable(), map()) ->
    normalized_cell().
%% @private

normalize_cell(#cell{} = Cell, InheritedProps) ->
    Cell1 = set_default_cell_props(Cell, InheritedProps),
    format_cell(Cell1);
normalize_cell(Content, InheritedProps) ->
    normalize_cell(#cell{content = Content}, InheritedProps).

-spec format_cell(cell() | stdout_formatter:formattable()) ->
    normalized_cell().
%% @private

format_cell(#cell{content = #formatted_block{}} = Cell) ->
    Cell;
format_cell(#cell{content = Content, props = Props} = Cell) ->
    InheritedProps = stdout_formatter_utils:merge_inherited_props(Props),
    Content1 = stdout_formatter:format(Content, InheritedProps),
    Cell#cell{content = Content1};
format_cell(Content) ->
    format_cell(#cell{content = Content}).

-spec fill_missing_cells([normalized_row()]) -> [normalized_row()].
%% @private

fill_missing_cells([]) ->
    [];
fill_missing_cells(Rows) ->
    MaxCellsPerRow = lists:max([length(Cells) || #row{cells = Cells} <- Rows]),
    #row{props = RowProps} = hd(Rows),
    InheritedProps = stdout_formatter_utils:merge_inherited_props(RowProps),
    EmptyCell = set_default_cell_props(
                  #cell{content = #formatted_block{}},
                  InheritedProps),
    [begin
         CellsCount = length(Cells),
         case CellsCount < MaxCellsPerRow of
             true ->
                 Cells1 = lists:append(
                   Cells,
                   lists:duplicate(MaxCellsPerRow - CellsCount, EmptyCell)),
                 Row#row{cells = Cells1};
             false ->
                 Row
         end
     end
     || #row{cells = Cells} = Row <- Rows].

-spec compute_cells_padding([normalized_row()]) -> [normalized_row()].
%% @private

compute_cells_padding([#row{cells = Cells} | _] = Rows) ->
    HorizontalPadding = compute_cells_horizontal_padding(
                          Rows,
                          lists:duplicate(length(Cells), {0, 0})),
    compute_cells_padding1(Rows, HorizontalPadding, []);
compute_cells_padding([] = Rows) ->
    Rows.

-spec compute_cells_padding1(
        [normalized_row()],
        [{padding_value(), padding_value()}],
        [normalized_row()]) ->
    [normalized_row()].
%% @private

compute_cells_padding1([#row{cells = Cells} = Row | Rest],
                      HorizontalPadding,
                      Result) ->
    VerticalPadding = compute_cells_vertical_padding(Cells, 0, 0),
    Cells1 = compute_cells_padding2(Cells,
                                    VerticalPadding,
                                    HorizontalPadding,
                                    []),
    Row1 = Row#row{cells = Cells1},
    compute_cells_padding1(Rest, HorizontalPadding, [Row1 | Result]);
compute_cells_padding1([], _, Result) ->
    lists:reverse(Result).

-spec compute_cells_padding2(
        [normalized_cell()],
        {padding_value(), padding_value()},
        [{padding_value(), padding_value()}],
        [normalized_cell()]) ->
    [normalized_cell()].
%% @private

compute_cells_padding2([#cell{props = Props} = Cell | Rest1],
                       {Top, Bottom} = VerticalPadding,
                       [{Left, Right} | Rest2],
                       Result) ->
    Props1 = Props#{padding => {Top, Right, Bottom, Left}},
    Cell1 = Cell#cell{props = Props1},
    compute_cells_padding2(Rest1, VerticalPadding, Rest2, [Cell1 | Result]);
compute_cells_padding2([], _, [], Result) ->
    lists:reverse(Result).

-spec compute_cells_horizontal_padding(
        [normalized_row()],
        [{padding_value(), padding_value()}]) ->
    [{padding_value(), padding_value()}].
%% @private

compute_cells_horizontal_padding([#row{cells = Cells} | Rest],
                                 HorizontalPadding) ->
    HorizontalPadding1 = compute_cells_horizontal_padding1(
                           Cells,
                           HorizontalPadding,
                           []),
    compute_cells_horizontal_padding(Rest, HorizontalPadding1);
compute_cells_horizontal_padding([], HorizontalPadding) ->
    HorizontalPadding.

-spec compute_cells_horizontal_padding1(
        [normalized_cell()],
        [{padding_value(), padding_value()}],
        [{padding_value(), padding_value()}]) ->
    [{padding_value(), padding_value()}].
%% @private

compute_cells_horizontal_padding1([Cell | Rest1],
                                  [{MaxLeft, MaxRight} | Rest2],
                                  Result) ->
    Left = get_left_padding(Cell),
    Right = get_right_padding(Cell),
    MaxLeft1 = erlang:max(Left, MaxLeft),
    MaxRight1 = erlang:max(Right, MaxRight),
    compute_cells_horizontal_padding1(Rest1,
                                      Rest2,
                                      [{MaxLeft1, MaxRight1} | Result]);
compute_cells_horizontal_padding1([], [], Result) ->
    lists:reverse(Result).
    
-spec compute_cells_vertical_padding(
        [normalized_cell()],
        padding_value(),
        padding_value()) ->
    {padding_value(), padding_value()}.
%% @private

compute_cells_vertical_padding([Cell | Rest], MaxTop, MaxBottom) ->
    Top = get_top_padding(Cell),
    Bottom = get_bottom_padding(Cell),
    MaxTop1 = erlang:max(Top, MaxTop),
    MaxBottom1 = erlang:max(Bottom, MaxBottom),
    compute_cells_vertical_padding(Rest, MaxTop1, MaxBottom1);
compute_cells_vertical_padding([], MaxTop, MaxBottom) ->
    {MaxTop, MaxBottom}.
                               
-spec compute_cols_widths([normalized_row()]) -> [non_neg_integer()].
%% @private

compute_cols_widths([]) ->
    [];
compute_cols_widths([#row{cells = Cells} | _] = Rows) ->
    ColsCount = length(Cells),
    ColsWidths = lists:duplicate(ColsCount, 0),
    do_compute_cols_widths(Rows, ColsWidths).

-spec do_compute_cols_widths([normalized_row()], [non_neg_integer()]) ->
    [non_neg_integer()].
%% @private

do_compute_cols_widths([#row{cells = Cells} | Rest], ColsWidths) ->
    ColsWidths1 = lists:zipwith(
                    fun(#cell{content =
                              #formatted_block{
                                 props = #{width := CurrentWidth}}} = Cell,
                        MaxWidth) ->
                            LeftPadding = get_left_padding(Cell),
                            RightPadding = get_right_padding(Cell),
                            CurrentWidth1 =
                            CurrentWidth + LeftPadding + RightPadding,
                            erlang:max(CurrentWidth1, MaxWidth)
                    end, Cells, ColsWidths),
    do_compute_cols_widths(Rest, ColsWidths1);
do_compute_cols_widths([], ColsWidths) ->
    ColsWidths.

-spec get_top_padding(normalized_cell()) -> padding_value().
%% @private

get_top_padding(#cell{props = #{padding := {Padding, _, _, _}}}) ->
    Padding;
get_top_padding(#cell{props = #{padding := {Padding, _}}}) ->
    Padding;
get_top_padding(#cell{props = #{padding := Padding}}) ->
    Padding.

-spec get_right_padding(normalized_cell()) -> padding_value().
%% @private

get_right_padding(#cell{props = #{padding := {_, Padding, _, _}}}) ->
    Padding;
get_right_padding(#cell{props = #{padding := {_, Padding}}}) ->
    Padding;
get_right_padding(#cell{props = #{padding := Padding}}) ->
    Padding.

-spec get_bottom_padding(normalized_cell()) -> padding_value().
%% @private

get_bottom_padding(#cell{props = #{padding := {_, _, Padding, _}}}) ->
    Padding;
get_bottom_padding(#cell{props = #{padding := {Padding, _}}}) ->
    Padding;
get_bottom_padding(#cell{props = #{padding := Padding}}) ->
    Padding.

-spec get_left_padding(normalized_cell()) -> padding_value().
%% @private

get_left_padding(#cell{props = #{padding := {_, _, _, Padding}}}) ->
    Padding;
get_left_padding(#cell{props = #{padding := {_, Padding}}}) ->
    Padding;
get_left_padding(#cell{props = #{padding := Padding}}) ->
    Padding.

-spec format_lines(table(), [normalized_row()], [non_neg_integer()]) ->
    {[stdout_formatter:formatted_line()],
     non_neg_integer(),
     non_neg_integer()}.
%% @private

format_lines(Table, Rows, ColsWidths) ->
    format_lines(Table, Rows, ColsWidths, [], 0, 0).

format_lines(Table,
             [Row | Rest],
             ColsWidths,
             FinalLines,
             _FinalWidth,
             FinalHeight) ->
    %% When we format a single row, we take care of the horizontal
    %% border just above it.
    %%
    %% Based on the number of final lines already produced, we determine
    %% if that horizontal border is the top of the table or somewhere in
    %% the middle.
    {BorderLines, BorderWidth, BorderHeight} = draw_row_horizontal_border(
                                                 Table,
                                                 ColsWidths,
                                                 case FinalLines of
                                                     [] -> top;
                                                     _  -> inside
                                                 end),

    %% We add cell padding: this step takes care of adding spaces before
    %% and/or after each line of the cells' content. This ensures that:
    %%   1. Content is aligned as expected (right/center/left).
    %%   2. All lines are normalized and have now the same width
    %%      (including trailing spaces).
    Row1 = add_cell_padding(Table, Row, ColsWidths),

    %% We transform cells into lines. E.g. line #1 of cell #1 and line
    %% #2 of cell #2 are concatenated, with vertical borders also added
    %% if needed. Then we do the same with line #2 of cell #1 and line
    %% #2 of cell #2, and so on.
    {RowLines, _Width, Height} = format_lines1(Table, Row1),

    format_lines(Table,
                 Rest,
                 ColsWidths,
                 FinalLines ++ BorderLines ++ RowLines,
                 BorderWidth,
                 FinalHeight + BorderHeight + Height);
format_lines(Table,
             [],
             ColsWidths,
             FinalLines,
             FinalWidth,
             FinalHeight) ->
    %% We are done with all rows: we can prepare the bottom horizontal
    %% border.
    {BorderLines, _BorderWidth, BorderHeight} = draw_row_horizontal_border(
                                                  Table,
                                                  ColsWidths,
                                                  bottom),
    {FinalLines ++ BorderLines,
     FinalWidth,
     FinalHeight + BorderHeight}.

-spec format_lines1(table(), normalized_row()) ->
    {[stdout_formatter:formatted_line()],
     non_neg_integer(),
     non_neg_integer()}.
%% @private

format_lines1(Table,
              #row{cells =
                   [#cell{content =
                          #formatted_block{
                             props = #{height := CellHeight}}} | _] = Cells
                  } = Row) ->
    {BorderLines, BorderWidth, BorderHeight} = draw_row_vertical_border(
                                                 Table, CellHeight),
    format_lines2(Table, Row, Cells, BorderLines, BorderWidth, BorderHeight).

-spec format_lines2(table(), normalized_row(), [normalized_cell()],
                    [stdout_formatter:formatted_line()],
                    non_neg_integer(), non_neg_integer()) ->
    {[stdout_formatter:formatted_line()],
     non_neg_integer(),
     non_neg_integer()}.
%% @private

format_lines2(Table,
              Row,
              [#cell{content =
                     #formatted_block{
                        lines = CellLines,
                        props = #{width := CellWidth,
                                  height := CellHeight}}} | Rest],
              FinalLines,
              FinalWidth,
              FinalHeight) ->
    {BorderLines, BorderWidth, BorderHeight} = draw_row_vertical_border(
                                                 Table, CellHeight),
    FinalLines1 = lists:zipwith3(
                    fun(#formatted_line{content = FinalContent,
                                        props = FinalProps} = FinalLine,
                        #formatted_line{content = CellContent,
                                        props = CellProps},
                        #formatted_line{content = BorderContent,
                                        props = BorderProps}) ->
                            #{width := FinalLWidth} = FinalProps,
                            #{width := CellLWidth} = CellProps,
                            #{width := BorderLWidth} = BorderProps,
                            LWidth = FinalLWidth + CellLWidth + BorderLWidth,
                            FinalLine#formatted_line{
                              content = [FinalContent,
                                         CellContent,
                                         BorderContent],
                              props = FinalProps#{width => LWidth}
                             }
                    end,
                    FinalLines, CellLines, BorderLines),
    FinalWidth1 = FinalWidth + CellWidth + BorderWidth,
    FinalHeight = BorderHeight,
    format_lines2(Table, Row, Rest, FinalLines1, FinalWidth1, FinalHeight);
format_lines2(_, _, [], FinalLines, FinalWidth, FinalHeight) ->
    {FinalLines, FinalWidth, FinalHeight}.

-spec add_cell_padding(table(), normalized_row(), [non_neg_integer()]) ->
    normalized_row().
%% @private

add_cell_padding(Table, #row{cells = Cells} = Row, ColsWidths) ->
    add_cell_horizontal_padding(Table, Row, Cells, ColsWidths, 0, []).

-spec add_cell_horizontal_padding(table(),
                                  normalized_row(),
                                  [normalized_cell()],
                                  [non_neg_integer()],
                                  non_neg_integer(),
                                  [normalized_cell()]) ->
    normalized_row().
%% @private

add_cell_horizontal_padding(
  Table,
  Row,
  [#cell{content =
         #formatted_block{lines = Lines,
                          props = #{height := CellHeight} = Props} = Content
        } = Cell | Rest1],
  [ColWidth | Rest2],
  MaxRowHeight,
  PaddedCells) ->
    LeftPaddingW = get_left_padding(Cell),
    LeftPadding = lists:duplicate(LeftPaddingW, $\s),
    PaddedLines = [begin
                       #{width := LWidth} = LProps,
                       Padding = ColWidth - LWidth - LeftPaddingW,
                       Line#formatted_line{
                         content = [LeftPadding,
                                    LContent,
                                    lists:duplicate(Padding, $\s)],
                         props = LProps#{width =>
                                         LWidth +
                                         Padding +
                                         LeftPaddingW}}
                   end
                   || #formatted_line{content = LContent,
                                      props = LProps} = Line <- Lines],
    Props1 = Props#{width => ColWidth},
    PaddedCell = Cell#cell{
                   content = Content#formatted_block{lines = PaddedLines,
                                                     props = Props1}},
    MaxRowHeight1 = erlang:max(CellHeight, MaxRowHeight),
    add_cell_horizontal_padding(Table,
                                Row,
                                Rest1,
                                Rest2,
                                MaxRowHeight1,
                                [PaddedCell | PaddedCells]);
add_cell_horizontal_padding(Table, Row, [], [], MaxRowHeight, PaddedCells) ->
    add_cell_vertical_padding(Table, Row, PaddedCells, MaxRowHeight, []).

-spec add_cell_vertical_padding(table(),
                                normalized_row(),
                                [normalized_cell()],
                                non_neg_integer(),
                                [normalized_cell()]) ->
    normalized_row().
%% @private

add_cell_vertical_padding(
  Table,
  Row,
  [#cell{content =
         #formatted_block{lines = Lines,
                          props = #{width := CellWidth,
                                    height := CellHeight} = Props} = Content
        } = Cell | Rest],
  RowHeight,
  PaddedCells) ->
    TopPaddingH = get_top_padding(Cell),
    BottomPaddingH = get_bottom_padding(Cell),
    RowHeight1 = RowHeight + TopPaddingH + BottomPaddingH,
    PaddedCell = case CellHeight < RowHeight1 of
                     true ->
                         EmptyContent = lists:duplicate(CellWidth, $\s),
                         EmptyProps = #{width => CellWidth,
                                        reformat_ok => false},
                         EmptyLine = #formatted_line{
                                        content = EmptyContent,
                                        props = EmptyProps},
                         PaddedLines = lists:duplicate(TopPaddingH,
                                                          EmptyLine) ++
                                       Lines ++
                                       lists:duplicate(RowHeight
                                                       - CellHeight
                                                       + BottomPaddingH,
                                                       EmptyLine),
                         Props1 = Props#{height => RowHeight1},
                         Cell#cell{
                           content =
                           Content#formatted_block{lines = PaddedLines,
                                                   props = Props1}};
                     false ->
                         Cell
                 end,
    add_cell_vertical_padding(Table,
                              Row,
                              Rest,
                              RowHeight,
                              [PaddedCell | PaddedCells]);
add_cell_vertical_padding(_, Row, [], _, PaddedCells) ->
    Row#row{cells = PaddedCells}.

-define(border_drawing_is_valid(V),
        V =:= ansi orelse
        V =:= ascii).
-define(border_style_is_valid(V),
        V =:= thin orelse
        V =:= none).

-spec draw_row_horizontal_border(table(), [non_neg_integer()],
                                 top | inside | bottom) ->
    {[stdout_formatter:formatted_line()],
     non_neg_integer(),
     non_neg_integer()}.
%% @private

draw_row_horizontal_border(#table{props = #{border_drawing := none}}, _, _) ->
    {
     [],
     0,
     0
    };
draw_row_horizontal_border(#table{props = #{border_drawing := Drawing,
                                            border_style := Style}},
                           ColsWidths,
                           Where)
  when ?border_drawing_is_valid(Drawing) andalso
       ?border_style_is_valid(Style) ->
    {StartChar, MiddleChar, EndChar, FillingChar} =
    case Drawing of
        ascii ->
            {"+", "+", "+", "-"};
        ansi ->
            case Style of
                thin ->
                    case Where of
                        top    -> {"\033(0l", "w", "k\033(B", "q"};
                        inside -> {"\033(0t", "n", "u\033(B", "q"};
                        bottom -> {"\033(0m", "v", "j\033(B", "q"}
                    end
            end
    end,
    Line = lists:flatten(
             [StartChar,
              lists:duplicate(hd(ColsWidths), FillingChar),
              [[MiddleChar, lists:duplicate(ColWidth, FillingChar)]
               || ColWidth <- tl(ColsWidths)],
              EndChar]),
    Width = lists:sum(ColsWidths) + length(ColsWidths) + 1,
    Height = 1,
    {
     [
      #formatted_line{
         content = Line,
         props = #{width => Width,
                   reformat_ok => false}
        }
     ],
     Width,
     Height
    }.

-spec draw_row_vertical_border(table(), pos_integer()) ->
    {[stdout_formatter:formatted_line()],
     non_neg_integer(),
     non_neg_integer()}.
%% @private

draw_row_vertical_border(#table{props = #{border_drawing := none}},
                         Height) ->
    {
     lists:duplicate(Height, #formatted_line{}),
     0,
     Height
    };
draw_row_vertical_border(#table{props = #{border_drawing := Drawing,
                                          border_style := Style}},
                         Height)
  when ?border_drawing_is_valid(Drawing) andalso
       ?border_style_is_valid(Style) ->
    LineContent = case Drawing of
                      ascii ->
                          "|";
                      ansi ->
                          case Style of
                              thin    -> "\033(0x\033(B"
                          end
                  end,
    Width = 1,
    Line = #formatted_line{content = LineContent,
                           props = #{width => Width,
                                     reformat_ok => false}},
    {
     lists:duplicate(Height, Line),
     Width,
     Height
    }.
