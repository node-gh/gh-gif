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
var giphy  = require('giphy-wrapper')('dc6zaTOxFJmzC'),
    logger = require(GH_PATH + 'lib/logger'),
    IssueImpl = require(GH_PATH + 'lib/cmds/issue').Impl;

// -- Constructor --------------------------------------------------------------
function Gif(options) {
    this.options = options;

    if (!options.number) {
        logger.error('You must specify a pull request or issue number to run this command');
    }

    this.issue = new IssueImpl(options);
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

    if (!options.comment && !options.reaction) {
        logger.error('Missing options command.');
    }

    if (options.image) {
        instance.image(options.image);
    }

    if (options.reaction) {
        instance.reaction(options.reaction);
    }

    logger.logTemplate('Adding comment on #{{options.number}}', {
        options: options
    });
};

Gif.prototype.image = function(image) {
    var options = this.options;

    options.comment = (options.comment) ? options.comment + '<br>' : '';
    options.comment += '![](' + image + ')';

    this.issue.comment(function(err) {
        if (err) {
            logger.error('Image not found.');
            return;
        }

        logger.compileTemplate('{{link}}', {options: options});
    });
};

Gif.prototype.reaction = function() {
    var instance = this,
        options = instance.options,
        random;

    giphy.search(options.reaction, 50, 0, function(err, result) {
        if (err) {
            logger.error(err);
            return;
        }

        result = result.data;

        if (typeof result !== 'object' || result.length < 1) {
            logger.error('No image found for your reaction.');
            return;
        }

        random = result[Math.floor(Math.random() * result.length)];
        options.image = random.images.original.url;
        instance.image(options.image);
    });
};

exports.Impl = Gif;