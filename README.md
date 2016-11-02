# mcore-cli
A command line tool to generate mcore3 project.

## install
``` bash
npm install -g mcore-cli
```

## usage

``` bash
# view help
mcore-cli help
mcore-cli init --help
mcore-cli add --help

# command
mcore-cli init [project_path] -n [project_name] -l [project_language] -p [port]
mcore-cli add <componentName> -t view --path ./pack
```

# Add component
componentName can use a path, like:  staff/guide