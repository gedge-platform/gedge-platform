%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%

-module(credentials_obfuscation_svc).

-behaviour(gen_server).

-include("credentials_obfuscation.hrl").

%% API functions
-export([start_link/0,
         get_config/1,
         refresh_config/0,
         set_secret/1,
         encrypt/1,
         decrypt/1]).

%% gen_server callbacks
-export([init/1,
         handle_call/3,
         handle_cast/2,
         handle_info/2,
         terminate/2,
         code_change/3]).

-record(state, {enabled :: boolean(),
                cipher :: atom(),
                hash :: atom(),
                iterations :: non_neg_integer(),
                secret :: binary() | '$pending-secret'}).

-define(TIMEOUT, 30000).

%%%===================================================================
%%% API functions
%%%===================================================================

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

-spec get_config(atom()) -> term().
get_config(Config) ->
    gen_server:call(?MODULE, {get_config, Config}).

-spec refresh_config() -> ok.
refresh_config() ->
    gen_server:call(?MODULE, refresh_config).

-spec set_secret(binary()) -> ok.
set_secret(Secret) when is_binary(Secret) ->
    gen_server:call(?MODULE, {set_secret, Secret}).

-spec encrypt(term()) -> {plaintext, term()} | {encrypted, binary()}.
encrypt(Term) ->
    try
        gen_server:call(?MODULE, {encrypt, Term}, ?TIMEOUT)
    catch exit:{timeout, _} ->
            %% We treat timeouts the same way we do other "encryption is impossible"
            %% scenarios: return the original value. This won't be acceptable to every user
            %% but might be to some. There is no right or wrong answer to whether
            %% availability or security are more important, so the users have to decide
            %% whether using {plaintext, Term} results is appropriate in their specific case.
            {plaintext, Term};
          _:_ ->
            %% see above
            {plaintext, Term}
    end.

-spec decrypt({plaintext, term()} | {encrypted, binary()}) -> term().
decrypt(Term) ->
    gen_server:call(?MODULE, {decrypt, Term}, ?TIMEOUT).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

init([]) ->
    init_state().

handle_call({get_config, enabled}, _From, #state{enabled=Enabled}=State) ->
    {reply, Enabled, State};
handle_call({get_config, cipher}, _From, #state{cipher=Cipher}=State) ->
    {reply, Cipher, State};
handle_call({get_config, hash}, _From, #state{hash=Hash}=State) ->
    {reply, Hash, State};
handle_call({get_config, iterations}, _From, #state{iterations=Iterations}=State) ->
    {reply, Iterations, State};
handle_call({get_config, secret}, _From, #state{secret=Secret}=State) ->
    {reply, Secret, State};
handle_call(refresh_config, _From, State0) ->
    {ok, State1} = refresh_config(State0),
    {reply, ok, State1};
handle_call({encrypt, Term}, _From, #state{enabled=false}=State) ->
    {reply, Term, State};
handle_call({encrypt, Term}, _From, #state{cipher=Cipher,
                                           hash=Hash,
                                           iterations=Iterations,
                                           secret=Secret}=State) ->
    Encrypted = credentials_obfuscation_pbe:encrypt(Cipher, Hash, Iterations, Secret, Term),
    {reply, Encrypted, State};
handle_call({decrypt, Term}, _From, #state{enabled=false}=State) ->
    {reply, Term, State};
handle_call({decrypt, Term}, _From, #state{cipher=Cipher,
                                           hash=Hash,
                                           iterations=Iterations,
                                           secret=Secret}=State) ->
    Decrypted = credentials_obfuscation_pbe:decrypt(Cipher, Hash, Iterations, Secret, Term),
    {reply, Decrypted, State};
handle_call({set_secret, Secret}, _From, State0) ->
    State1 = State0#state{secret = Secret},
    {reply, ok, State1}.

handle_cast(_Message, State) ->
    {noreply, State}.

handle_info(_Message, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.


-spec init_state() ->  {'ok', #state{enabled::boolean(), cipher::atom(), hash::atom(), iterations::pos_integer(), secret::'$pending-secret'}}.
init_state() ->
    {ok, Enabled, Cipher, Hash, Iterations} = get_config_values(),
    ok = check(Cipher, Hash, Iterations),
    State = #state{enabled = Enabled, cipher = Cipher, hash = Hash,
                   iterations = Iterations, secret = ?PENDING_SECRET},
    {ok, State}.

-spec refresh_config(#state{enabled::boolean(), cipher::atom(), hash::atom(), iterations::non_neg_integer(), secret::'$pending-secret' | binary()}) ->
    {'ok', #state{enabled::boolean(), cipher::atom(), hash::atom(), iterations::non_neg_integer(), secret::'$pending-secret' | binary()}}.
refresh_config(#state{secret=Secret}=State0) ->
    {ok, Enabled, Cipher, Hash, Iterations} = get_config_values(),
    ok = case Enabled of
             true -> check(Cipher, Hash, Iterations);
             false -> ok
         end,
    State1 = State0#state{enabled = Enabled, cipher = Cipher, hash = Hash,
                          iterations = Iterations, secret = Secret},
    {ok, State1}.

get_config_values() ->
    Enabled = application:get_env(credentials_obfuscation, enabled, true),
    Cipher = application:get_env(credentials_obfuscation, cipher,
                                 credentials_obfuscation_pbe:default_cipher()),
    Hash = application:get_env(credentials_obfuscation, hash,
                               credentials_obfuscation_pbe:default_hash()),
    Iterations = application:get_env(credentials_obfuscation, iterations,
                                     credentials_obfuscation_pbe:default_iterations()),
    {ok, Enabled, Cipher, Hash, Iterations}.

check(Cipher, Hash, Iterations) ->
    Value = <<"dummy">>,
    TempSecret = crypto:strong_rand_bytes(128),
    E = credentials_obfuscation_pbe:encrypt(Cipher, Hash, Iterations, TempSecret, Value),
    Value = credentials_obfuscation_pbe:decrypt(Cipher, Hash, Iterations, TempSecret, E),
    ok.
