#! /usr/bin/env python
# :coding: utf-8
# :copyright: Copyright 2012 Martin Pengelly-Phillips
# :license: See LICENSE.txt.

import sys
import os
import argparse
import shutil
import logging
import subprocess
import Queue
import threading
from fnmatch import fnmatch
import re


def main(arguments=None):
    '''Build Dbootstrap.'''
    if arguments is None:
        arguments = sys.argv[1:]

    # Parse arguments
    parser = argparse.ArgumentParser(description='Dbootstrap build.')
    parser.add_argument('target', choices=['theme', 'demo'],
                        help='Target to build.')
    parser.add_argument('--no-prune', action='store_true',
                        help='If set, prevent removal of unnecessary files.')
    parser.add_argument('--verbosity', '-v', default='info',
                        choices=['debug', 'info', 'warning', 'error',
                                 'critical'],
                        help='Logging output verbosity.')

    namespace = parser.parse_args()

    # Setup logging
    level = getattr(logging, namespace.verbosity.upper())
    logging.basicConfig(level=level)
    log = logging.getLogger('dbootstrap.build')

    # Configure common variables
    target = namespace.target
    project_path = os.path.abspath(os.path.dirname(__file__))
    source_path = os.path.join(project_path, 'source')
    build_path = os.path.join(project_path, 'build', target)

    log.info('Building {0} to {1}'.format(target, build_path))
    issues = 0
    temporary_files = set()

    # Clean build folder
    if os.path.exists(build_path):
        log.info('Removing existing build folder at {0}'.format(build_path))
        shutil.rmtree(build_path)

    # Build
    log.info('Building CSS.')
    nib_lib_path = os.path.join(source_path, 'nib', 'lib')
    dbootstrap_theme_path = os.path.join(
        source_path, 'dbootstrap', 'theme', 'dbootstrap'
    )

    result = execute([
        'stylus', '--include', nib_lib_path,
        '--include', dbootstrap_theme_path,
        os.path.join(dbootstrap_theme_path, 'index.styl')
    ])
    if not result:
        issues += 1

    dbootstrap_css_path = os.path.join(dbootstrap_theme_path, 'dbootstrap.css')
    if os.path.exists(dbootstrap_css_path):
        os.remove(dbootstrap_css_path)
    
    os.rename(
        os.path.join(dbootstrap_theme_path, 'index.css'),
        dbootstrap_css_path
    )
    temporary_files.add(dbootstrap_css_path)

    if target == 'demo':
        result = execute([
            'stylus', '--include', nib_lib_path,
            os.path.join(source_path, 'gallery', 'theme', 'gallery.styl')
        ])
        if not result:
            issues += 1

        temporary_files.add(
            os.path.join(source_path, 'gallery', 'theme', 'gallery.css')
        )

        loader_path = os.path.join(source_path, 'gallery', 'entry_point.js')
        profile_path = os.path.join(
            project_path, 'resource', 'gallery_profile.js'
        )

        log.info('Building Javascript packages.')
        result = execute([
            'node', os.path.join(source_path, 'dojo', 'dojo.js'), 'load=build',
            '--require', loader_path, '--profile', profile_path,
            '--releaseDir', build_path
        ])
        if not result:
            issues += 1

        # Copy html index file and alter to run from built files instead of
        # source.
        log.info('Copying and modifying HTML index file.')
        index_file = os.path.join(build_path, 'index.html')
        shutil.copy(
            os.path.join(source_path, 'index.html'),
            index_file
        )
        with open(index_file, 'r+') as file:
            contents = file.read()
            contents = re.sub('isDebug: 1', 'deps: ["gallery"]', contents)
            contents = re.sub(
                '.+src=\'gallery/entry_point\.js\'.+\n.+\</script\>.*\n',
                '',
                contents
            )
            file.seek(0)
            file.truncate()
            file.write(contents)

    elif target == 'theme':
        log.info('Building Javascript packages.')
        profile_path = os.path.join(
            project_path, 'resource', 'dbootstrap_profile.js'
        )

        result = execute([
            'node', os.path.join(source_path, 'dojo', 'dojo.js'), 'load=build',
            '--profile', profile_path,
            '--releaseDir', build_path
        ])
        if not result:
            issues += 1

    # Remove all unnecessary files.
    if not namespace.no_prune:
        log.info('Removing temporary and unnecessary files.')

        for filepath in temporary_files:
            log.debug('Removing {0}'.format(filepath))
            os.remove(filepath)

        if target == 'demo':
            for package in ('dojox', 'dgrid', 'put-selector',
                            'xstyle'):
                package_path = os.path.join(build_path, package)
                log.debug('Removing {0}'.format(package_path))
                shutil.rmtree(package_path)

        elif target == 'theme':
            for package in ('dojo', 'dijit', 'xstyle'):
                package_path = os.path.join(build_path, package)
                log.debug('Removing {0}'.format(package_path))
                shutil.rmtree(package_path)

        if target == 'demo':
            keepers = [
                '*index.html',
                '*nls*',

                # Gallery
                '*gallery/main.js',
                '*gallery/theme/gallery.css',

                # Dojo
                '*dojo/dojo.js',
                '*dojo/resources/blank.gif',
                '*dijit/themes/a11y/indeterminate_progress.gif',

                # Dbootstrap theme
                '*dbootstrap/main.js',
                '*package.json',
                '*dbootstrap.css',
                '*dbootstrap/dijit.css',
                '*font/fontawesome-webfont*'
            ]

        elif target == 'theme':
            keepers = [
                '*dbootstrap/main.js',
                '*package.json',
                '*dbootstrap.css',
                '*dbootstrap/dijit.css',
                '*font/fontawesome-webfont*'
            ]

        for path, directories, files in os.walk(build_path, topdown=False):
            for name in files:
                keep = False
                filepath = os.path.join(path, name)
                for pattern in keepers:
                    if fnmatch(filepath, pattern):
                        keep = True
                        break

                if not keep:
                    log.debug('Removing {0}'.format(filepath))
                    os.remove(filepath)

            # Remove empty directories
            if not os.listdir(path):
                log.debug('Removing empty directory {0}'.format(path))
                os.rmdir(path)

    if issues:
        log.info('Build completed with issues.')
    else:
        log.info('Build completed successfully.')



