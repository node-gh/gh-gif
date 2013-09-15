/*
 * Copyright 2013, All Rights Reserved.
 *
 * Code licensed under the MIT License:
 * http://zenorocha.mit-license.org
 *
 * @author Zeno Rocha <hi@zenorocha.com>
 */

var GH_PATH = process.env.GH_PATH;

// -- Requires -----------------------------------------------------------------,
var async  = require('async'),
    giphy  = require('giphy-wrapper')('Kyy2lc3guGBO0'),
    logger = require(GH_PATH + 'lib/logger');
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
    options: {
        'image': String,
        'number': Number,
        'reaction': String,
        'repo': String,
        'user': String
    },
    shorthands: {
        'i': [ '--image' ],
        'n': [ '--number' ],
        'R': [ '--reaction' ],
        'r': [ '--repo' ],
        'u': [ '--user' ]
    },
    payload: function(payload, options) {
        // No default command
    }
};

// -- Commands -----------------------------------------------------------------
Gif.prototype.run = function() {
    var instance = this,
        options = instance.options;

    if (options.reaction) {
        logger.logTemplate('{{prefix}} [info] Adding comment on {{greenBright "#" options.number}}', {
            options: options
        });

        instance.reaction(function(err) {
            logger.defaultCallback(
                err, null, logger.compileTemplate('{{link}}', { options: options }));
        });
    }
};

Gif.prototype.reaction = function(opt_callback) {
    var instance = this,
        options = instance.options,
        responseLimit = 50,
        randomNumber = Math.floor(Math.random() * responseLimit),
        operations;

    operations = [
        function(callback) {
            giphy.search(options.reaction, responseLimit, 0, function (err, result) {
                if (!err) {
                    options.image = result.data[randomNumber].images.original.url;
                }

                callback(err);
            });
        },
        function(callback) {
            options.comment = "![" + options.reaction + "](" + options.image + ")";
            instance.issue.comment(callback);
        }
    ];

    async.series(operations, opt_callback);
};

exports.Impl = Gif;