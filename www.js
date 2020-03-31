const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const https = require("https");

let readerCache = {};
let podcastCache = [];
function getJSON (url) {

	return new Promise(resolve => {

		https.get(url, {

			gzip: true

		}, resp => {
			
			let data = "";

			resp.on("data", chunk => data += chunk);
			resp.on("end", () => {
				
				try {resolve(JSON.parse(data));} catch {resolve(data);};
				
			});

		});

	});

}

function getGzippedJSON (url) {

	return new Promise(resolve => {

		https.get(url, {

			gzip: true

		}, resp => {
			
			let data = "";

			var gunzip = zlib.createGunzip();
			resp.pipe(gunzip);

			gunzip.on("data", chunk => data += chunk);
			gunzip.on("end", () => {
				
				try {resolve(JSON.parse(data));} catch {resolve(data);};
				
			});

		});

	});

}

async function updatePodcastCache () {

	console.log("Updating podcast page!");
	const json = await getJSON("https://shows.acast.com/api/shows/5d9c8ccb34dfd91e4010ff4f/episodes?results=1000");
	
	if (typeof json !== "object") {

		fs.writeFileSync(path.join(__dirname, "invalid.json"), json.toString());
		console.log("Podcast fetching JSON error; see invalid.json");

	} else podcastCache = json.results;

}

async function getReader (id) {

	if (!readerCache[id]) {

		readerCache[id] = await getGzippedJSON(`https://reader3.isu.pub/privatesuitemag/${id}/reader3_4.json`);
		
	}

	return readerCache[id].document;

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

	/**
	 * @deprecated
	 */
	trim (text, max) {

		if (text.length > max) {
		
			return text.slice(0, max - 3) + "...";
				
		} else return text;
		
	},

	removeHTMLTags (string) {
			
		return string.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s\s+/g, " ");

	},

	getReader,

	podcast: {

		episodes () {

			return podcastCache;
	
		}	

	},

	posts: {

		all () {

			return db.elements.accessible().filter(_ => db.templates.templateNameFromId(_.template).toLowerCase() === "post");

		},

		section (section) {

			return this.all().filter(_ => _.fields.category.split(", ").indexOf(section) !== -1);

		},

		issueLink (issue) {

			return issue ? (issue.toLowerCase().startsWith("issue") ? `/issue/${parseInt(issue.split("/")[0].toLowerCase().replace("issue", '').trim())}${issue.split("/")[1] ? `/${issue.split("/")[1]}` : ""}` : "#") : "#";

		}

	}

});

schedule(async () => {

	await updatePodcastCache();

}).every("2.5 minutes");

(async () => await updatePodcastCache())();

const standard = req => ({

	...utils(`https://${req.hostname}/api`),

	query: req.query,
	params: req.params,

	default_image: "https://icon2.kisspng.com/20180411/ksq/kisspng-vaporwave-statue-aesthetics-seapunk-art-statue-of-liberty-5acdd5c454c0c2.4795892315234390443472.jpg",

	seo: {

		url: `https://${req.hostname}${req.url}`,
		title: "Private Suite Magazine",
		image: "https://privatesuitemag.com/img/favicon.png",
		description: "Private Suite is a vaporwave digital and print magazine."

	}

});

// Error Handlers

error((req, res, err) => {

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

get("/sw.js", (req, res) => {

	res.status(200);
	res.ejs("sw.ejs", standard(req));
	res.type("js");

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

get("/privacy", (req, res) => {

	res.status(200);
	res.ejs("views/privacy.ejs", standard(req));

});

get("/calendar", (req, res) => {

	if (req.cookies.calendar_email === "test@email.com") {

		res.status(200);
		res.ejs("views/calendar/calendar.ejs", standard(req));

	} else {

		res.status(200);
		res.ejs("views/calendar/welcome.ejs", standard(req));

	}

});

post("/calendar", (req, res) => {

	res.cookie("calendar_email", req.body.email);
	res.redirect("/calendar");

});

get("/christmas", (req, res) => {

	res.status(200);
	res.ejs("views/christmas.ejs", standard(req));

});
