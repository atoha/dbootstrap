#!/usr/bin/env bash

# set -e

# Configuration
BASE_DIRECTORY=$(cd $(dirname $0) && pwd)
SOURCE_DIRECTORY="$BASE_DIRECTORY/source"
TOOLS_DIRECTORY="$SOURCE_DIRECTORY/util/buildscripts"
BUILD_DIRECTORY="$BASE_DIRECTORY/build"
LOADER_MODULE="gallery/entry_point"
LOADER_CONFIG="$SOURCE_DIRECTORY/$LOADER_MODULE.js"
PROFILE="$BASE_DIRECTORY/resource/profile.js"

# Prequesites
command -v perl >/dev/null 2>&1 || {
    echo >&2 "Perl required. Get it from http://www.perl.org";
    exit 1;
}

command -v node >/dev/null 2>&1 || {
    echo >&2 "Nodejs required. Get it from http://nodejs.org";
    exit 1;
}

command -v stylus >/dev/null 2>&1 || {
    echo >&2 "Stylus required. Get it from https://github.com/LearnBoost/stylus";
    exit 1;
}

# Build
if [ ! -d "$TOOLS_DIRECTORY" ]; then
    echo >&2 "Cannot find Dojo build tools - did you initialise submodules? "\
             "(git submodule update --init --recursive)"
    exit 1
fi

echo "Building application with $PROFILE to $BUILD_DIRECTORY."

echo -n "Cleaning old files..."
rm -rf "$BUILD_DIRECTORY"
echo " Done"

cd "$TOOLS_DIRECTORY"

node ../../dojo/dojo.js\
    load=build\
    --require "$LOADER_CONFIG"\
    --profile "$PROFILE"\
    --releaseDir "$BUILD_DIRECTORY"\
    "$@"

cp -R $SOURCE_DIRECTORY/nib $BUILD_DIRECTORY/
stylus --include "$BUILD_DIRECTORY/nib/lib"\
    "$BUILD_DIRECTORY/gallery/theme/gallery.styl"

stylus --include "$BUILD_DIRECTORY/nib/lib"\
    --include "$BUILD_DIRECTORY/dbootstrap/theme/bootstrap"\
    < "$BUILD_DIRECTORY/dbootstrap/theme/bootstrap/index.styl"\
    > "$BUILD_DIRECTORY/dbootstrap/theme/bootstrap/bootstrap.css"


cd "$BASE_DIRECTORY"

LOADER_MODULE=${LOADER_MODULE//\//\\\/}

# Copy and minify index.html to dist
cat "$SOURCE_DIRECTORY/index.html" | tr '\n' ' ' | \
perl -pe "
  s/<\!--.*?-->//g;                              # Strip comments
  s/isDebug: *1/deps:[\"$LOADER_MODULE\"]/;      # Remove isDebug, add deps
  s/<script src=\"$LOADER_MODULE.*?\/script>//;  # Remove script app/run
  s/\s+/ /g;                                     # Collapse white-space
" > "$BUILD_DIRECTORY/index.html"

echo "Build complete"

