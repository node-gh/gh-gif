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
var giphy  = require('giphy-wrapper')('YOUR_API_KEY'),
    logger = require(GH_PATH + 'lib/logger');

// -- Constructor --------------------------------------------------------------
function Gif(options) {
    this.options = options;
}

// -- Constants ----------------------------------------------------------------
Gif.DETAILS = {
    description: 'NodeGH plugin for commenting on pull requests/issues using GIF reactions.',
    options: {
        'number': Boolean,
        'reaction': String
    },
    shorthands: {
        'n': [ '--number' ],
        'R': [ '--reaction' ]
    },
    payload: function(payload, options) {
        options.number = payload;
    }
};

// -- Commands -----------------------------------------------------------------
Gif.prototype.run = function() {
    var instance = this,
        options = instance.options;

    if (options.reaction) {
        instance.reaction();
    }
};

Gif.prototype.reaction = function() {
    giphy.search(options.reaction, 10, 0, function (err, data) {
        if (err) {
            logger.error(err);
        }

        console.log(data);
    });
};

exports.Impl = Gif;