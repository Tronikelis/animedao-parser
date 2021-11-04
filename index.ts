import axios from "axios";
import cheerio from "cheerio";
import { API_URL } from "./constants";
import { stringBetween } from "./utils";

interface Anime {
    name: string;
    href: string;
}

const search = async (key: string) => {
    const { data: res } = await axios.get(
        API_URL + "/search/?search=" + encodeURIComponent(key)
    );

    const $ = cheerio.load(res);
    const anime = $("div.col-xs-12.col-sm-6.col-md-6.col-lg-4");

    const data = [] as Anime[];

    anime.each((i, el) => {
        data.push({
            name: $(el).find(".ongoingtitle").find("b").text(),
            href: API_URL + $(el).find("a").attr("href") ?? "",
        });
    });

    return data;
};

interface Episodes {
    name: string;
    href: string;
}

const getEpisodes = async (href: string) => {
    const { data: res } = await axios.get(href);

    const $ = cheerio.load(res);
    const episodes = [] as Episodes[];

    $("a.episode_well_link").each((i, el) => {
        episodes.push({
            href: API_URL + $(el).attr("href"),
            name: $(el).find("div.anime-title").text(),
        });
    });

    return episodes;
};

const getVideo = async (href: string) => {
    const { data: res } = await axios.get<string>(href);

    console.log(
        stringBetween(res, '<iframe src="', '" scrolling="no"')
    );
};

getVideo("https://animedao.to/view/7295165043/");
