# abapPretty

ABAP pretty printer - Command line utility to format ABAP code on a server

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/abappretty.svg)](https://npmjs.org/package/abappretty)
[![Downloads/week](https://img.shields.io/npm/dw/abappretty.svg)](https://npmjs.org/package/abappretty)
[![License](https://img.shields.io/npm/l/abappretty.svg)](https://github.com/marcellourbani/abapPretty/blob/master/package.json)

| :warning: WARNING: this will overwrite whole packages with a single invocation. Use at your own risk and MAKE BACKUPS |
| --------------------------------------------------------------------------------------------------------------------- |


| If your system is too old you might need to install [this plugin](https://github.com/marcellourbani/abapfs_extensions) |
| ---------------------------------------------------------------------------------------------------------------------- |


<!-- toc -->
* [abapPretty](#abappretty)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

![prettyprint](https://user-images.githubusercontent.com/2453277/81149759-bbece980-8f76-11ea-8a6c-55acf6a2a90f.gif)

Converted this:

![before](https://user-images.githubusercontent.com/2453277/81147559-729a9b00-8f72-11ea-98a4-b18a220c06d3.png)

Into this:

![after](https://user-images.githubusercontent.com/2453277/81147793-f81e4b00-8f72-11ea-92bc-42844cd4f256.png)

# Usage

<!-- usage -->
```sh-session
$ npm install -g abappretty
$ abapPretty COMMAND
running command...
$ abapPretty (-v|--version|version)
abappretty/0.2.1 linux-x64 node-v12.16.1
$ abapPretty --help [COMMAND]
USAGE
  $ abapPretty COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`abapPretty connection`](#abappretty-connection)
* [`abapPretty connection:create ID BASEURL USERNAME [PASSWORD]`](#abappretty-connectioncreate-id-baseurl-username-password)
* [`abapPretty help [COMMAND]`](#abappretty-help-command)
* [`abapPretty list [OBJECTTYPE] [OBJECTNAME]`](#abappretty-list-objecttype-objectname)
* [`abapPretty prettyprint [OBJECTTYPE] [OBJECTNAME]`](#abappretty-prettyprint-objecttype-objectname)
* [`abapPretty simulate [OBJECTTYPE] [OBJECTNAME]`](#abappretty-simulate-objecttype-objectname)
* [`abapPretty supportedtypes`](#abappretty-supportedtypes)

## `abapPretty connection`

Lists stored connection details

```
USAGE
  $ abapPretty connection
```

_See code: [src/commands/connection/index.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/connection/index.ts)_

## `abapPretty connection:create ID BASEURL USERNAME [PASSWORD]`

Store the server and user details

```
USAGE
  $ abapPretty connection:create ID BASEURL USERNAME [PASSWORD]

ARGUMENTS
  ID        connection ID
  BASEURL   Server base URL
  USERNAME  Username
  PASSWORD  User password. If not set will be asked on use

OPTIONS
  -C, --client=client        SAP client to connect to
  -s, --skip-ssl-validation  Don't validate SSL certificate - DANGEROUS
  --certPath=certPath        Path to SSL certificate

EXAMPLE
  $ abapPretty connection:create MYCONN https://myserver:44300 myuser mypass --certPath=/secret/cert
```

_See code: [src/commands/connection/create.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/connection/create.ts)_

## `abapPretty help [COMMAND]`

display help for abapPretty

```
USAGE
  $ abapPretty help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `abapPretty list [OBJECTTYPE] [OBJECTNAME]`

List objects that would be updated

```
USAGE
  $ abapPretty list [OBJECTTYPE] [OBJECTNAME]

ARGUMENTS
  OBJECTTYPE  Base object type
  OBJECTNAME  Base object name

OPTIONS
  -C, --client=client                            SAP client to connect to
  -P, --port=port                                Port to connect to
  -c, --connectionId=connectionId                connection ID
  -h, --ashost=ashost                            SAP hostname
  -p, --password=password                        Password
  -r, --recursive                                Expand subpackages
  -s, --skip-ssl-validation=skip-ssl-validation  Don't validate SSL certificate - DANGEROUS
  -u, --user=user                                Username
  --certPath=certPath                            Path to SSL certificate
  --[no-]ssl                                     use SSL (default)

EXAMPLES
  $ abapPretty list -c MYCONN DEVC/K ZMYPACKAGE
  $ abapPretty list -h host -P port -u user -p password DEVC/K ZMYPACKAGE
  $ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty list DEVC/K ZMYPACKAGE'
```

_See code: [src/commands/list.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/list.ts)_

## `abapPretty prettyprint [OBJECTTYPE] [OBJECTNAME]`

Pretty prints every supported include file in the selected range

```
USAGE
  $ abapPretty prettyprint [OBJECTTYPE] [OBJECTNAME]

ARGUMENTS
  OBJECTTYPE  Base object type
  OBJECTNAME  Base object name

OPTIONS
  -C, --client=client                            SAP client to connect to
  -P, --port=port                                Port to connect to

  -a, --abaplint=abaplint                        Format using abapLint config file.
                                                 If left blank or set to <default> the default configuration will be
                                                 used

  -c, --connectionId=connectionId                connection ID

  -f, --file=file                                File with a list of objects to process

  -h, --ashost=ashost                            SAP hostname

  -p, --password=password                        Password

  -r, --recursive                                Expand subpackages

  -s, --skip-ssl-validation=skip-ssl-validation  Don't validate SSL certificate - DANGEROUS

  -t, --transport=transport                      Transport

  -u, --user=user                                Username

  --certPath=certPath                            Path to SSL certificate

  --[no-]ssl                                     use SSL (default)

EXAMPLES
  $ abapPretty prettyprint -c MYCONN DEVC/K ZMYPACKAGE
  $ abapPretty prettyprint -h host -P port -u user -p password DEVC/K ZMYPACKAGE -t transportnumber
  $ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty prettyprint DEVC/K ZMYPACKAGE'
```

_See code: [src/commands/prettyprint.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/prettyprint.ts)_

## `abapPretty simulate [OBJECTTYPE] [OBJECTNAME]`

Simulate updates: perform all actions except writing the formatted source and activating

```
USAGE
  $ abapPretty simulate [OBJECTTYPE] [OBJECTNAME]

ARGUMENTS
  OBJECTTYPE  Base object type
  OBJECTNAME  Base object name

OPTIONS
  -C, --client=client                            SAP client to connect to
  -P, --port=port                                Port to connect to

  -a, --abaplint=abaplint                        Format using abapLint config file.
                                                 If left blank or set to <default> the default configuration will be
                                                 used

  -c, --connectionId=connectionId                connection ID

  -f, --file=file                                File with a list of objects to process

  -h, --ashost=ashost                            SAP hostname

  -p, --password=password                        Password

  -r, --recursive                                Expand subpackages

  -s, --skip-ssl-validation=skip-ssl-validation  Don't validate SSL certificate - DANGEROUS

  -t, --transport=transport                      Transport

  -u, --user=user                                Username

  --certPath=certPath                            Path to SSL certificate

  --[no-]ssl                                     use SSL (default)

EXAMPLES
  $ abapPretty simulate -c MYCONN DEVC/K ZMYPACKAGE
  $ abapPretty simulate -h host -P port -u user -p password DEVC/K ZMYPACKAGE
  $ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty simulate DEVC/K ZMYPACKAGE'
```

_See code: [src/commands/simulate.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/simulate.ts)_

## `abapPretty supportedtypes`

List supported object types

```
USAGE
  $ abapPretty supportedtypes

EXAMPLE
  $ abapPretty supportedtypes
```

_See code: [src/commands/supportedtypes.ts](https://github.com/marcellourbani/abapPretty/blob/v0.2.1/src/commands/supportedtypes.ts)_
<!-- commandsstop -->
