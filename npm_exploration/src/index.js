// imports
import chalk from "chalk";
import * as dotenv from "dotenv";
import http from "http";

// config dotenv
dotenv.config();

const server = http.createServer((req, res) => {
	if (req.url.startsWith("/color/")) {
		res.writeHead(200, { "Content-Type": "text/html" });

		const color = `#${req.url.split("/color/")[1]}`;

    // return html with the color
		res.end(`
      <html>
        <body>
          <h1 style="color: ${color}">Wake up, Neo</h1>
        </body>
      </html>
    `);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Not Found" }));
	}
});

// listen to the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
