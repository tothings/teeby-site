/**
 * App Store スクリーンショット全言語一括生成スクリプト
 *
 * Usage: node docs/appstore/generate-all.mjs
 *
 * 11言語 × 5枚 × 2サイズ(macOS/iPad) のスクリーンショットを生成し、
 * fastlane/screenshots/{lang}/ および fastlane/screenshots_ios/{lang}/ に配置する
 */

import { execSync } from "node:child_process";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const RAW_DIR = join(ROOT, "fastlane", "screenshots", "raw");

// Output sizes
const SIZES = [
	{
		name: "macOS",
		width: 2880,
		height: 1800,
		outDir: join(ROOT, "fastlane", "screenshots"),
	},
	{
		name: "iPad",
		width: 2732,
		height: 2048,
		outDir: join(ROOT, "fastlane", "screenshots_ios"),
	},
];

// Translations (headline only)
const TRANSLATIONS = {
	ja: {
		s01: { headline: "だれでも簡単に使えるAIノート" },
		s02: { headline: "AIとの共同作業で\n楽々ドキュメント作成" },
		s03: { headline: "使うほどに\nかしこくなる" },
		s04: { headline: "多彩なスキルを\n持つAIエージェント" },
		s05: { headline: "データは完全ローカル保存で\n安心あんぜん" },
	},
	"en-US": {
		s01: { headline: "AI Notes Made Simple\nfor Everyone" },
		s02: { headline: "Create Documents\nEffortlessly with AI" },
		s03: { headline: "Gets Smarter\nthe More You Use It" },
		s04: { headline: "An AI Agent with\nVersatile Skills" },
		s05: { headline: "Your Data Stays Local,\nSafe and Secure" },
	},
	ko: {
		s01: { headline: "누구나 쉽게 쓸 수 있는\nAI 노트" },
		s02: { headline: "AI와 함께하는\n간편한 문서 작성" },
		s03: { headline: "사용할수록\n똑똑해지는" },
		s04: { headline: "다양한 능력을 가진\nAI 에이전트" },
		s05: { headline: "데이터는 완전 로컬 저장\n안심하고 사용하세요" },
	},
	"de-DE": {
		s01: { headline: "KI-Notizen,\neinfach für alle" },
		s02: { headline: "Dokumente mühelos\nmit KI erstellen" },
		s03: { headline: "Wird immer klüger,\nje mehr Sie es nutzen" },
		s04: { headline: "Ein KI-Agent mit\nvielseitigen Fähigkeiten" },
		s05: { headline: "Ihre Daten bleiben\nlokal und sicher" },
	},
	"es-ES": {
		s01: { headline: "Notas con IA,\nfáciles para todos" },
		s02: { headline: "Crea documentos\nsin esfuerzo con IA" },
		s03: { headline: "Se vuelve más\ninteligente cuanto\nmás lo usas" },
		s04: { headline: "Un agente IA con\nhabilidades versátiles" },
		s05: { headline: "Tus datos se guardan\nlocalmente, seguros" },
	},
	"fr-FR": {
		s01: { headline: "Notes IA, simples\npour tout le monde" },
		s02: { headline: "Créez des documents\nsans effort avec l'IA" },
		s03: { headline: "Plus vous l'utilisez,\nplus il est intelligent" },
		s04: { headline: "Un agent IA aux\ncompétences variées" },
		s05: { headline: "Vos données restent\nlocales et sécurisées" },
	},
	it: {
		s01: { headline: "Note con IA, semplici\nper tutti" },
		s02: { headline: "Crea documenti\nsenza sforzo con l'IA" },
		s03: { headline: "Diventa più\nintelligente\npiù lo usi" },
		s04: { headline: "Un agente IA con\nabilità versatili" },
		s05: { headline: "I tuoi dati restano\nlocali e al sicuro" },
	},
	ru: {
		s01: { headline: "ИИ-заметки, простые\nдля каждого" },
		s02: { headline: "Создавайте документы\nлегко с помощью ИИ" },
		s03: { headline: "Чем больше\nиспользуете, тем\nумнее становится" },
		s04: { headline: "ИИ-агент с\nразнообразными\nнавыками" },
		s05: { headline: "Ваши данные хранятся\nлокально и в безопасности" },
	},
	"pt-BR": {
		s01: { headline: "Notas com IA, simples\npara todos" },
		s02: { headline: "Crie documentos\nfacilmente com IA" },
		s03: { headline: "Fica mais inteligente\nquanto mais você usa" },
		s04: { headline: "Um agente IA com\nhabilidades versáteis" },
		s05: { headline: "Seus dados ficam\nlocais e seguros" },
	},
	hi: {
		s01: { headline: "AI नोट्स, सबके लिए\nबिल्कुल आसान" },
		s02: { headline: "AI के साथ आसानी से\nदस्तावेज़ बनाएं" },
		s03: { headline: "जितना इस्तेमाल करें,\nउतना स्मार्ट बने" },
		s04: { headline: "विविध कौशल वाला\nAI एजेंट" },
		s05: { headline: "आपका डेटा पूरी तरह\nलोकल और सुरक्षित" },
	},
	"zh-Hans": {
		s01: { headline: "人人都能轻松使用的\nAI笔记" },
		s02: { headline: "与AI协作\n轻松创建文档" },
		s03: { headline: "越用越聪明" },
		s04: { headline: "技能多样的\nAI助手" },
		s05: { headline: "数据完全本地存储\n安全又放心" },
	},
};

