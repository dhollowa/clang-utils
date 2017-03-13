This package requires clang tools to be installed on your system an visible to your login $PATH.

To install clang utilities visit: http://releases.llvm.org/download.html

Currently only clang-format is supported. More to come...

TODO:
  - [x] format selected regions
  - [x] convert to babel / es6
  - [x] add optional config path for clang-format-file
  - [x] add optional config style parameter
  - [x] rename to clang-utils
  - [ ] fix bug with multi-selection state
  - [ ] split one-repo-per-package
  - [ ] add cursor positioning support
  - [ ] format file on save
  - [ ] add tests
  - [ ] add better error reporting with stderr displayed as alert, w/ etch?
  - [ ] clang-rename
  - [ ] clang-tidy
  - [ ] find-all-symbols
  - [ ] make available to atom's package manager