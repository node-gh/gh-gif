/*
 * Copyright 2013, All Rights Reserved.
 *
 * Code licensed under the BSD License:
 * https://github.com/node-gh/gh/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <hi@zenorocha.com>
 * @author Eduardo Lundgren <edu@rdo.io>
 */

var GH_PATH = process.env.GH_PATH;

// -- Requires -----------------------------------------------------------------,
var async  = require('async'),
    giphy  = require('giphy-wrapper')('dc6zaTOxFJmzC'),
    logger = require(GH_PATH + 'lib/logger'),
    issueImpl = require(GH_PATH + 'lib/cmds/issue').Impl;

// -- Constructor --------------------------------------------------------------
function Gif(options) {
    this.options = options;

    if (!options.number) {
        logger.error('You must specify a pull request or issue number to run this command');
    }

    this.issue = new issueImpl(options);
}

// -- Constants ----------------------------------------------------------------
Gif.DETAILS = {
    description: 'NodeGH plugin for commenting on pull requests/issues using GIF reactions.',
    iterative: 'number',
    commands: [
        'image',
        'reaction'
    ],
    options: {
        'image': String,
        'number': [Number, Array],
        'reaction': String,
        'comment': String,
        'repo': String,
        'user': String
    },
    shorthands: {
        'i': [ '--image' ],
        'n': [ '--number' ],
        'R': [ '--reaction' ],
        'c': [ '--comment' ],
        'r': [ '--repo' ],
        'u': [ '--user' ]
    },
    payload: function() {
        // No default command
    }
};

// -- Commands -----------------------------------------------------------------
Gif.prototype.run = function() {
    var instance = this,
        options = instance.options;

    if (options.comment && !options.reaction) {
        logger.logTemplate('{{prefix}} [error] you forgot the --reaction options (shortcut -R)', {
            options: options
        });

        return false;
    }

    if (options.image) {
        logger.logTemplate('Adding comment on #{{options.number}}', {
            options: options
        });

        instance.image(options.image, function(err) {
            logger.defaultCallback(
                err, null, logger.compileTemplate('{{link}}', { options: options }));
        });
    }

    if (options.reaction) {
        logger.logTemplate('Adding comment on #{{options.number}}', {
            options: options
        });

        instance.reaction(function(err) {
            logger.defaultCallback(
                err, null, logger.compileTemplate('{{link}}', { options: options }));
        });
    }
};

Gif.prototype.image = function(image, opt_callback) {
    var instance = this,
        options = instance.options,
        operations;

    operations = [
        function(callback) {
            options.comment = (options.comment)? options.comment + '<br>' : '';
            options.comment += '![](' + image + ')';
            instance.issue.comment(callback);
        }
    ];

    async.series(operations, opt_callback);
};

Gif.prototype.reaction = function(opt_callback) {
    var instance = this,
        options = instance.options,
        operations,
        random;

    operations = [
        function(callback) {
            giphy.search(options.reaction, 50, 0, function(err, result) {
                if (!err) {
                    result = result.data;
                    random = result[Math.floor(Math.random() * result.length)];
                    options.image = random.images.original.url;
                }
                callback(err);
            });
        },
        function(callback) {
            instance.image(options.image, callback);
        }
    ];

    async.series(operations, opt_callback);
};

exports.Impl = Gif;