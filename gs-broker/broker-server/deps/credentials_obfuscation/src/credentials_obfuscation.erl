%% This Source Code Form is subject to the terms of the Mozilla Public
%% License, v. 2.0. If a copy of the MPL was not distributed with this
%% file, You can obtain one at https://mozilla.org/MPL/2.0/.
%%
%% Copyright (c) 2019-2020 VMware, Inc. or its affiliates.  All rights reserved.
%%

-module(credentials_obfuscation).

%% Configuration API
-export([enabled/0, cipher/0, hash/0, iterations/0, secret/0]).

%% API
-export([set_secret/1, encrypt/1, decrypt/1, refresh_config/0]).

-spec enabled() -> boolean().
enabled() ->
    credentials_obfuscation_svc:get_config(enabled).

-spec cipher() -> atom().
cipher() ->
    credentials_obfuscation_svc:get_config(cipher).

-spec hash() -> atom().
hash() ->
    credentials_obfuscation_svc:get_config(hash).

-spec iterations() -> non_neg_integer().
iterations() ->
    credentials_obfuscation_svc:get_config(iterations).

-spec secret() -> binary() | '$pending-secret'.
secret() ->
    credentials_obfuscation_svc:get_config(secret).

-spec set_secret(binary()) -> ok.
set_secret(Secret) when is_binary(Secret) ->
    ok = credentials_obfuscation_svc:set_secret(Secret).

-spec encrypt(term()) -> {plaintext, term()} | {encrypted, binary()}.
encrypt(none) -> none;
encrypt(undefined) -> undefined;
encrypt(Term) ->
    credentials_obfuscation_svc:encrypt(Term).

-spec decrypt({plaintext, term()} | {encrypted, binary()}) -> term().
decrypt(none) -> none;
decrypt(undefined) -> undefined;
decrypt(Term) ->
    credentials_obfuscation_svc:decrypt(Term).

-spec refresh_config() -> ok.
refresh_config() ->
    credentials_obfuscation_svc:refresh_config().
