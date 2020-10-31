"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultType;
(function (ResultType) {
    ResultType["any"] = "any";
    ResultType["video"] = "video";
    ResultType["channel"] = "channel";
    ResultType["playlist"] = "playlist";
    ResultType["movie"] = "movie";
    ResultType["live"] = "live";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
exports.ResultFilter = {
    [ResultType.any]: 'CAA%253D',
    [ResultType.video]: 'EgIQAQ%253D%253D',
    [ResultType.channel]: 'EgIQAg%253D%253D',
    [ResultType.playlist]: 'EgIQAw%253D%253D',
    [ResultType.movie]: 'EgIQBA%253D%253D',
    [ResultType.live]: 'EgJAAQ%253D%253D'
};