class CommandExecutionException(Exception):
    '''Raise when a command execution issue occurs.'''


def execute(command):
    '''Run the given *command* in a subprocess streaming output to a log.'''
    log = logging.getLogger('dbootstrap.build.execute')
    command = map(str, command)
    
    # Windows doesn't auto resolve .cmd extensions so add manually when
    # required.
    if os.name in ('nt',):
        if command[0] == 'stylus':
            command[0] += '.cmd'
    
    log.debug('Running command: {0}'.format(' '.join(command)))

    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
    except OSError, error:
        raise CommandExecutionException(
            '{0} failed due to error: {1}.'.format(
                ' '.join(command),
                str(error)
            )
        )

    def _publish(handle, queue):
        '''Stream output from *handle* into *queue*.'''
        for line in iter(handle.readline, b''):
            queue.put(line)
        handle.close()

    queue = Queue.Queue()
    thread = threading.Thread(target=_publish, args=(process.stdout, queue))
    thread.daemon = True
    thread.start()

    # Collect output whilst process executing
    while True:
        process.poll()
        try:
            line = queue.get(False)
        except Queue.Empty:
            if process.returncode is not None:
                break
        else:
            line = line.strip()
            if line:
                log.debug(line)

    process.wait()
    thread.join()

    while True:
        try:
            line = queue.get(False)
        except Queue.Empty:
            break
        else:
            line = line.strip()
            if line:
                log.debug(line)

    # Check return code
    return_code = process.returncode
    if not return_code == 0:
        log.warning('Command {0} exited with code {1}'.format(
                ' '.join(command),
                return_code
        ))
        return False

    return True


if __name__ == '__main__':
    raise SystemExit(main())
