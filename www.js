auto(["/manifest.json", "/css/(.*)", "/img/(.*)", "/js/(.*)"]);

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

	}

});

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

	res.status(200);
	res.ejs("views/404.ejs", standard(req));

});

notFound((req, res) => {

	res.status(200);
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
