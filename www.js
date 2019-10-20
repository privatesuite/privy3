const https = require("https");

let podcastCache = [];
function getJSON (url) {

	return new Promise(resolve => {

		https.get(url, resp => {
			
			let data = "";

			resp.on("data", chunk => data += chunk);
			resp.on("end", () => resolve(JSON.parse(data)));

		});

	});

}

async function updatePodcastCache () {

	console.log("Updating podcast page!");
	podcastCache = (await getJSON("https://shows.pippa.io/api/shows/5d9c8ccb34dfd91e4010ff4f/episodes?results=1000")).results;

}

auto(["/robots.txt", "/manifest.json", "/css/(.*)", "/img/(.*)", "/js/(.*)"]);

const utils = API_ROOT => ({

	slugify (slug) {

		return slug.replace(/ /g, "_").replace(/\//g, "%2f").replace(/\?/g, "%3f").toLowerCase();

	},

	deslugify (slug) {

		return decodeURIComponent(slug.replace(/_/g, " ").replace(/%2f/g, "/")).replace(/%3f/g, "?");

	},

	file (path) {

		return `${API_ROOT}/file/${path}`;

	},

	capitalize (value) {

		return value.charAt(0).toUpperCase() + value.slice(1);

	},

	trim (text, max) {

		if (text.length > max) {
		
			return text.slice(0, max - 3) + "...";
				
		} else return text;
		
	},

	removeHTMLTags (string) {
			
		return string.replace(/<\/?[^>]+(>|$)/g, "");

	},

	podcastEpisodes () {

		return podcastCache;

	}

});

setInterval(async () => {

	await updatePodcastCache();

}, 1000 * 60 * 2.5);

(async () => await updatePodcastCache())();

const standard = req => ({

	...utils(`https://${req.hostname}/api`),

	params: req.params,

	default_image: "https://icon2.kisspng.com/20180411/ksq/kisspng-vaporwave-statue-aesthetics-seapunk-art-statue-of-liberty-5acdd5c454c0c2.4795892315234390443472.jpg",

	seo: {

		url: `https://${req.hostname}${req.url}`,
		title: "Private Suite Magazine",
		image: "https://privatesuitemag.com/img/favicon.png",
		description: "Private Suite is a vaporwave magazine publication"

	}

});

// Error Handlers

error((req, res) => {

	res.status(500);
	res.ejs("views/404.ejs", standard(req));

});

notFound((req, res) => {

	res.status(404);
	res.ejs("views/404.ejs", standard(req));

});

// Routes

get("/", (req, res) => {

	res.status(200);
	res.ejs("views/index.ejs", standard(req));

});

get("/about", (req, res) => {

	res.status(200);
	res.ejs("views/about.ejs", standard(req));

});

get("/sections", (req, res) => {

	res.status(200);
	res.ejs("views/sections.ejs", standard(req));

});

get("/section/:section", (req, res) => {

	res.status(200);
	res.ejs("views/section.ejs", standard(req));

});

get("/post/:post", (req, res) => {

	res.status(200);
	res.ejs("views/post.ejs", standard(req));

});

get("/issues", (req, res) => {

	res.status(200);
	res.ejs("views/issues.ejs", standard(req));

});

get("/issue/:issue/:page?", (req, res) => {

	res.status(200);
	res.ejs("views/issue.ejs", standard(req));

});

get("/podcast", (req, res) => {

	res.status(200);
	res.ejs("views/podcast.ejs", standard(req));

});

get("/podcast/:episode", (req, res) => {

	res.status(200);
	res.ejs("views/podcast_listen.ejs", standard(req));

});

get("/thanks", (req, res) => {

	res.status(200);
	res.ejs("views/thanks.ejs", standard(req));

});

get("/contact", (req, res) => {

	res.status(200);
	res.ejs("views/contact.ejs", standard(req));

});

get("/discover", (req, res) => {

	res.status(200);
	res.ejs("views/discover.ejs", standard(req));

});
