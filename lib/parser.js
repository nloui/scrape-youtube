"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Fetch all badges the channel has
 * @param video Video Renderer
 */
const getChannelBadges = (video) => {
    const ownerBadges = video.ownerBadges;
    return ownerBadges ? ownerBadges.map((badge) => badge['metadataBadgeRenderer']) : [];
};
/**
 * Attempt to find out if the channel is verified
 * @param video Video Renderer
 */
const isVerified = (video) => {
    const badges = getChannelBadges(video);
    return (badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST') ||
        badges.includes('BADGE_STYLE_TYPE_VERIFIED'));
};
/**
 * Attempt to fetch channel link
 * @param channel Channel Renderer
 */
const getChannelLink = (channel) => {
    return 'https://www.youtube.com' + (channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
        channel.navigationEndpoint.commandMetadata.webCommandMetadata.url);
};
/**
 * Compresses the "runs" texts into a single string.
 * @param key Video Renderer key
 */
const compress = (key) => {
    return (key && key['runs'] ? key['runs'].map((v) => v.text) : []).join('');
};
/**
 * Parse an hh:mm:ss timestamp into total seconds
 * @param text hh:mm:ss
 */
const parseDuration = (text) => {
    const nums = text.split(':');
    let sum = 0;
    let multi = 1;
    while (nums.length > 0) {
        sum += multi * parseInt(nums.pop() || '-1', 10);
        multi *= 60;
    }
    return sum;
};
/**
 * Sometimes the upload date is not available. YouTube is to blame, not this package.
 * @param video Video Renderer
 */
const getUploadDate = (video) => {
    return video.publishedTimeText ? video.publishedTimeText.simpleText : '';
};
const getViews = (video) => {
    return +(video.viewCountText.simpleText.replace(/[^0-9]/g, ''));
};
/**
 * Attempt to fetch the channel thumbnail
 * @param video Channel Renderer
 */
const getChannelThumbnail = (video) => {
    return video.channelThumbnailSupportedRenderers
        .channelThumbnailWithLinkRenderer
        .thumbnail
        .thumbnails[0].url;
};
const getVideoThumbnail = (id) => {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
};
/**
 * Fetch a video or playlist link using the supplied ID
 * @param id ID
 * @param playlist is playlist true/false
 */
const getLink = (id, playlist) => {
    return (playlist ? 'https://www.youtube.com/playlist?list=' : 'https://youtu.be/') + id;
};
/**
 * Fetch basic information about the channel
 * @param video Video Renderer
 */
exports.getChannelData = (video) => {
    const channel = video.ownerText.runs[0];
    return {
        name: channel.text,
        link: getChannelLink(channel),
        verified: isVerified(video),
        thumbnail: getChannelThumbnail(video)
    };
};
/**
 * Fetch the default result data included in all result types
 * @param result Video Renderer
 */
const getResultData = (result) => {
    return {
        id: result.videoId,
        title: compress(result.title),
        link: getLink(result.videoId, false),
        description: compress(result.descriptionSnippet),
        thumbnail: getVideoThumbnail(result.videoId),
        channel: exports.getChannelData(result)
    };
};
/**
 * Extract all information required for the "Video" result type
 * @param result Video Renderer
 */
exports.getVideoData = (result) => {
    return Object.assign(Object.assign({}, getResultData(result)), { views: getViews(result), uploaded: getUploadDate(result), duration: parseDuration(result.lengthText.simpleText) });
};
// TODO: These ↓
// const getPlaylistData = (result: any): Playlist => { };
// const getSteamData = (result: any): LiveSteam => { };
// const getMovieData = (result: any): Movie => { };
