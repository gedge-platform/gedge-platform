%% @private
-module(accept_parser).

-export([ensure_string/1,
         parse/1,
         parse_option/1,
         map_options/2]).

-include("accept.hrl").

%%====================================================================
%% Public API
%%====================================================================

ensure_string(V) when is_list(V) ->
  V;
ensure_string(V) when is_binary(V) ->
  binary_to_list(V).

map_options(_, "") ->
  [];
map_options(_, <<"">>) ->
  [];
map_options(Fun, String) ->
  lists:filtermap(fun (OptionStr) ->
                      case parse_option(OptionStr) of
                        false -> false;
                        Option -> {true, Fun(Option)}
                      end
                  end,
                  string:tokens(ensure_string(String), ",")).

parse(String) ->
  map_options(fun (A) -> A end, String).

parse_option(OptionStr) ->
  [Option | RawParams] = lists:map(fun string:strip/1,
                                   string:tokens(OptionStr, ";")),
  case Option of
    "" ->
      false; %% ignore malformed option
    _  ->
      Params = lists:filtermap(fun parse_param/1, RawParams),
      {Q, ParamsWOQ} = find_q(Params),
      #accept_option{option=Option,
                     q=Q,
                     params=ParamsWOQ}
  end.

%%====================================================================
%% Private Parts
%%====================================================================

parse_param(Param) ->
  case string:tokens(Param, "=") of
    [Name, Value] -> {true, {Name, Value}};
    _ -> false %% simply ignore malformed Name=Value pairs
  end.

find_q(Params) ->
  {parse_q(proplists:get_value("q", Params, "1")),
   proplists:delete("q", Params)}.

parse_q(Q) ->
  %% extremely relaxed parser
  try
    case lists:member($., Q) of
      true ->
        list_to_float(Q);
      false ->
        list_to_integer(Q)
    end
  catch error:badarg ->
      0
  end.
