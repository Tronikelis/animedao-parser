"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upcoming = exports.recent = exports.getVideo = exports.getAnime = exports.search = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const url_1 = require("url");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
axios_1.default.defaults.headers.common = {
    "User-Agent": constants_1.USER_AGENT,
};
const search = async (key) => {
    const { data: res } = await axios_1.default.get(`${constants_1.BASE_URL}/search/?search=${encodeURIComponent(key)}`);
    const $ = cheerio_1.default.load(res);
    const anime = $("div.col-xs-12.col-sm-6.col-md-6.col-lg-4");
    const data = [];
    anime.each((i, el) => {
        data.push({
            title: $(el).find(".ongoingtitle").find("b").text(),
            slug: $(el).find("a").attr("href")?.replace(/\//g, "").replace(/anime/, "") || "",
            year: $(el).find("span b").text(),
            img: constants_1.BASE_URL + $(el).find("img").attr("data-src") || "",
            alternative: $(el).find("small").text(),
        });
    });
    return data;
};
exports.search = search;
const getAnime = async (slug) => {
    const { data: res } = await axios_1.default.get(`${constants_1.BASE_URL}/anime/${slug}`);
    const $ = cheerio_1.default.load(res);
    const episodes = [];
    $("a.episode_well_link").each((_, el) => {
        episodes.push({
            date: $(el).find(".front_time").text().trim(),
            id: $(el).attr("href")?.replace(/\D+/g, "") || "",
            name: $(el).find("div.anime-title").text().trim(),
        });
    });
    const card = $(".col-lg-8").text();
    const anime = {
        episodes,
        title: $(".col-lg-8 > h2:nth-child(1) > b:nth-child(1)").text().trim(),
        score: $(".col-lg-8 > h4:nth-child(2) > b:nth-child(1)").text().trim(),
        alternative: (0, utils_1.between)("Alternative:", "Rating:", card).trim(),
        rating: (0, utils_1.between)("Rating:", "Year:", card).trim(),
        year: (0, utils_1.between)("Year:", "Status:", card).trim(),
        status: (0, utils_1.between)("Status:", "Genres:", card).trim(),
        genres: $("a.animeinfo_label")
            .map((i, el) => $(el).text().trim())
            .toArray(),
        description: $(".visible-md")
            .text()
            .replace(/Description/, "")
            .trim(),
        next: $(".anime-countdown > center:nth-child(1) > b:nth-child(2)").text().trim(),
    };
    return anime;
};
exports.getAnime = getAnime;
const getVideo = async (id) => {
    const { data } = await axios_1.default.get(`${constants_1.BASE_URL}/view/${id}/`);
    const raw = (0, utils_1.between)(`vidstream").innerHTML = '<iframe src="`, `" scrolling="no"`, data);
    const { data: iframe } = await axios_1.default.get(`${constants_1.BASE_URL}${raw}`);
    const url = new url_1.URL("https:" + (0, utils_1.between)(`<iframe src="`, `" scrolling="no"`, iframe));
    const { data: html } = await axios_1.default.get(url.href);
    const $ = cheerio_1.default.load(html);
    const params = (0, utils_1.bypassGogo)($, url.searchParams.get("id") || "");
    const { data: videos } = await axios_1.default.get(`${url.protocol}//${url.hostname}/encrypt-ajax.php?${params}`, {
        headers: {
            "User-Agent": constants_1.USER_AGENT,
            Referrer: url.href,
            "X-Requested-With": "XMLHttpRequest",
        },
    });
    return videos;
};
exports.getVideo = getVideo;
const recent = async () => {
    const { data } = await axios_1.default.get(constants_1.BASE_URL);
    const $ = cheerio_1.default.load(data);
    const episodes = [];
    $("#new > div").each((_, el) => {
        const episode = (0, utils_1.between)("( Episode", ")", $(el).find("a:nth-child(1)").text()).trim();
        episodes.push({
            anime: $(el).find("a.latest-parent").text().trim(),
            date: $(el).find("span.front_time.animedao-color").text().trim(),
            description: $(el).find("span.latestanime-subtitle").text().trim(),
            episode,
            hot: $(el).text().includes("HOT"),
            img: constants_1.BASE_URL + $(el).find("img").attr("data-src"),
        });
    });
    return episodes;
};
exports.recent = recent;
const upcoming = async () => {
    const { data } = await axios_1.default.get("https://animedao.to/");
    const $ = cheerio_1.default.load(data);
    const episodes = [];
    $("#ongoing > div:nth-child(1)")
        .find(".well.ongoingtab")
        .each((_, el) => {
        episodes.push({
            alternative: $(el).find("small").text().trim(),
            img: constants_1.BASE_URL + $(el).find("img").attr("data-src"),
            title: $(el).find("b").text().trim(),
            when: $(el).find(".front_time").text().trim(),
        });
    });
    return episodes;
};
exports.upcoming = upcoming;