// Common font stack
const FONTS =
	'-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif';

// ===== Template 01 & 05: Top headline + full screenshot below =====
function htmlTopHeadline(
	headline,
	{ width, height, bg, textColor, img, emojis, glows },
) {
	const imgWidth = Math.round(width * 0.83);
	const fontSize = Math.round(width * 0.042);
	const marginTop = Math.round(height * 0.055);
	const imgMarginTop = Math.round(height * 0.044);

	return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${width}px;height:${height}px;overflow:hidden;font-family:${FONTS};background:${bg};display:flex;flex-direction:column;align-items:center;position:relative}
.glow{position:absolute;border-radius:50%;filter:blur(60px);z-index:0}
${glows.map((g, i) => `.g${i}{width:${g.size}px;height:${g.size}px;background:${g.color};top:${g.top};left:${g.left};right:${g.right};bottom:${g.bottom}}`).join("\n")}
.emoji{position:absolute;z-index:4}
${emojis.map((e, i) => `.em${i}{top:${e.top};left:${e.left};right:${e.right};bottom:${e.bottom};font-size:${e.size}px;transform:rotate(${e.rotate}deg);opacity:${e.opacity}}`).join("\n")}
.copy{margin-top:${marginTop}px;text-align:center;position:relative;z-index:2}
.copy h1{font-size:${fontSize}px;font-weight:800;color:${textColor};letter-spacing:.02em;line-height:1.3;white-space:pre-line}
.sf{margin-top:${imgMarginTop}px;width:${imgWidth}px;position:relative;z-index:1}
.sf img{width:100%;border-radius:16px;box-shadow:0 40px 80px rgba(0,0,0,.15),0 16px 32px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.05)}
</style></head><body>
${glows.map((_, i) => `<div class="glow g${i}"></div>`).join("")}
${emojis.map((e, i) => `<div class="emoji em${i}">${e.char}</div>`).join("")}
<div class="copy"><h1>${headline}</h1></div>
<div class="sf"><img src="${img}"></div>
</body></html>`;
}

// ===== Template 02 & 04: Left fade + left headline + right screenshot =====
function htmlLeftFade(
	headline,
	{ width, height, bg, bgRgba, img, emojis, glows },
) {
	const fontSize = Math.round(width * 0.045);
	const imgSize = Math.round(width * 0.94);

	return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${width}px;height:${height}px;overflow:hidden;font-family:${FONTS};background:${bg};position:relative}
.glow{position:absolute;border-radius:50%;filter:blur(80px);z-index:0}
${glows.map((g, i) => `.g${i}{width:${g.size}px;height:${g.size}px;background:${g.color};top:${g.top};left:${g.left};right:${g.right};bottom:${g.bottom}}`).join("\n")}
.emoji{position:absolute;z-index:4}
${emojis.map((e, i) => `.em${i}{top:${e.top};left:${e.left};right:${e.right};bottom:${e.bottom};font-size:${e.size}px;transform:rotate(${e.rotate}deg);opacity:${e.opacity}}`).join("\n")}
.screenshot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${imgSize}px;height:auto;border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.08)}
.fade{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to right,${bgRgba(1)} 0%,${bgRgba(0.97)} 15%,${bgRgba(0.85)} 30%,${bgRgba(0.4)} 45%,transparent 60%);z-index:2}
.copy{position:absolute;top:50%;left:${Math.round(width * 0.055)}px;transform:translateY(-50%);z-index:3;max-width:${Math.round(width * 0.45)}px}
.copy h1{font-size:${fontSize}px;font-weight:800;color:#fff;letter-spacing:.02em;line-height:1.25;white-space:pre-line;text-shadow:0 4px 30px rgba(0,0,0,.2)}
</style></head><body>
${glows.map((_, i) => `<div class="glow g${i}"></div>`).join("")}
${emojis.map((e, i) => `<div class="emoji em${i}">${e.char}</div>`).join("")}
<img class="screenshot" src="${img}">
<div class="fade"></div>
<div class="copy"><h1>${headline}</h1></div>
</body></html>`;
}

