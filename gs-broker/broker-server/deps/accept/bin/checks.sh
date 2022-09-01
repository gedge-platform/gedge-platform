#!/bin/sh

rebar3 as test do xref, dialyzer, eunit
