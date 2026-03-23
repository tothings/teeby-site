/**
 * App Store スクリーンショット全言語一括生成スクリプト
 *
 * Usage: node docs/appstore/generate-all.mjs
 *
 * 11言語 × 5枚 = 55枚のスクリーンショットを生成し、
 * fastlane/screenshots/{lang}/ に配置する
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

const WIDTH = 2880;
const HEIGHT = 1800;

// fastlane language code mapping
const LANGUAGES = {
	ja: "ja",
	"en-US": "en-US",
	ko: "ko",
	"de-DE": "de-DE",
	"es-ES": "es-ES",
	"fr-FR": "fr-FR",
	it: "it",
	ru: "ru",
	"pt-BR": "pt-BR",
	hi: "hi",
	"zh-Hans": "zh-Hans",
};

// Translations for each screenshot
const TRANSLATIONS = {
	ja: {
		s01: { headline: "だれでも簡単に使えるAIノート" },
		s02: {
			headline: "AIとの共同作業で\n楽々ドキュメント作成",
			userLabel: "あなた",
			aiLabel: "Teeby AI",
			docLabel: "ドキュメント",
			bubbleUser: "「この内容を表形式にまとめて」",
			bubbleAI: "「表形式に整理しました ✓」",
		},
		s03: {
			headline: "使うほどにかしこくなる",
			cards: [
				"プロジェクト企画書",
				"マーケティング戦略",
				"アイデアメモ",
				"議事録",
				"リサーチノート",
				"タスク管理",
			],
		},
		s04: {
			headline: "多彩なスキルを持つAIエージェント",
			skills: [
				"Web検索",
				"ドキュメント作成",
				"ファイル添付",
				"音声入力",
				"ノート検索",
				"画像認識",
			],
		},
		s05: {
			headline: "データは完全ローカル保存で\n安心あんぜん",
			badge1Title: "完全ローカル保存",
			badge1Desc: "データはMacのみに保存",
			badge2Title: "BYOK方式",
			badge2Desc: "あなたのAPIキーで安心利用",
			badge3Title: "マルチモデル対応",
			badge3Desc: "Gemini / Claude から選択",
			check1: "外部サーバーへのアップロードなし",
			check2: "機密情報も安心して取り扱い可能",
		},
	},
	"en-US": {
		s01: { headline: "AI Notes Made Simple\nfor Everyone" },
		s02: {
			headline: "Create Documents\nEffortlessly with AI",
			userLabel: "You",
			aiLabel: "Teeby AI",
			docLabel: "Document",
			bubbleUser: '"Summarize this into a table"',
			bubbleAI: '"Here\'s the organized table ✓"',
		},
		s03: {
			headline: "Gets Smarter\nthe More You Use It",
			cards: [
				"Project Plans",
				"Marketing Strategy",
				"Quick Ideas",
				"Meeting Notes",
				"Research Notes",
				"Task Tracker",
			],
		},
		s04: {
			headline: "An AI Agent with\nVersatile Skills",
			skills: [
				"Web Search",
				"Doc Creation",
				"File Attach",
				"Voice Input",
				"Note Search",
				"Image Recognition",
			],
		},
		s05: {
			headline: "Your Data Stays Local,\nSafe and Secure",
			badge1Title: "Fully Local Storage",
			badge1Desc: "Data stays on your Mac only",
			badge2Title: "BYOK Model",
			badge2Desc: "Use your own API keys",
			badge3Title: "Multi-Model Support",
			badge3Desc: "Choose Gemini or Claude",
			check1: "No uploads to external servers",
			check2: "Handle confidential info with confidence",
		},
	},
	ko: {
		s01: { headline: "누구나 쉽게 쓸 수 있는\nAI 노트" },
		s02: {
			headline: "AI와 함께하는\n간편한 문서 작성",
			userLabel: "사용자",
			aiLabel: "Teeby AI",
			docLabel: "문서",
			bubbleUser: '"이 내용을 표로 정리해 줘"',
			bubbleAI: '"표로 정리했습니다 ✓"',
		},
		s03: {
			headline: "사용할수록 똑똑해지는",
			cards: [
				"프로젝트 기획서",
				"마케팅 전략",
				"아이디어 메모",
				"회의록",
				"리서치 노트",
				"할 일 관리",
			],
		},
		s04: {
			headline: "다양한 능력을 가진\nAI 에이전트",
			skills: [
				"웹 검색",
				"문서 작성",
				"파일 첨부",
				"음성 입력",
				"노트 검색",
				"이미지 인식",
			],
		},
		s05: {
			headline: "데이터는 완전 로컬 저장\n안심하고 사용하세요",
			badge1Title: "완전 로컬 저장",
			badge1Desc: "Mac에만 데이터 보관",
			badge2Title: "BYOK 방식",
			badge2Desc: "나만의 API 키로 안심 사용",
			badge3Title: "멀티 모델 지원",
			badge3Desc: "Gemini / Claude 선택 가능",
			check1: "외부 서버 업로드 없음",
			check2: "기밀 정보도 안심하고 취급 가능",
		},
	},
	"de-DE": {
		s01: { headline: "KI-Notizen,\neinfach für alle" },
		s02: {
			headline: "Dokumente mühelos\nmit KI erstellen",
			userLabel: "Sie",
			aiLabel: "Teeby AI",
			docLabel: "Dokument",
			bubbleUser: '"Fasse das in einer Tabelle zusammen"',
			bubbleAI: '"Hier ist die Tabelle ✓"',
		},
		s03: {
			headline: "Wird immer klüger,\nje mehr Sie es nutzen",
			cards: [
				"Projektplanung",
				"Marketingstrategie",
				"Ideennotizen",
				"Protokolle",
				"Recherche",
				"Aufgaben",
			],
		},
		s04: {
			headline: "Ein KI-Agent mit\nvielseitigen Fähigkeiten",
			skills: [
				"Websuche",
				"Dok-Erstellung",
				"Dateianhang",
				"Spracheingabe",
				"Notizensuche",
				"Bilderkennung",
			],
		},
		s05: {
			headline: "Ihre Daten bleiben\nlokal und sicher",
			badge1Title: "Lokale Speicherung",
			badge1Desc: "Daten nur auf Ihrem Mac",
			badge2Title: "BYOK-Modell",
			badge2Desc: "Eigene API-Schlüssel nutzen",
			badge3Title: "Multi-Modell",
			badge3Desc: "Gemini oder Claude wählen",
			check1: "Kein Upload auf externe Server",
			check2: "Vertrauliche Daten sicher verarbeiten",
		},
	},
	"es-ES": {
		s01: { headline: "Notas con IA,\nfáciles para todos" },
		s02: {
			headline: "Crea documentos\nsin esfuerzo con IA",
			userLabel: "Tú",
			aiLabel: "Teeby AI",
			docLabel: "Documento",
			bubbleUser: '"Resume esto en una tabla"',
			bubbleAI: '"Aquí tienes la tabla ✓"',
		},
		s03: {
			headline: "Se vuelve más inteligente\ncuanto más lo usas",
			cards: [
				"Plan de proyecto",
				"Estrategia marketing",
				"Ideas rápidas",
				"Actas reunión",
				"Investigación",
				"Gestión tareas",
			],
		},
		s04: {
			headline: "Un agente IA con\nhabilidades versátiles",
			skills: [
				"Búsqueda web",
				"Crear docs",
				"Adjuntar archivos",
				"Entrada de voz",
				"Buscar notas",
				"Reconocer imágenes",
			],
		},
		s05: {
			headline: "Tus datos se guardan\nlocalmente, seguros",
			badge1Title: "Almacenamiento local",
			badge1Desc: "Datos solo en tu Mac",
			badge2Title: "Modelo BYOK",
			badge2Desc: "Usa tus propias claves API",
			badge3Title: "Multi-modelo",
			badge3Desc: "Elige Gemini o Claude",
			check1: "Sin subidas a servidores externos",
			check2: "Maneja información confidencial con confianza",
		},
	},
	"fr-FR": {
		s01: { headline: "Notes IA, simples\npour tout le monde" },
		s02: {
			headline: "Créez des documents\nsans effort avec l'IA",
			userLabel: "Vous",
			aiLabel: "Teeby IA",
			docLabel: "Document",
			bubbleUser: '"Résume ça dans un tableau"',
			bubbleAI: '"Voici le tableau organisé ✓"',
		},
		s03: {
			headline: "Plus vous l'utilisez,\nplus il est intelligent",
			cards: [
				"Plan de projet",
				"Stratégie marketing",
				"Idées rapides",
				"Compte-rendu",
				"Notes recherche",
				"Gestion tâches",
			],
		},
		s04: {
			headline: "Un agent IA aux\ncompétences variées",
			skills: [
				"Recherche web",
				"Création docs",
				"Pièces jointes",
				"Saisie vocale",
				"Recherche notes",
				"Reconnaissance image",
			],
		},
		s05: {
			headline: "Vos données restent\nlocales et sécurisées",
			badge1Title: "Stockage local",
			badge1Desc: "Données sur votre Mac uniquement",
			badge2Title: "Modèle BYOK",
			badge2Desc: "Vos propres clés API",
			badge3Title: "Multi-modèle",
			badge3Desc: "Choisissez Gemini ou Claude",
			check1: "Aucun envoi vers des serveurs externes",
			check2: "Traitez vos données confidentielles en toute confiance",
		},
	},
	it: {
		s01: { headline: "Note con IA, semplici\nper tutti" },
		s02: {
			headline: "Crea documenti\nsenza sforzo con l'IA",
			userLabel: "Tu",
			aiLabel: "Teeby AI",
			docLabel: "Documento",
			bubbleUser: '"Riassumi questo in una tabella"',
			bubbleAI: '"Ecco la tabella organizzata ✓"',
		},
		s03: {
			headline: "Diventa più intelligente\npiù lo usi",
			cards: [
				"Piano progetto",
				"Strategia marketing",
				"Idee veloci",
				"Verbali riunioni",
				"Note ricerca",
				"Gestione attività",
			],
		},
		s04: {
			headline: "Un agente IA con\nabilità versatili",
			skills: [
				"Ricerca web",
				"Creazione doc",
				"Allega file",
				"Input vocale",
				"Cerca note",
				"Riconosc. immagini",
			],
		},
		s05: {
			headline: "I tuoi dati restano\nlocali e al sicuro",
			badge1Title: "Archiviazione locale",
			badge1Desc: "Dati solo sul tuo Mac",
			badge2Title: "Modello BYOK",
			badge2Desc: "Usa le tue chiavi API",
			badge3Title: "Multi-modello",
			badge3Desc: "Scegli Gemini o Claude",
			check1: "Nessun caricamento su server esterni",
			check2: "Gestisci informazioni riservate in sicurezza",
		},
	},
	ru: {
		s01: { headline: "ИИ-заметки, простые\nдля каждого" },
		s02: {
			headline: "Создавайте документы\nлегко с помощью ИИ",
			userLabel: "Вы",
			aiLabel: "Teeby AI",
			docLabel: "Документ",
			bubbleUser: '"Оформи это в виде таблицы"',
			bubbleAI: '"Вот готовая таблица ✓"',
		},
		s03: {
			headline: "Чем больше используете,\nтем умнее становится",
			cards: [
				"План проекта",
				"Маркетинг стратегия",
				"Быстрые идеи",
				"Протоколы",
				"Заметки исследований",
				"Управление задачами",
			],
		},
		s04: {
			headline: "ИИ-агент с\nразнообразными навыками",
			skills: [
				"Веб-поиск",
				"Создание документов",
				"Вложение файлов",
				"Голосовой ввод",
				"Поиск заметок",
				"Распознавание изображений",
			],
		},
		s05: {
			headline: "Ваши данные хранятся\nлокально и в безопасности",
			badge1Title: "Локальное хранение",
			badge1Desc: "Данные только на вашем Mac",
			badge2Title: "Модель BYOK",
			badge2Desc: "Свои API-ключи",
			badge3Title: "Мультимодельность",
			badge3Desc: "Gemini или Claude на выбор",
			check1: "Без загрузки на внешние серверы",
			check2: "Работайте с конфиденциальными данными уверенно",
		},
	},
	"pt-BR": {
		s01: { headline: "Notas com IA, simples\npara todos" },
		s02: {
			headline: "Crie documentos\nfacilmente com IA",
			userLabel: "Você",
			aiLabel: "Teeby AI",
			docLabel: "Documento",
			bubbleUser: '"Resuma isso em uma tabela"',
			bubbleAI: '"Aqui está a tabela ✓"',
		},
		s03: {
			headline: "Fica mais inteligente\nquanto mais você usa",
			cards: [
				"Plano de projeto",
				"Estratégia marketing",
				"Ideias rápidas",
				"Atas de reunião",
				"Notas de pesquisa",
				"Gestão de tarefas",
			],
		},
		s04: {
			headline: "Um agente IA com\nhabilidades versáteis",
			skills: [
				"Busca na web",
				"Criação de docs",
				"Anexar arquivos",
				"Entrada de voz",
				"Buscar notas",
				"Reconhecimento de imagem",
			],
		},
		s05: {
			headline: "Seus dados ficam\nlocais e seguros",
			badge1Title: "Armazenamento local",
			badge1Desc: "Dados apenas no seu Mac",
			badge2Title: "Modelo BYOK",
			badge2Desc: "Use suas próprias chaves API",
			badge3Title: "Multi-modelo",
			badge3Desc: "Escolha Gemini ou Claude",
			check1: "Sem upload para servidores externos",
			check2: "Lide com informações sigilosas com confiança",
		},
	},
	hi: {
		s01: { headline: "AI नोट्स, सबके लिए\nबिल्कुल आसान" },
		s02: {
			headline: "AI के साथ आसानी से\nदस्तावेज़ बनाएं",
			userLabel: "आप",
			aiLabel: "Teeby AI",
			docLabel: "दस्तावेज़",
			bubbleUser: '"इसे तालिका में बदलें"',
			bubbleAI: '"तालिका तैयार है ✓"',
		},
		s03: {
			headline: "जितना इस्तेमाल करें,\nउतना स्मार्ट बने",
			cards: [
				"प्रोजेक्ट योजना",
				"मार्केटिंग रणनीति",
				"त्वरित विचार",
				"बैठक नोट्स",
				"रिसर्च नोट्स",
				"कार्य प्रबंधन",
			],
		},
		s04: {
			headline: "विविध कौशल वाला\nAI एजेंट",
			skills: [
				"वेब खोज",
				"दस्तावेज़ निर्माण",
				"फ़ाइल अटैच",
				"वॉइस इनपुट",
				"नोट खोज",
				"इमेज पहचान",
			],
		},
		s05: {
			headline: "आपका डेटा पूरी तरह\nलोकल और सुरक्षित",
			badge1Title: "पूर्ण लोकल स्टोरेज",
			badge1Desc: "डेटा केवल आपके Mac पर",
			badge2Title: "BYOK मॉडल",
			badge2Desc: "अपनी API कुंजी का उपयोग करें",
			badge3Title: "मल्टी-मॉडल सपोर्ट",
			badge3Desc: "Gemini या Claude चुनें",
			check1: "बाहरी सर्वर पर कोई अपलोड नहीं",
			check2: "गोपनीय जानकारी को विश्वास से संभालें",
		},
	},
	"zh-Hans": {
		s01: { headline: "人人都能轻松使用的\nAI笔记" },
		s02: {
			headline: "与AI协作\n轻松创建文档",
			userLabel: "你",
			aiLabel: "Teeby AI",
			docLabel: "文档",
			bubbleUser: '"把这个整理成表格"',
			bubbleAI: '"表格已整理好 ✓"',
		},
		s03: {
			headline: "越用越聪明",
			cards: [
				"项目计划",
				"营销策略",
				"灵感速记",
				"会议纪要",
				"研究笔记",
				"任务管理",
			],
		},
		s04: {
			headline: "技能多样的AI助手",
			skills: [
				"网页搜索",
				"文档创建",
				"文件附件",
				"语音输入",
				"笔记搜索",
				"图像识别",
			],
		},
		s05: {
			headline: "数据完全本地存储\n安全又放心",
			badge1Title: "完全本地存储",
			badge1Desc: "数据仅保存在你的Mac上",
			badge2Title: "BYOK模式",
			badge2Desc: "使用你自己的API密钥",
			badge3Title: "多模型支持",
			badge3Desc: "可选Gemini或Claude",
			check1: "不会上传至外部服务器",
			check2: "放心处理机密信息",
		},
	},
};

// HTML template generators
function html01(t) {
	return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif;background:linear-gradient(160deg,#faf7f2 0%,#f0e8dd 40%,#e8ddd0 100%);display:flex;flex-direction:column;align-items:center}
.copy{margin-top:120px;text-align:center}
.copy h1{font-size:120px;font-weight:800;color:#1a1a1a;letter-spacing:.02em;line-height:1.3;white-space:pre-line}
.sc{margin-top:80px;width:2400px}
.sc img{width:100%;border-radius:24px;box-shadow:0 40px 80px rgba(0,0,0,.15),0 16px 32px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.05)}
</style></head><body>
<div class="copy"><h1>${t.headline}</h1></div>
<div class="sc"><img src="screenshot-hero.png"></div>
</body></html>`;
}

function html02(t) {
	return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif;background:linear-gradient(160deg,#4a3cb5 0%,#6c5ce7 30%,#a29bfe 70%,#7c6dd8 100%);display:flex;flex-direction:column;align-items:center;position:relative}
body::before{content:'';position:absolute;top:-200px;right:-200px;width:800px;height:800px;border-radius:50%;background:rgba(255,255,255,.05)}
.copy{margin-top:140px;text-align:center;z-index:1}
.copy h1{font-size:110px;font-weight:800;color:#fff;line-height:1.3;text-shadow:0 4px 20px rgba(0,0,0,.15);white-space:pre-line}
.ill{margin-top:100px;display:flex;align-items:center;justify-content:center;gap:100px;z-index:1}
.side{display:flex;flex-direction:column;align-items:center;gap:40px}
.icon-circle{width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(10px);border:3px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center}
.icon-circle svg{width:140px;height:140px;fill:#fff}
.icon-circle img{width:200px;height:200px;border-radius:36px}
.label{font-size:48px;font-weight:700;color:rgba(255,255,255,.9)}
.doc-flow{display:flex;flex-direction:column;align-items:center;gap:40px}
.arrows{display:flex;align-items:center;gap:60px}
.arrow{width:160px;height:6px;background:rgba(255,255,255,.5);position:relative}
.arrow::after{content:'';position:absolute;right:-4px;top:-12px;border:15px solid transparent;border-left:20px solid rgba(255,255,255,.5)}
.arrow.left::after{left:-4px;right:auto;border-left:none;border-right:20px solid rgba(255,255,255,.5)}
.doc{width:320px;height:400px;background:rgba(255,255,255,.15);backdrop-filter:blur(10px);border:3px solid rgba(255,255,255,.25);border-radius:24px;padding:40px;display:flex;flex-direction:column;gap:24px}
.dl{height:12px;border-radius:6px;background:rgba(255,255,255,.4)}
.doclbl{font-size:40px;font-weight:600;color:rgba(255,255,255,.8);text-align:center;margin-top:16px}
.chat{position:absolute;bottom:100px;display:flex;gap:60px;z-index:1}
.bubble{padding:32px 48px;border-radius:28px;font-size:36px;font-weight:500;max-width:700px}
.bubble.u{background:rgba(255,255,255,.25);color:#fff;border-bottom-left-radius:8px}
.bubble.a{background:rgba(255,255,255,.15);color:rgba(255,255,255,.9);border-bottom-right-radius:8px}
</style></head><body>
<div class="copy"><h1>${t.headline}</h1></div>
<div class="ill">
  <div class="side"><div class="icon-circle"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><div class="label">${t.userLabel}</div></div>
  <div class="doc-flow"><div class="arrows"><div class="arrow"></div><div class="arrow left"></div></div><div class="doc"><div class="dl" style="width:70%"></div><div class="dl"></div><div class="dl" style="width:85%"></div><div class="dl" style="width:90%"></div><div class="dl" style="width:60%"></div><div class="dl" style="width:95%"></div><div class="dl" style="width:75%"></div><div class="dl" style="width:80%"></div></div><div class="doclbl">${t.docLabel}</div></div>
  <div class="side"><div class="icon-circle"><img src="app-icon.png"></div><div class="label">${t.aiLabel}</div></div>
</div>
<div class="chat"><div class="bubble u">${t.bubbleUser}</div><div class="bubble a">${t.bubbleAI}</div></div>
</body></html>`;
}

function html03(t) {
	const cards = t.cards;
	const icons = ["📋", "📊", "💡", "📝", "📚", "🎯"];
	const positions = [
		"top:40px;left:80px;width:420px",
		"top:20px;right:80px;width:440px",
		"top:380px;left:40px;width:400px",
		"top:400px;right:40px;width:430px",
		"bottom:120px;left:300px;width:380px",
		"bottom:100px;right:280px;width:400px",
	];
	const lines = [
		'<line x1="380" y1="180" x2="1020" y2="520"/>',
		'<line x1="1820" y1="160" x2="1180" y2="520"/>',
		'<line x1="340" y1="540" x2="1020" y2="580"/>',
		'<line x1="1860" y1="560" x2="1180" y2="580"/>',
		'<line x1="580" y1="920" x2="1040" y2="680"/>',
		'<line x1="1620" y1="940" x2="1160" y2="680"/>',
	];
	const cardHtml = cards
		.map(
			(
				c,
				i,
			) => `<div style="position:absolute;${positions[i]};background:rgba(255,255,255,.18);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.25);border-radius:20px;padding:32px;z-index:1">
    <div style="font-size:32px;font-weight:700;color:#fff;margin-bottom:16px">${icons[i]} ${c}</div>
    <div style="display:flex;flex-direction:column;gap:10px"><div style="height:8px;border-radius:4px;background:rgba(255,255,255,.3);width:80%"></div><div style="height:8px;border-radius:4px;background:rgba(255,255,255,.3);width:100%"></div><div style="height:8px;border-radius:4px;background:rgba(255,255,255,.3);width:65%"></div></div></div>`,
		)
		.join("");

	return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif;background:linear-gradient(160deg,#0d9488 0%,#14b8a6 30%,#2dd4bf 60%,#5eead4 100%);display:flex;flex-direction:column;align-items:center}
.copy{margin-top:140px;text-align:center;z-index:2;position:relative}
.copy h1{font-size:120px;font-weight:800;color:#fff;line-height:1.3;text-shadow:0 4px 20px rgba(0,0,0,.15);white-space:pre-line}
.kg{position:relative;width:2200px;height:1200px;margin-top:60px;z-index:1}
.ci{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2}
.ci-inner{width:300px;height:300px;border-radius:68px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2),0 0 0 4px rgba(255,255,255,.3),0 0 80px rgba(255,255,255,.15)}
.ci-inner img{width:100%;height:100%}
svg.conn{position:absolute;top:0;left:0;width:100%;height:100%;z-index:0}
svg.conn line{stroke:rgba(255,255,255,.25);stroke-width:3;stroke-dasharray:12,8}
</style></head><body>
<div class="copy"><h1>${t.headline}</h1></div>
<div class="kg">
<svg class="conn" viewBox="0 0 2200 1200">${lines.join("")}</svg>
<div class="ci"><div class="ci-inner"><img src="app-icon.png"></div></div>
${cardHtml}
</div></body></html>`;
}

function html04(t) {
	const skills = t.skills;
	const svgIcons = [
		'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 3a8 8 0 0 1 0 16"/>',
		'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
		'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
		'<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
		'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 8h6M8 12h4"/>',
		'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>',
	];
	const colors = [
		"rgba(59,130,246,.25)",
		"rgba(236,72,153,.25)",
		"rgba(245,158,11,.25)",
		"rgba(16,185,129,.25)",
		"rgba(139,92,246,.25)",
		"rgba(244,63,94,.25)",
	];
	const positions = [
		"top:20px;left:50%;transform:translateX(-50%)",
		"top:200px;right:60px",
		"bottom:200px;right:100px",
		"bottom:80px;left:50%;transform:translateX(-50%)",
		"bottom:200px;left:100px",
		"top:200px;left:60px",
	];
	const skillHtml = skills
		.map(
			(
				s,
				i,
			) => `<div style="position:absolute;${positions[i]};display:flex;flex-direction:column;align-items:center;gap:20px;z-index:2">
    <div style="width:200px;height:200px;border-radius:50%;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.15);box-shadow:0 12px 40px rgba(0,0,0,.2);background:${colors[i]}">
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${svgIcons[i]}</svg>
    </div>
    <div style="font-size:36px;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap">${s}</div></div>`,
		)
		.join("");

	return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif;background:linear-gradient(160deg,#1a1040 0%,#2d1b69 30%,#3b2280 60%,#241454 100%);display:flex;flex-direction:column;align-items:center;position:relative}
body::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:radial-gradient(circle at 20% 80%,rgba(124,109,216,.15) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(162,155,254,.1) 0%,transparent 50%)}
.copy{margin-top:140px;text-align:center;z-index:2;position:relative}
.copy h1{font-size:110px;font-weight:800;color:#fff;line-height:1.3;text-shadow:0 4px 20px rgba(0,0,0,.3);white-space:pre-line}
.sk{position:relative;width:2000px;height:1200px;margin-top:60px;z-index:1}
.orb{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);border-radius:50%;border:2px solid rgba(255,255,255,.08)}
.orb1{width:900px;height:900px}.orb2{width:700px;height:700px;border-style:dashed;border-color:rgba(255,255,255,.06)}
.ct{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);z-index:2}
.ct-icon{width:320px;height:320px;border-radius:72px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3),0 0 0 4px rgba(255,255,255,.15),0 0 120px rgba(124,109,216,.3)}
.ct-icon img{width:100%;height:100%}
</style></head><body>
<div class="copy"><h1>${t.headline}</h1></div>
<div class="sk">
<div class="orb orb1"></div><div class="orb orb2"></div>
<div class="ct"><div class="ct-icon"><img src="app-icon.png"></div></div>
${skillHtml}
</div></body></html>`;
}

function html05(t) {
	return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans SC","Noto Sans KR","Noto Sans Devanagari",sans-serif;background:linear-gradient(160deg,#f5f0eb 0%,#e8e0d8 40%,#ddd4ca 100%);display:flex;flex-direction:column;align-items:center}
.copy{margin-top:140px;text-align:center;z-index:2;position:relative}
.copy h1{font-size:110px;font-weight:800;color:#2a2a2a;line-height:1.3;white-space:pre-line}
.shield-area{margin-top:80px;display:flex;flex-direction:column;align-items:center;z-index:1}
.shield{position:relative;width:500px;height:580px;display:flex;align-items:center;justify-content:center}
.shield svg{position:absolute;top:0;left:0;width:500px;height:580px}
.si{position:relative;z-index:1;width:240px;height:240px;border-radius:54px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.15)}
.si img{width:100%;height:100%}
.badges{margin-top:80px;display:flex;gap:48px;z-index:1}
.badge{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,.7);backdrop-filter:blur(10px);border:2px solid rgba(0,0,0,.06);border-radius:24px;padding:32px 48px;box-shadow:0 8px 24px rgba(0,0,0,.06)}
.bi{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.bi svg{width:40px;height:40px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.bi.l{background:#e0f2fe}.bi.l svg{stroke:#0284c7}
.bi.b{background:#fce7f3}.bi.b svg{stroke:#db2777}
.bi.m{background:#ede9fe}.bi.m svg{stroke:#7c3aed}
.bt{font-size:38px;font-weight:700;color:#2a2a2a}
.bd{font-size:28px;color:#666}
.checks{margin-top:60px;display:flex;gap:80px;z-index:1}
.chk{display:flex;align-items:center;gap:16px;font-size:36px;font-weight:600;color:#3a3a3a}
.cc{width:52px;height:52px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cc svg{width:28px;height:28px;stroke:white;stroke-width:3;fill:none}
</style></head><body>
<div class="copy"><h1>${t.headline}</h1></div>
<div class="shield-area"><div class="shield">
<svg viewBox="0 0 500 580" fill="none"><path d="M250 20 L470 120 L470 320 C470 450 370 540 250 570 C130 540 30 450 30 320 L30 120Z" fill="rgba(124,109,216,.08)" stroke="rgba(124,109,216,.25)" stroke-width="3"/><path d="M250 50 L440 140 L440 310 C440 425 350 510 250 540 C150 510 60 425 60 310 L60 140Z" fill="rgba(124,109,216,.04)" stroke="rgba(124,109,216,.12)" stroke-width="2"/></svg>
<div class="si"><img src="app-icon.png"></div>
</div></div>
<div class="badges">
<div class="badge"><div class="bi l"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div><div class="bt">${t.badge1Title}</div><div class="bd">${t.badge1Desc}</div></div></div>
<div class="badge"><div class="bi b"><svg viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg></div><div><div class="bt">${t.badge2Title}</div><div class="bd">${t.badge2Desc}</div></div></div>
<div class="badge"><div class="bi m"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div><div class="bt">${t.badge3Title}</div><div class="bd">${t.badge3Desc}</div></div></div>
</div>
<div class="checks">
<div class="chk"><div class="cc"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg></div>${t.check1}</div>
<div class="chk"><div class="cc"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg></div>${t.check2}</div>
</div></body></html>`;
}

const generators = [
	{ name: "01-hero", fn: (t) => html01(t.s01) },
	{ name: "02-collaboration", fn: (t) => html02(t.s02) },
	{ name: "03-smart", fn: (t) => html03(t.s03) },
	{ name: "04-skills", fn: (t) => html04(t.s04) },
	{ name: "05-privacy", fn: (t) => html05(t.s05) },
];

// Main
const fastlaneDir = join(ROOT, "fastlane", "screenshots");

let totalCount = 0;
for (const [langCode] of Object.entries(LANGUAGES)) {
	const t = TRANSLATIONS[langCode];
	const outDir = join(fastlaneDir, langCode);
	mkdirSync(outDir, { recursive: true });

	for (const gen of generators) {
		const htmlContent = gen.fn(t);
		const tmpHtml = join(__dirname, `_tmp_${gen.name}.html`);
		writeFileSync(tmpHtml, htmlContent);

		const outPng = join(outDir, `${gen.name}.png`);
		try {
			execSync(
				`npx playwright screenshot --viewport-size="${WIDTH},${HEIGHT}" "file://${tmpHtml}" "${outPng}"`,
				{ stdio: "pipe" },
			);
			totalCount++;
			console.log(`✅ [${langCode}] ${gen.name}.png`);
		} catch (e) {
			console.error(`❌ [${langCode}] ${gen.name}.png - ${e.message}`);
		}
	}
}

// Clean up temp files
for (const gen of generators) {
	try {
		const { unlinkSync } = await import("node:fs");
		unlinkSync(join(__dirname, `_tmp_${gen.name}.html`));
	} catch {}
}

console.log(`\n🎉 Done! Generated ${totalCount} screenshots in ${fastlaneDir}`);
