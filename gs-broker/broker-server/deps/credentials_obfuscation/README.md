# Credential Obfuscator

This is a small library OTP application that acts as a helper. It encrypts and decrypts sensitive data
typically stored in processes state with a one-off key (key material must be provided on node start).
One example of such sensitive data is credentials used to access remote services.

This is necessary to avoid the sensitive values logged when process state is dumped by
the Erlang runtime (`error_logger`).

Note that this application **cannot protect against heap dumping attacks** and only helps
avoid sensitive data appearing in log files.

## Usage

First, make the `credentials_obfuscation` application a dependency of your project.

Then, during the start-up of your application, and after the `credentials_obfuscation` application starts,
provide the secret value:

``` erl
CookieBin = atom_to_binary(erlang:get_cookie(), latin1),
credentials_obfuscation:set_secret(CookieBin)
```

To use a random value, do the following:

``` erl
Bytes = crypto:strong_rand_bytes(128),
credentials_obfuscation:set_secret(Bytes)
```

To encrypt and decrypt a binary or list value:

``` erl
Encrypted = credentials_obfuscation:encrypt(<<"abc">>).
% => {encrypted,<<"KdH0bP4CYasbA3X79nKShEJhajQ7D7wz1G4yqJmDS4d7zRuuUhAPuQKxdDVgxQtO">>}

credentials_obfuscation:decrypt(Encrypted).
% => <<"abc">>
```

Lists (char lists in Elixir) will be converted to binaries before encryption.
This means that decrypted values will also be returned as binaries.

## License and Copyright

See [LICENSE](./LICENSE).

(c) 2019-2020 VMware, Inc or its affiliates.
