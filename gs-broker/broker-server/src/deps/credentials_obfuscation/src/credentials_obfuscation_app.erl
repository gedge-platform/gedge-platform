%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%

-module(credentials_obfuscation_app).

-behaviour(application).

-export([start/2, stop/1]).

-spec start(_,_) -> {'error', _} | {'ok', pid()} | {'ok', pid(), _}.
start(_StartType, _StartArgs) ->
    credentials_obfuscation_sup:start_link().

-spec stop(_) -> 'ok'.
stop(_State) ->
    ok.
