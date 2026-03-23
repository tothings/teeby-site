import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pages = [
	"01-hero.html",
	"02-collaboration.html",
	"03-smart.html",
	"04-skills.html",
	"05-privacy.html",
];

const WIDTH = 2880;
const HEIGHT = 1800;

async function capture() {
	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: WIDTH, height: HEIGHT },
		deviceScaleFactor: 1,
	});

	for (const page of pages) {
		const p = await context.newPage();
		const filePath = join(__dirname, page);
		await p.goto(`file://${filePath}`, { waitUntil: "networkidle" });
		// Wait a bit for fonts/images to render
		await p.waitForTimeout(500);

		const outName = page.replace(".html", ".png");
		await p.screenshot({
			path: join(__dirname, outName),
			clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
		});
		console.log(`✅ ${outName}`);
		await p.close();
	}

	await browser.close();
	console.log("\nDone! Screenshots saved to docs/appstore/");
}

capture().catch(console.error);
