IGNORE_DEPS += edown eper eunit_formatters meck node_package rebar_lock_deps_plugin rebar_vsn_plugin reltool_util
C_SRC_DIR = /path/do/not/exist
C_SRC_TYPE = rebar
DRV_CFLAGS = -fPIC
export DRV_CFLAGS
ERLANG_ARCH = 64
export ERLANG_ARCH
ERLC_OPTS = +debug_info
export ERLC_OPTS
ERLC_OPTS += -I ./_build/default/plugins/gpb/include

DEPS += gun
dep_gun = hex 1.3.3 gun


rebar_dep: preprocess pre-deps deps pre-app app

preprocess::

pre-deps::

pre-app::

include $(if $(ERLANG_MK_FILENAME),$(ERLANG_MK_FILENAME),erlang.mk)