// ===== Template 03: Right fade + right headline + left screenshot =====
function htmlRightFade(
	headline,
	{ width, height, bg, bgRgba, img, emojis, glows },
) {
	const fontSize = Math.round(width * 0.045);
	const imgSize = Math.round(width * 0.94);

	return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${width}px;height:${height}px;overflow:hidden;font-family:${FONTS};background:${bg};position:relative}
.glow{position:absolute;border-radius:50%;filter:blur(80px);z-index:0}
${glows.map((g, i) => `.g${i}{width:${g.size}px;height:${g.size}px;background:${g.color};top:${g.top};left:${g.left};right:${g.right};bottom:${g.bottom}}`).join("\n")}
.emoji{position:absolute;z-index:4}
${emojis.map((e, i) => `.em${i}{top:${e.top};left:${e.left};right:${e.right};bottom:${e.bottom};font-size:${e.size}px;transform:rotate(${e.rotate}deg);opacity:${e.opacity}}`).join("\n")}
.screenshot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${imgSize}px;height:auto;border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.08)}
.fade{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to left,${bgRgba(1)} 0%,${bgRgba(0.97)} 15%,${bgRgba(0.85)} 30%,${bgRgba(0.4)} 45%,transparent 60%);z-index:2}
.copy{position:absolute;top:50%;right:${Math.round(width * 0.055)}px;transform:translateY(-50%);z-index:3;max-width:${Math.round(width * 0.38)}px;text-align:right}
.copy h1{font-size:${fontSize}px;font-weight:800;color:#fff;letter-spacing:.02em;line-height:1.25;white-space:pre-line;text-shadow:0 4px 30px rgba(0,0,0,.15)}
</style></head><body>
${glows.map((_, i) => `<div class="glow g${i}"></div>`).join("")}
${emojis.map((e, i) => `<div class="emoji em${i}">${e.char}</div>`).join("")}
<img class="screenshot" src="${img}">
<div class="fade"></div>
<div class="copy"><h1>${headline}</h1></div>
</body></html>`;
}

// Template configs
const TEMPLATE_CONFIGS = {
	"01-hero": {
		fn: htmlTopHeadline,
		key: "s01",
		img: "01.png",
		bg: "linear-gradient(160deg,#faf7f2 0%,#f0e8dd 40%,#e8ddd0 100%)",
		textColor: "#1a1a1a",
		emojis: [
			{
				char: "✏️",
				top: "60px",
				left: "120px",
				right: "auto",
				bottom: "auto",
				size: 90,
				rotate: -15,
				opacity: 0.7,
			},
			{
				char: "💡",
				top: "180px",
				left: "auto",
				right: "150px",
				bottom: "auto",
				size: 70,
				rotate: 12,
				opacity: 0.7,
			},
			{
				char: "✨",
				top: "auto",
				left: "auto",
				right: "200px",
				bottom: "80px",
				size: 85,
				rotate: -8,
				opacity: 0.7,
			},
			{
				char: "📝",
				top: "auto",
				left: "180px",
				right: "auto",
				bottom: "60px",
				size: 65,
				rotate: 20,
				opacity: 0.7,
			},
			{
				char: "🤖",
				top: "50%",
				left: "60px",
				right: "auto",
				bottom: "auto",
				size: 60,
				rotate: -25,
				opacity: 0.5,
			},
			{
				char: "📚",
				top: "40%",
				left: "auto",
				right: "80px",
				bottom: "auto",
				size: 55,
				rotate: 18,
				opacity: 0.5,
			},
		],
		glows: [
			{
				size: 400,
				color: "rgba(162,155,254,.2)",
				top: "-100px",
				left: "auto",
				right: "200px",
				bottom: "auto",
			},
			{
				size: 300,
				color: "rgba(253,186,116,.25)",
				top: "auto",
				left: "-50px",
				right: "auto",
				bottom: "100px",
			},
			{
				size: 350,
				color: "rgba(134,239,172,.18)",
				top: "400px",
				left: "auto",
				right: "-80px",
				bottom: "auto",
			},
			{
				size: 250,
				color: "rgba(252,165,165,.2)",
				top: "auto",
				left: "300px",
				right: "auto",
				bottom: "400px",
			},
		],
	},
	"02-collaboration": {
		fn: htmlLeftFade,
		key: "s02",
		img: "02.png",
		bg: "linear-gradient(160deg,#4a3cb5 0%,#6c5ce7 30%,#a29bfe 70%,#7c6dd8 100%)",
		bgRgba: (a) => `rgba(74,60,181,${a})`,
		emojis: [
			{
				char: "💬",
				top: "100px",
				left: "80px",
				right: "auto",
				bottom: "auto",
				size: 90,
				rotate: -12,
				opacity: 0.8,
			},
			{
				char: "📝",
				top: "auto",
				left: "150px",
				right: "auto",
				bottom: "120px",
				size: 80,
				rotate: 15,
				opacity: 0.8,
			},
			{
				char: "✨",
				top: "45%",
				left: "50px",
				right: "auto",
				bottom: "auto",
				size: 70,
				rotate: -20,
				opacity: 0.6,
			},
			{
				char: "🤝",
				top: "200px",
				left: "400px",
				right: "auto",
				bottom: "auto",
				size: 60,
				rotate: 8,
				opacity: 0.5,
			},
			{
				char: "📄",
				top: "auto",
				left: "80px",
				right: "auto",
				bottom: "300px",
				size: 55,
				rotate: -5,
				opacity: 0.5,
			},
		],
		glows: [
			{
				size: 500,
				color: "rgba(255,255,255,.12)",
				top: "-150px",
				left: "-100px",
				right: "auto",
				bottom: "auto",
			},
			{
				size: 350,
				color: "rgba(196,181,253,.25)",
				top: "auto",
				left: "200px",
				right: "auto",
				bottom: "-80px",
			},
			{
				size: 400,
				color: "rgba(165,180,252,.15)",
				top: "300px",
				left: "-50px",
				right: "auto",
				bottom: "auto",
			},
		],
	},
	"03-smart": {
		fn: htmlRightFade,
		key: "s03",
		img: "03.png",
		bg: "linear-gradient(160deg,#0d9488 0%,#14b8a6 30%,#2dd4bf 60%,#5eead4 100%)",
		bgRgba: (a) => `rgba(13,148,136,${a})`,
		emojis: [
			{
				char: "🧠",
				top: "100px",
				left: "auto",
				right: "100px",
				bottom: "auto",
				size: 90,
				rotate: 12,
				opacity: 0.8,
			},
			{
				char: "📊",
				top: "auto",
				left: "auto",
				right: "130px",
				bottom: "130px",
				size: 80,
				rotate: -15,
				opacity: 0.8,
			},
			{
				char: "💡",
				top: "45%",
				left: "auto",
				right: "60px",
				bottom: "auto",
				size: 70,
				rotate: 20,
				opacity: 0.6,
			},
			{
				char: "📋",
				top: "220px",
				left: "auto",
				right: "420px",
				bottom: "auto",
				size: 60,
				rotate: -8,
				opacity: 0.5,
			},
			{
				char: "🎯",
				top: "auto",
				left: "auto",
				right: "80px",
				bottom: "320px",
				size: 55,
				rotate: 10,
				opacity: 0.5,
			},
		],
		glows: [
			{
				size: 450,
				color: "rgba(255,255,255,.12)",
				top: "-100px",
				left: "auto",
				right: "-80px",
				bottom: "auto",
			},
			{
				size: 350,
				color: "rgba(153,246,228,.25)",
				top: "auto",
				left: "auto",
				right: "200px",
				bottom: "-60px",
			},
			{
				size: 400,
				color: "rgba(94,234,212,.15)",
				top: "400px",
				left: "auto",
				right: "-50px",
				bottom: "auto",
			},
		],
	},
	"04-skills": {
		fn: htmlLeftFade,
		key: "s04",
		img: "04.png",
		bg: "linear-gradient(160deg,#1a1040 0%,#2d1b69 30%,#3b2280 60%,#241454 100%)",
		bgRgba: (a) => `rgba(26,16,64,${a})`,
		emojis: [
			{
				char: "🔍",
				top: "100px",
				left: "80px",
				right: "auto",
				bottom: "auto",
				size: 90,
				rotate: -10,
				opacity: 0.8,
			},
			{
				char: "🌐",
				top: "auto",
				left: "160px",
				right: "auto",
				bottom: "120px",
				size: 80,
				rotate: 15,
				opacity: 0.8,
			},
			{
				char: "⚡",
				top: "45%",
				left: "50px",
				right: "auto",
				bottom: "auto",
				size: 70,
				rotate: -18,
				opacity: 0.6,
			},
			{
				char: "🎯",
				top: "200px",
				left: "420px",
				right: "auto",
				bottom: "auto",
				size: 60,
				rotate: 8,
				opacity: 0.5,
			},
			{
				char: "🛠️",
				top: "auto",
				left: "80px",
				right: "auto",
				bottom: "320px",
				size: 55,
				rotate: -5,
				opacity: 0.5,
			},
		],
		glows: [
			{
				size: 500,
				color: "rgba(162,155,254,.2)",
				top: "-150px",
				left: "-100px",
				right: "auto",
				bottom: "auto",
			},
			{
				size: 350,
				color: "rgba(124,109,216,.25)",
				top: "auto",
				left: "200px",
				right: "auto",
				bottom: "-80px",
			},
			{
				size: 400,
				color: "rgba(196,181,253,.12)",
				top: "400px",
				left: "-50px",
				right: "auto",
				bottom: "auto",
			},
		],
	},
	"05-privacy": {
		fn: htmlTopHeadline,
		key: "s05",
		img: "05.png",
		bg: "linear-gradient(160deg,#f5f0eb 0%,#e8e0d8 40%,#ddd4ca 100%)",
		textColor: "#2a2a2a",
		emojis: [
			{
				char: "🔒",
				top: "60px",
				left: "auto",
				right: "150px",
				bottom: "auto",
				size: 90,
				rotate: 12,
				opacity: 0.7,
			},
			{
				char: "🛡️",
				top: "180px",
				left: "120px",
				right: "auto",
				bottom: "auto",
				size: 70,
				rotate: -15,
				opacity: 0.7,
			},
			{
				char: "✅",
				top: "auto",
				left: "200px",
				right: "auto",
				bottom: "80px",
				size: 85,
				rotate: 8,
				opacity: 0.7,
			},
			{
				char: "🔑",
				top: "auto",
				left: "auto",
				right: "180px",
				bottom: "60px",
				size: 65,
				rotate: -20,
				opacity: 0.7,
			},
			{
				char: "💻",
				top: "50%",
				left: "auto",
				right: "60px",
				bottom: "auto",
				size: 60,
				rotate: 18,
				opacity: 0.5,
			},
			{
				char: "🏠",
				top: "40%",
				left: "80px",
				right: "auto",
				bottom: "auto",
				size: 55,
				rotate: -10,
				opacity: 0.5,
			},
		],
		glows: [
			{
				size: 400,
				color: "rgba(16,185,129,.15)",
				top: "-100px",
				left: "200px",
				right: "auto",
				bottom: "auto",
			},
			{
				size: 300,
				color: "rgba(124,109,216,.15)",
				top: "auto",
				left: "auto",
				right: "-50px",
				bottom: "100px",
			},
			{
				size: 350,
				color: "rgba(59,130,246,.12)",
				top: "300px",
				left: "-80px",
				right: "auto",
				bottom: "auto",
			},
			{
				size: 250,
				color: "rgba(253,186,116,.18)",
				top: "auto",
				left: "auto",
				right: "300px",
				bottom: "400px",
			},
		],
	},
};

const TEMPLATE_NAMES = [
	"01-hero",
	"02-collaboration",
	"03-smart",
	"04-skills",
	"05-privacy",
];

// Main
let totalCount = 0;

for (const size of SIZES) {
	console.log(`\n📱 Generating ${size.name} (${size.width}x${size.height})...`);

	for (const [langCode, translations] of Object.entries(TRANSLATIONS)) {
		const outDir = join(size.outDir, langCode);
		mkdirSync(outDir, { recursive: true });

		for (const tmplName of TEMPLATE_NAMES) {
			const config = TEMPLATE_CONFIGS[tmplName];
			const t = translations[config.key];
			const imgPath = join(RAW_DIR, config.img);

			const htmlContent = config.fn(t.headline, {
				width: size.width,
				height: size.height,
				bg: config.bg,
				textColor: config.textColor,
				bgRgba: config.bgRgba,
				img: imgPath,
				emojis: config.emojis,
				glows: config.glows,
			});

			const tmpHtml = join(__dirname, `_tmp_${tmplName}.html`);
			writeFileSync(tmpHtml, htmlContent);

			const outPng = join(outDir, `${tmplName}.png`);
			try {
				execSync(
					`npx playwright screenshot --viewport-size="${size.width},${size.height}" "file://${tmpHtml}" "${outPng}"`,
					{ stdio: "pipe" },
				);
				totalCount++;
				console.log(`  ✅ [${langCode}] ${tmplName}.png`);
			} catch (e) {
				console.error(`  ❌ [${langCode}] ${tmplName}.png - ${e.message}`);
			}
		}
	}
}

// Clean up temp files
for (const tmplName of TEMPLATE_NAMES) {
	try {
		unlinkSync(join(__dirname, `_tmp_${tmplName}.html`));
	} catch {}
}

console.log(`\n🎉 Done! Generated ${totalCount} screenshots total.`);
