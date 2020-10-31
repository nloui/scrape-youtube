"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const interface_1 = require("./interface");
const parser_1 = require("./parser");
class Youtube {
    constructor() { }
    getURL(query, options) {
        var _a;
        const url = new URL('/results', 'https://www.youtube.com');
        url.search = new URLSearchParams({
            search_query: query,
            sp: options.sp || interface_1.ResultFilter[(options.type || 'video')],
            page: `${(_a = options.page) !== null && _a !== void 0 ? _a : 0}`
        }).toString();
        return url.href;
    }
    extractRenderData(page) {
        return new Promise((resolve, reject) => {
            try {
                // Last update they actually commented it as scraper data.
                const data = page.split('// scraper_data_begin')[1].trim()
                    .split('// scraper_data_end')[0].trim()
                    .slice(0, -1)
                    .slice('var ytInitialData = '.length);
                resolve(JSON.parse(data).contents
                    .twoColumnSearchResultsRenderer
                    .primaryContents
                    .sectionListRenderer
                    .contents[0]
                    .itemSectionRenderer
                    .contents);
            }
            catch (e) {
                console.log(e);
                reject('Failed to extract video data. The request may have been blocked');
            }
        });
    }
    /**
     * Parse the data extracted from the page to match each interface
     * @param data Video Renderer Data
     */
    parseData(data) {
        return new Promise((resolve, reject) => {
            try {
                const results = [];
                data.forEach((item) => {
                    const vRender = item['videoRenderer'];
                    if (!vRender)
                        return;
                    try {
                        const result = parser_1.getVideoData(vRender);
                        results.push(result);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    resolve(results);
                });
            }
            catch (e) {
                console.warn(e);
                reject('Fatal error when parsing result data. Please report this on GitHub');
            }
        });
    }
    /**
     * Load the page and scrape the data
     * @param query Search query
     * @param options Search options
     */
    load(query, options) {
        const url = this.getURL(query, options);
        return new Promise((resolve, reject) => {
            https_1.get(url, res => {
                res.setEncoding('utf8');
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }
    /**
     * Search YouTube for a list of videos
     * @param query Search Query
     * @param options Optional Search Options
     */
    search(query, options = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = yield this.load(query, options);
                const data = yield this.extractRenderData(page);
                const results = yield this.parseData(data);
                resolve(results);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
const youtube = new Youtube();
exports.default = youtube;
