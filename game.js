/* =========================================================
   ВИЩА ЧИ НИЖЧА? — повна клієнтська версія
   Працює як звичайний сайт без сервера. Дані зберігаються
   у localStorage браузера.
========================================================= */

const STORAGE_KEYS = {
    settings: "higherLower.settings.v3",
    profile: "higherLower.profile.v3",
    savedGame: "higherLower.savedGame.v3"
};

const suits = [
    { symbol: "♥", color: "red" },
    { symbol: "♦", color: "red" },
    { symbol: "♣", color: "black" },
    { symbol: "♠", color: "black" }
];

const cardNames = {
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
    15: "JOKER"
};

const $ = id => document.getElementById(id);

const mainMenu = $("mainMenu");
const deckMenu = $("deckMenu");
const profileScreen = $("profileScreen");
const settingsScreen = $("settingsScreen");
const achievementsScreen = $("achievementsScreen");
const howToPlayScreen = $("howToPlayScreen");
const gameScreen = $("gameScreen");
const gameResultOverlay = $("gameResultOverlay");
const exitConfirmOverlay = $("exitConfirmOverlay");
const toast = $("toast");
const stacksElement = $("stacks");
const deckVisual = $("deckVisual");
const deckCount = $("deckCount");
const scoreElement = $("score");
const cardsLeftElement = $("cardsLeft");
const stacksLeftElement = $("stacksLeft");
const messageElement = $("message");
const lowerButton = $("lower");
const higherButton = $("higher");
const gameDifficultyIndicator = $("gameDifficultyIndicator");
const gameDifficultyValue = $("gameDifficultyValue");
const continueGameArea = $("continueGameArea");
const continueGameDescription = $("continueGameDescription");
const nicknameInput = $("nicknameInput");
const languageSelect = $("languageSelect");
const soundToggle = $("soundToggle");
const volumeSlider = $("volumeSlider");
const volumeValue = $("volumeValue");
const animationToggle = $("animationToggle");
const difficultyToggle = $("difficultyToggle");
const themeSelect = $("themeSelect");
const cardBackSelect = $("cardBackSelect");

let deck = [];
let stacks = [];
let selectedStack = null;
let currentDeckSize = 36;
let gameOver = false;
let waitingForAnimation = false;
let currentGameRecorded = false;
let isRestoringGame = false;
let toastTimer = null;
let audioContext = null;

let currentGameStats = {
    correctMoves: 0,
    wrongMoves: 0,
    lostStacks: 0
};

const defaultSettings = {
    sound: true,
    volume: 0.6,
    animations: true,
    difficultyIndicator: true,
    language: "uk",
    theme: "classic",
    cardBack: "embroidered"
};

const defaultProfile = {
    nickname: "Гравець",
    stats: {
        36: { games: 0, totalScore: 0, best: 0 },
        54: { games: 0, totalScore: 0, best: 0 }
    },
    totalCardsUsed: 0,
    correctMoves: 0,
    wrongMoves: 0,
    lostStacks: 0,
    achievements: {}
};

const translations = {
    uk: {
        mainTitle: "ВИЩА ЧИ НИЖЧА?",
        mainSubtitle: "Карткова гра",
        continueGameTitle: "ЗБЕРЕЖЕНА ГРА",
        continueGameButton: "▶ ПРОДОВЖИТИ",
        playButton: "ГРАТИ",
        howToPlayButton: "ЯК ГРАТИ",
        profileButton: "ПРОФІЛЬ",
        settingsButton: "НАЛАШТУВАННЯ",
        logoutButton: "ВИЙТИ",
        deckMenuTitle: "ОБЕРИ КОЛОДУ",
        deckMenuDescription: "З якою колодою хочеш грати?",
        deck36Title: "36 КАРТ",
        deck36Description: "Від 6 до Т",
        deck54Title: "54 КАРТИ",
        deck54Description: "Від 2 до JOKER",
        back: "← НАЗАД",
        profileTitle: "ПРОФІЛЬ",
        nicknameLabel: "Нікнейм",
        nicknamePlaceholder: "Введи нікнейм",
        save: "ЗБЕРЕГТИ",
        statisticsTitle: "СТАТИСТИКА",
        games: "Ігор:",
        average: "Середній результат:",
        best: "Найкращий результат:",
        overallStatisticsTitle: "ЗАГАЛЬНА СТАТИСТИКА",
        totalCardsLabel: "Використано карт",
        correctMovesLabel: "Правильні ходи",
        wrongMovesLabel: "Неправильні ходи",
        lostStacksLabel: "Втрачені стопки",
        achievementsPreviewTitle: "ДОСЯГНЕННЯ",
        achievementsButton: "🏆 ДОСЯГНЕННЯ",
        achievementsTitle: "ДОСЯГНЕННЯ",
        howToPlayTitle: "ЯК ГРАТИ",
        settingsTitle: "НАЛАШТУВАННЯ",
        languageTitle: "Мова",
        languageDescription: "Мова інтерфейсу",
        soundTitle: "Звук",
        soundDescription: "Звукові ефекти гри",
        volumeTitle: "Гучність",
        volumeDescription: "Гучність звукових ефектів",
        animationTitle: "Анімації",
        animationDescription: "Анімації карт",
        difficultyIndicatorTitle: "Індикатор складності",
        difficultyIndicatorDescription: "Показувати складність колоди",
        themeTitle: "Тема",
        themeDescription: "Візуальний стиль гри",
        cardBackTitle: "Сорочка карт",
        cardBackDescription: "Стиль зворотної сторони карт",
        gameTitle: "🃏 Вища чи нижча?",
        menu: "← Меню",
        difficulty: "Складність",
        score: "Очки:",
        cardsLeft: "Карт залишилось:",
        stacksLeft: "Стопок залишилось:",
        chooseStack: "Вибери одну зі стопок.",
        preparing: "Готуємо колоду…",
        selectedStack: "Обрано стопку",
        onlyHigher: "Можна прогнозувати тільки «Більше». ",
        onlyLower: "Можна прогнозувати тільки «Менше». ",
        choosePrediction: "Обери «Менше» або «Більше».",
        correct: "Правильно!",
        wrong: "Неправильно!",
        cardAppeared: "Випала карта",
        stackLost: "Стопку втрачено.",
        allStacksLost: "Усі стопки втрачено.",
        deckFinished: "Колода закінчилася!",
        gameFinished: "Гру завершено.",
        result: "Результат:",
        cards: "карт",
        resultTitle: "ГРУ ЗАВЕРШЕНО",
        resultScoreLabel: "Твій результат",
        resultCardsLabel: "Використано карт",
        resultLostStacksLabel: "Втрачені стопки",
        resultRemainingCardsLabel: "Карт у колоді",
        resultCorrectMovesLabel: "Правильні ходи",
        resultWrongMovesLabel: "Неправильні ходи",
        nextGame: "🔄 Наступна гра",
        changeDeck: "🎴 Змінити колоду",
        lobby: "🏠 До лобі",
        exitConfirmTitle: "ВИЙТИ З ГРИ?",
        exitConfirmText: "Незавершена партія буде збережена. Ти зможеш продовжити її пізніше.",
        exit: "ВИЙТИ",
        cancel: "СКАСУВАТИ",
        noSavedGame: "Збереженої гри немає.",
        normal: "Звичайна",
        hard: "Складна",
        locked: "Заблоковано",
        unlocked: "Відкрито",
        rule1Title: "Обери стопку",
        rule1Text: "На столі є шість активних стопок. Обери одну, щоб зробити хід.",
        rule2Title: "Передбач карту",
        rule2Text: "Вгадай, чи наступна карта буде більшою або меншою за поточну.",
        rule3Title: "Правильний хід",
        rule3Text: "Якщо прогноз правильний, карта залишається у стопці, і ти можеш продовжувати.",
        rule4Title: "Неправильний хід",
        rule4Text: "Якщо прогноз неправильний, поточна стопка втрачається.",
        rule5Title: "Кінець гри",
        rule5Text: "Гра завершується, коли колода закінчується або всі шість стопок втрачені.",
        rule6Title: "Joker",
        rule6Text: "Joker має найвище значення. Після нього можна прогнозувати тільки «Менше». ",
        languageName: "Українська",
        themeClassic: "Класична",
        themeMidnight: "Північ",
        themeRoyal: "Королівська",
        themeCrimson: "Багряна",
        backEmbroidered: "Вишивка",
        backDiamond: "Ромби",
        backMinimal: "Мінімалістична",
        backRoyal: "Королівська",
        toastSaved: "Збережено.",
        toastNickname: "Нікнейм збережено.",
        toastExit: "Гру збережено.",
        logoutMessage: "Ти вийшов до головного меню. Дані профілю збережено."
    },
    en: {
        mainTitle: "HIGHER OR LOWER?",
        mainSubtitle: "Card game",
        continueGameTitle: "SAVED GAME",
        continueGameButton: "▶ CONTINUE",
        playButton: "PLAY",
        howToPlayButton: "HOW TO PLAY",
        profileButton: "PROFILE",
        settingsButton: "SETTINGS",
        logoutButton: "EXIT",
        deckMenuTitle: "CHOOSE A DECK",
        deckMenuDescription: "Which deck do you want to play with?",
        deck36Title: "36 CARDS",
        deck36Description: "6 through A",
        deck54Title: "54 CARDS",
        deck54Description: "2 through JOKER",
        back: "← BACK",
        profileTitle: "PROFILE",
        nicknameLabel: "Nickname",
        nicknamePlaceholder: "Enter nickname",
        save: "SAVE",
        statisticsTitle: "STATISTICS",
        games: "Games:",
        average: "Average score:",
        best: "Best score:",
        overallStatisticsTitle: "OVERALL STATISTICS",
        totalCardsLabel: "Cards used",
        correctMovesLabel: "Correct moves",
        wrongMovesLabel: "Wrong moves",
        lostStacksLabel: "Lost stacks",
        achievementsPreviewTitle: "ACHIEVEMENTS",
        achievementsButton: "🏆 ACHIEVEMENTS",
        achievementsTitle: "ACHIEVEMENTS",
        howToPlayTitle: "HOW TO PLAY",
        settingsTitle: "SETTINGS",
        languageTitle: "Language",
        languageDescription: "Interface language",
        soundTitle: "Sound",
        soundDescription: "Game sound effects",
        volumeTitle: "Volume",
        volumeDescription: "Sound effect volume",
        animationTitle: "Animations",
        animationDescription: "Card animations",
        difficultyIndicatorTitle: "Difficulty indicator",
        difficultyIndicatorDescription: "Show deck difficulty",
        themeTitle: "Theme",
        themeDescription: "Visual game style",
        cardBackTitle: "Card back",
        cardBackDescription: "Card back design",
        gameTitle: "🃏 Higher or Lower?",
        menu: "← Menu",
        difficulty: "Difficulty",
        score: "Score:",
        cardsLeft: "Cards left:",
        stacksLeft: "Stacks left:",
        chooseStack: "Choose a stack.",
        preparing: "Preparing the deck…",
        selectedStack: "Selected stack",
        onlyHigher: "Only “Higher” can be predicted.",
        onlyLower: "Only “Lower” can be predicted.",
        choosePrediction: "Choose “Lower” or “Higher”.",
        correct: "Correct!",
        wrong: "Wrong!",
        cardAppeared: "The card was",
        stackLost: "The stack was lost.",
        allStacksLost: "All stacks were lost.",
        deckFinished: "The deck is empty!",
        gameFinished: "Game finished.",
        result: "Result:",
        cards: "cards",
        resultTitle: "GAME OVER",
        resultScoreLabel: "Your score",
        resultCardsLabel: "Cards used",
        resultLostStacksLabel: "Lost stacks",
        resultRemainingCardsLabel: "Cards remaining",
        resultCorrectMovesLabel: "Correct moves",
        resultWrongMovesLabel: "Wrong moves",
        nextGame: "🔄 Next game",
        changeDeck: "🎴 Change deck",
        lobby: "🏠 Lobby",
        exitConfirmTitle: "EXIT GAME?",
        exitConfirmText: "The unfinished game will be saved. You can continue it later.",
        exit: "EXIT",
        cancel: "CANCEL",
        noSavedGame: "There is no saved game.",
        normal: "Normal",
        hard: "Hard",
        locked: "Locked",
        unlocked: "Unlocked",
        rule1Title: "Choose a stack",
        rule1Text: "There are six active stacks on the table. Choose one to make a move.",
        rule2Title: "Predict the card",
        rule2Text: "Guess whether the next card will be higher or lower than the current one.",
        rule3Title: "Correct move",
        rule3Text: "If your prediction is correct, the card stays in the stack and you can continue.",
        rule4Title: "Wrong move",
        rule4Text: "If your prediction is wrong, the current stack is lost.",
        rule5Title: "End of the game",
        rule5Text: "The game ends when the deck is empty or all six stacks are lost.",
        rule6Title: "Joker",
        rule6Text: "The Joker has the highest value. After it, only “Lower” is possible.",
        languageName: "English",
        themeClassic: "Classic",
        themeMidnight: "Midnight",
        themeRoyal: "Royal",
        themeCrimson: "Crimson",
        backEmbroidered: "Embroidered",
        backDiamond: "Diamond",
        backMinimal: "Minimal",
        backRoyal: "Royal",
        toastSaved: "Saved.",
        toastNickname: "Nickname saved.",
        toastExit: "Game saved.",
        logoutMessage: "You returned to the main menu. Profile data is kept."
    }
};

const achievements = [
    { id: "firstGame", icon: "🎮", name: {uk:"Перший крок", en:"First step"}, desc: {uk:"Заверши першу гру.", en:"Finish your first game."}, goal: 1, metric: p => p.stats[36].games + p.stats[54].games },
    { id: "cards50", icon: "🃏", name: {uk:"50 карт", en:"50 cards"}, desc: {uk:"Використай 50 карт.", en:"Use 50 cards."}, goal: 50, metric: p => p.totalCardsUsed },
    { id: "correct25", icon: "🎯", name: {uk:"Точний прогноз", en:"Accurate"}, desc: {uk:"Зроби 25 правильних ходів.", en:"Make 25 correct moves."}, goal: 25, metric: p => p.correctMoves },
    { id: "correct100", icon: "💯", name: {uk:"Сотня", en:"One hundred"}, desc: {uk:"Зроби 100 правильних ходів.", en:"Make 100 correct moves."}, goal: 100, metric: p => p.correctMoves },
    { id: "survivor", icon: "🛡️", name: {uk:"Вцілілий", en:"Survivor"}, desc: {uk:"Набери 30+ карт в одній грі.", en:"Score 30+ cards in one game."}, goal: 30, metric: p => Math.max(p.stats[36].best, p.stats[54].best) }
];

function t(key) {
    const lang = getSettingsData().language || "uk";
    return translations[lang]?.[key] ?? translations.uk[key] ?? key;
}

function getSettingsData() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "null");
        return { ...defaultSettings, ...(saved && typeof saved === "object" ? saved : {}) };
    } catch {
        return { ...defaultSettings };
    }
}

function saveSettingsData(settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ ...defaultSettings, ...settings }));
}

function getProfileData() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || "null");
        const p = saved && typeof saved === "object" ? saved : {};
        return {
            ...structuredClone(defaultProfile),
            ...p,
            stats: {
                36: { ...defaultProfile.stats[36], ...(p.stats?.[36] || {}) },
                54: { ...defaultProfile.stats[54], ...(p.stats?.[54] || {}) }
            },
            achievements: { ...(p.achievements || {}) }
        };
    } catch {
        return structuredClone(defaultProfile);
    }
}

function saveProfileData(profile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function getCurrentLanguage() {
    return getSettingsData().language || "uk";
}

function applyTheme(theme) {
    document.body.classList.remove("theme-midnight", "theme-royal", "theme-crimson");
    if (theme && theme !== "classic") document.body.classList.add(`theme-${theme}`);
}

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function applyLanguage() {
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;

    const textMap = {
        mainTitle:"mainTitle", mainSubtitle:"mainSubtitle", continueGameTitle:"continueGameTitle", continueGameButton:"continueGameButton",
        playButton:"playButton", howToPlayButton:"howToPlayButton", profileButton:"profileButton", settingsButton:"settingsButton", logoutButton:"logoutButton",
        deckMenuTitle:"deckMenuTitle", deckMenuDescription:"deckMenuDescription", deck36Title:"deck36Title", deck36Description:"deck36Description", deck54Title:"deck54Title", deck54Description:"deck54Description",
        profileTitle:"profileTitle", nicknameLabel:"nicknameLabel", save:"saveNicknameButton", statisticsTitle:"statisticsTitle", overallStatisticsTitle:"overallStatisticsTitle",
        totalCardsLabel:"totalCardsLabel", correctMovesLabel:"correctMovesLabel", wrongMovesLabel:"wrongMovesLabel", lostStacksLabel:"lostStacksLabel", achievementsPreviewTitle:"achievementsPreviewTitle",
        achievementsTitle:"achievementsTitle", howToPlayTitle:"howToPlayTitle", settingsTitle:"settingsTitle", languageTitle:"languageTitle", languageDescription:"languageDescription",
        soundTitle:"soundTitle", soundDescription:"soundDescription", volumeTitle:"volumeTitle", volumeDescription:"volumeDescription", animationTitle:"animationTitle", animationDescription:"animationDescription",
        difficultyIndicatorTitle:"difficultyIndicatorTitle", difficultyIndicatorDescription:"difficultyIndicatorDescription", themeTitle:"themeTitle", themeDescription:"themeDescription", cardBackTitle:"cardBackTitle", cardBackDescription:"cardBackDescription",
        gameTitle:"gameTitle", menu:"backFromGameButton", difficulty:"gameDifficultyLabel", score:"scoreLabel", cardsLeft:"cardsLeftLabel", stacksLeft:"stacksLeftLabel",
        resultTitle:"gameResultTitle", resultScoreLabel:"resultScoreLabel", resultCardsLabel:"resultCardsLabel", resultLostStacksLabel:"resultLostStacksLabel", resultRemainingCardsLabel:"resultRemainingCardsLabel",
        resultCorrectMovesLabel:"resultCorrectMovesLabel", resultWrongMovesLabel:"resultWrongMovesLabel", nextGame:"nextGameButton", changeDeck:"changeDeckButton", lobby:"resultLobbyButton",
        exitConfirmTitle:"exitConfirmTitle", exitConfirmText:"exitConfirmText", exit:"confirmExitButton", cancel:"cancelExitButton",
        rule1Title:"rule1Title", rule1Text:"rule1Text", rule2Title:"rule2Title", rule2Text:"rule2Text", rule3Title:"rule3Title", rule3Text:"rule3Text", rule4Title:"rule4Title", rule4Text:"rule4Text", rule5Title:"rule5Title", rule5Text:"rule5Text", rule6Title:"rule6Title", rule6Text:"rule6Text"
    };
    Object.entries(textMap).forEach(([key,id]) => setText(id,t(key)));

    ["backToMenuButton","backFromProfileButton","backFromAchievementsButton","backFromHowToPlayButton","backFromSettingsButton"].forEach(id => setText(id,t("back")));
    setText("openAchievementsButton", t("achievementsButton"));
    setText("gamesLabel36",t("games")); setText("gamesLabel54",t("games"));
    setText("averageLabel36",t("average")); setText("averageLabel54",t("average"));
    setText("bestLabel36",t("best")); setText("bestLabel54",t("best"));
    setText("statistics36Title",t("deck36Title")); setText("statistics54Title",t("deck54Title"));
    if (nicknameInput) nicknameInput.placeholder = t("nicknamePlaceholder");

    setText("deck36Difficulty", `${t("difficulty")}: ${t("normal")}`);
    setText("deck54Difficulty", `${t("difficulty")}: ${t("hard")}`);

    const themeLabels = { classic:t("themeClassic"), midnight:t("themeMidnight"), royal:t("themeRoyal"), crimson:t("themeCrimson") };
    [...themeSelect.options].forEach(o => { if (themeLabels[o.value]) o.textContent = themeLabels[o.value]; });
    const backLabels = { embroidered:t("backEmbroidered"), diamond:t("backDiamond"), minimal:t("backMinimal"), royal:t("backRoyal") };
    [...cardBackSelect.options].forEach(o => { if (backLabels[o.value]) o.textContent = backLabels[o.value]; });
    languageSelect.options[0].textContent = translations.uk.languageName;
    languageSelect.options[1].textContent = translations.en.languageName;

    updateVolumeLabel();
    updateDifficultyDisplay();
}

function loadSettings() {
    const s = getSettingsData();
    languageSelect.value = s.language;
    soundToggle.checked = !!s.sound;
    volumeSlider.value = Math.round((Number(s.volume) || 0) * 100);
    animationToggle.checked = !!s.animations;
    difficultyToggle.checked = !!s.difficultyIndicator;
    themeSelect.value = s.theme;
    cardBackSelect.value = s.cardBack;
    applyTheme(s.theme);
    updateVolumeLabel();
}

function updateVolumeLabel() {
    if (volumeValue) volumeValue.textContent = `${Number(volumeSlider.value)}%`;
}

function saveCurrentSettings() {
    const settings = {
        sound: soundToggle.checked,
        volume: Number(volumeSlider.value) / 100,
        animations: animationToggle.checked,
        difficultyIndicator: difficultyToggle.checked,
        language: languageSelect.value,
        theme: themeSelect.value,
        cardBack: cardBackSelect.value
    };
    saveSettingsData(settings);
    applyTheme(settings.theme);
    applyLanguage();
    if (gameScreen && !gameScreen.classList.contains("hidden")) updateInterface();
}

function createDeck(size) {
    const newDeck = [];
    const minimum = size === 36 ? 6 : 2;
    for (let value = minimum; value <= 14; value++) {
        for (const suit of suits) newDeck.push({ value, symbol:suit.symbol, color:suit.color });
    }
    if (size === 54) {
        newDeck.push({ value:15, symbol:"🃏", color:"red", joker:true });
        newDeck.push({ value:15, symbol:"🃏", color:"black", joker:true });
    }
    return newDeck;
}

function shuffle(array) {
    for (let i=array.length-1;i>0;i--) {
        const randomIndex = Math.floor(Math.random()*(i+1));
        [array[i],array[randomIndex]]=[array[randomIndex],array[i]];
    }
    return array;
}

function getCardName(card) {
    if (card?.joker) return "JOKER";
    if (!card) return "";
    return card.value <= 10 ? String(card.value) : cardNames[card.value];
}

function createSuitSymbols(card) {
    const container = document.createElement("div");
    container.className = "card-symbols";
    if (card.value === 14) {
        const ace = document.createElement("div"); ace.className="big-suit"; ace.textContent=card.symbol; container.appendChild(ace); return container;
    }
    if ([11,12,13].includes(card.value)) {
        const faceCard=document.createElement("div"); faceCard.className=`face-card face-${getCardName(card).toLowerCase()}`;
        const crown=document.createElement("div"); crown.className="face-crown"; crown.textContent=card.value===13?"♛":card.value===12?"♕":"♞";
        const head=document.createElement("div"); head.className="face-head";
        const face=document.createElement("div"); face.className="face-head-inner"; face.textContent=card.value===11?"J":card.value===12?"Q":"K";
        const body=document.createElement("div"); body.className="face-body"; body.textContent=card.symbol;
        const letter=document.createElement("div"); letter.className="face-letter"; letter.textContent=getCardName(card);
        const suit=document.createElement("div"); suit.className="face-suit"; suit.textContent=card.symbol;
        head.appendChild(face); faceCard.append(crown,head,body,letter,suit); container.appendChild(faceCard); return container;
    }
    const layouts={
        2:[[1,2,false],[6,2,true]],
        3:[[1,2,false],[3,2,false],[6,2,true]],
        4:[[1,1,false],[1,3,false],[6,1,true],[6,3,true]],
        5:[[1,1,false],[1,3,false],[3,2,false],[6,1,true],[6,3,true]],
        6:[[1,1,false],[1,3,false],[3,1,false],[3,3,false],[6,1,true],[6,3,true]],
        7:[[1,1,false],[1,3,false],[2,2,false],[3,1,false],[3,3,false],[6,1,true],[6,3,true]],
        8:[[1,1,false],[1,3,false],[2,2,false],[3,1,false],[3,3,false],[5,1,true],[5,3,true],[6,2,true]],
        9:[[1,1,false],[1,3,false],[2,1,false],[2,3,false],[3,2,false],[4,1,true],[4,3,true],[5,1,true],[5,3,true]],
        10:[[1,1,false],[1,3,false],[2,2,false],[3,1,false],[3,3,false],[4,1,true],[4,3,true],[5,2,true],[6,1,true],[6,3,true]]
    };
    (layouts[card.value]||[]).forEach(position=>{
        const pip=document.createElement("span"); pip.className="pip"; pip.textContent=card.symbol; pip.style.gridRow=position[0]; pip.style.gridColumn=position[1]; if(position[2]) pip.classList.add("rotated"); container.appendChild(pip);
    });
    return container;
}

function createCardBackElement() {
    const back=document.createElement("div");
    const backStyle=getSettingsData().cardBack||"embroidered";
    back.className=`card-face card-back back-${backStyle}`;
    if(backStyle==="diamond") back.innerHTML='<div class="diamond-pattern"><span>◆</span></div>';
    else if(backStyle==="minimal") back.innerHTML='<div class="minimal-pattern">✦</div>';
    else if(backStyle==="royal") back.innerHTML='<div class="royal-pattern">♛</div>';
    else back.innerHTML='<div class="embroidered-pattern"><div class="pattern-line">◆ ◆ ◆ ◆ ◆</div><div class="pattern-center">✦</div><div class="pattern-line">◆ ◆ ◆ ◆ ◆</div></div>';
    return back;
}

function createCardElement(card, faceUp=true, animate=false) {
    const cardElement=document.createElement("div"); cardElement.className=`card ${card.color} flip-card`;
    const inner=document.createElement("div"); inner.className="card-inner";
    const back=createCardBackElement(); const front=document.createElement("div"); front.className=`card-face card-front ${card.color}`;
    if(card.joker) front.innerHTML='<div class="joker-card">🃏<span>JOKER</span></div>';
    else {
        const topCorner=document.createElement("div"); topCorner.className="card-corner top-corner"; topCorner.innerHTML=`<span>${getCardName(card)}</span><span class="corner-suit">${card.symbol}</span>`;
        const center=createSuitSymbols(card);
        const bottomCorner=document.createElement("div"); bottomCorner.className="card-corner bottom-corner"; bottomCorner.innerHTML=`<span>${getCardName(card)}</span><span class="corner-suit">${card.symbol}</span>`;
        front.append(topCorner,center,bottomCorner);
    }
    inner.append(back,front); cardElement.appendChild(inner);
    if(faceUp) cardElement.classList.add("flipped");
    if(animate && getSettingsData().animations) {
        requestAnimationFrame(()=>requestAnimationFrame(()=>cardElement.classList.add("flipped")));
    }
    return cardElement;
}

function updateDeckVisual() {
    deckVisual.innerHTML="";
    if(deck.length===0){ deckCount.textContent="0"; deckVisual.classList.add("empty"); return; }
    deckVisual.classList.remove("empty");
    const cardsToShow=Math.min(deck.length,5);
    for(let i=0;i<cardsToShow;i++){
        const backCard=createCardElement(deck[deck.length-1],false,false); backCard.classList.add("deck-card"); backCard.style.transform=`translate(${i*2}px, ${i*-2}px)`; deckVisual.appendChild(backCard);
    }
    deckCount.textContent=deck.length;
}

function hideGameResult(){ gameResultOverlay.classList.add("hidden"); }

function showGameResult(reason){
    const finalScore=currentDeckSize-deck.length;
    const activeStacks=stacks.filter(stack=>stack.active).length;
    const lostStacks=stacks.length-activeStacks;
    setText("gameResultTitle",t("resultTitle")); setText("gameResultReason",reason); setText("resultScore",`${finalScore} / ${currentDeckSize}`); setText("resultCards",finalScore); setText("resultLostStacks",lostStacks); setText("resultRemainingCards",deck.length); setText("resultCorrectMoves",currentGameStats.correctMoves); setText("resultWrongMoves",currentGameStats.wrongMoves);
    gameResultOverlay.classList.remove("hidden");
}

function calculateDifficulty(size){ return size===36?{key:"normal",label:t("normal")}:{key:"hard",label:t("hard")}; }
function updateDifficultyDisplay(){
    const settings=getSettingsData();
    setText("deck36Difficulty",`${t("difficulty")}: ${calculateDifficulty(36).label}`);
    setText("deck54Difficulty",`${t("difficulty")}: ${calculateDifficulty(54).label}`);
    setText("gameDifficultyValue",calculateDifficulty(currentDeckSize).label);
    gameDifficultyIndicator.classList.toggle("hidden",!settings.difficultyIndicator);
}

function startGame(size=null){
    hideGameResult(); closeExitConfirmation();
    if(size!==null) currentDeckSize=Number(size);
    currentGameRecorded=false; currentGameStats={correctMoves:0,wrongMoves:0,lostStacks:0}; isRestoringGame=false;
    deck=shuffle(createDeck(currentDeckSize)); stacks=[]; selectedStack=null; gameOver=false; waitingForAnimation=true;
    for(let i=0;i<6;i++) stacks.push({cards:[deck.pop()],active:true,animate:true,closing:false});
    messageElement.textContent=t("preparing"); updateInterface(); lowerButton.disabled=true; higherButton.disabled=true; saveCurrentGame();
    setTimeout(()=>{if(gameOver)return; waitingForAnimation=false; messageElement.textContent=t("chooseStack"); updateInterface(); saveCurrentGame();},getSettingsData().animations?900:0);
}

function updateInterface(){
    const cardsUsed=currentDeckSize-deck.length; scoreElement.textContent=cardsUsed; cardsLeftElement.textContent=deck.length; stacksLeftElement.textContent=stacks.filter(s=>s.active).length; stacksElement.innerHTML="";
    stacks.forEach((stack,index)=>{
        const stackElement=document.createElement("div"); stackElement.className="stack";
        if(index===selectedStack) stackElement.classList.add("selected");
        if(!stack.active&&!stack.closing) stackElement.classList.add("lost");
        if(stack.cards.length>0){
            const currentCard=stack.cards[stack.cards.length-1]; const faceUp=stack.active||stack.closing; const cardElement=createCardElement(currentCard,faceUp,stack.animate===true);
            if(stack.closing) cardElement.classList.add("closing"); stack.animate=false; stackElement.appendChild(cardElement);
        }
        if(stack.active&&!gameOver&&!waitingForAnimation) stackElement.addEventListener("click",()=>selectStack(index));
        stacksElement.appendChild(stackElement);
    });
    updateDeckVisual(); updateButtons(); updateDifficultyDisplay();
}

function selectStack(index){
    if(gameOver||waitingForAnimation||!stacks[index]||!stacks[index].active) return;
    selectedStack=index; playStackSelectSound();
    const currentCard=stacks[index].cards.at(-1);
    if(currentCard.joker) messageElement.textContent=`${t("selectedStack")} ${index+1}: JOKER. ${t("onlyLower")}`;
    else {
        const name=getCardName(currentCard); const minimum=currentDeckSize===36?6:2;
        if(currentCard.value===minimum) messageElement.textContent=`${t("selectedStack")} ${index+1}: ${name} ${currentCard.symbol}. ${t("onlyHigher")}`;
        else if(currentDeckSize===36&&currentCard.value===14) messageElement.textContent=`${t("selectedStack")} ${index+1}: ${name} ${currentCard.symbol}. ${t("onlyLower")}`;
        else messageElement.textContent=`${t("selectedStack")} ${index+1}: ${name} ${currentCard.symbol}. ${t("choosePrediction")}`;
    }
    updateInterface();
}

function updateButtons(){
    lowerButton.disabled=true; higherButton.disabled=true;
    if(selectedStack===null||gameOver||waitingForAnimation) return;
    const stack=stacks[selectedStack]; if(!stack?.active) return;
    const currentCard=stack.cards.at(-1); const minimum=currentDeckSize===36?6:2;
    if(currentCard.value===minimum){higherButton.disabled=false;return;}
    if(currentCard.value===15){lowerButton.disabled=false;return;}
    if(currentDeckSize===36&&currentCard.value===14){lowerButton.disabled=false;return;}
    lowerButton.disabled=false; higherButton.disabled=false;
}

function animateCardFromDeck(card,stackIndex,callback){
    const stackElement=stacksElement.children[stackIndex]; if(!stackElement){callback();return;}
    const settings=getSettingsData(); if(!settings.animations){callback();return;}
    const cardElement=createCardElement(card,false,false); cardElement.classList.add("moving-card"); document.body.appendChild(cardElement); playCardMoveSound();
    const deckRect=deckVisual.getBoundingClientRect(); const stackRect=stackElement.getBoundingClientRect(); const cardWidth=cardElement.getBoundingClientRect().width; const cardHeight=cardElement.getBoundingClientRect().height;
    cardElement.style.left=`${deckRect.left+deckRect.width/2-cardWidth/2}px`; cardElement.style.top=`${deckRect.top+deckRect.height/2-cardHeight/2}px`;
    requestAnimationFrame(()=>{cardElement.style.left=`${stackRect.left+stackRect.width/2-cardWidth/2}px`;cardElement.style.top=`${stackRect.top+32}px`;});
    setTimeout(()=>{cardElement.remove();callback();},700);
}

function playPrediction(prediction){
    if(selectedStack===null||gameOver||waitingForAnimation) return;
    const stackIndex=selectedStack; const stack=stacks[stackIndex]; if(!stack?.active)return;
    if(deck.length===0){finishGame(t("deckFinished"));return;}
    waitingForAnimation=true;
    const currentCard=stack.cards.at(-1); const nextCard=deck.pop();
    let correct=prediction==="higher"?nextCard.value>currentCard.value:nextCard.value<currentCard.value;
    if(nextCard.value===currentCard.value) correct=false;
    const nextCardName=getCardName(nextCard);
    messageElement.textContent=`${correct?"✅ "+t("correct"):"❌ "+t("wrong")} ${t("cardAppeared")} ${nextCardName}${nextCard.joker?"":" "+nextCard.symbol}.`;
    updateInterface();
    animateCardFromDeck(nextCard,stackIndex,()=>{
        stack.cards.push(nextCard);
        if(correct){
            currentGameStats.correctMoves++; playCorrectSound(); stack.animate=true; updateInterface(); saveCurrentGame();
            setTimeout(()=>{waitingForAnimation=false;checkGameEnd();if(!gameOver){updateInterface();saveCurrentGame();}},getSettingsData().animations?750:0); return;
        }
        currentGameStats.wrongMoves++; playWrongSound(); stack.animate=true; updateInterface();
        setTimeout(()=>{
            const stackEl=stacksElement.children[stackIndex]; const cardEl=stackEl?.querySelector(".flip-card"); if(cardEl) requestAnimationFrame(()=>cardEl.classList.add("closing"));
            messageElement.textContent=`${t("wrong")} ${t("stackLost")}`;
            setTimeout(()=>{stack.active=false;stack.closing=false;currentGameStats.lostStacks++;playStackLostSound();waitingForAnimation=false;selectedStack=null;updateInterface();checkGameEnd();if(!gameOver)saveCurrentGame();},getSettingsData().animations?750:0);
        },getSettingsData().animations?1500:0);
    });
}

function checkGameEnd(){
    if(stacks.filter(s=>s.active).length===0){finishGame(t("allStacksLost"));return;}
    if(deck.length===0) finishGame(t("deckFinished"));
}

function finishGame(reason=null){
    if(gameOver)return; gameOver=true; waitingForAnimation=false; selectedStack=null;
    const finalScore=currentDeckSize-deck.length; scoreElement.textContent=finalScore; const finalReason=reason||t("gameFinished");
    messageElement.textContent=`🏁 ${finalReason} ${t("result")} ${finalScore} ${t("cards")}`; lowerButton.disabled=true; higherButton.disabled=true; playFinishSound(); recordGameResult(currentDeckSize,finalScore); clearSavedGame(); showGameResult(finalReason); updateContinueGameArea();
}

function serializeGame(){return {version:3,currentDeckSize,deck,stacks,selectedStack,currentGameStats,savedAt:Date.now()};}
function saveCurrentGame(){
    if(gameOver||(!deck.length&&!stacks.length))return;
    try{localStorage.setItem(STORAGE_KEYS.savedGame,JSON.stringify(serializeGame()));updateContinueGameArea();}catch(error){console.warn("Не вдалося зберегти гру:",error);}
}
function getSavedGame(){
    try{
        const parsed=JSON.parse(localStorage.getItem(STORAGE_KEYS.savedGame)||"null");
        if(!parsed||!Array.isArray(parsed.deck)||!Array.isArray(parsed.stacks)||(parsed.currentDeckSize!==36&&parsed.currentDeckSize!==54))return null;
        return parsed;
    }catch{return null;}
}
function clearSavedGame(){localStorage.removeItem(STORAGE_KEYS.savedGame);updateContinueGameArea();}
function updateContinueGameArea(){
    const saved=getSavedGame(); if(!saved){continueGameArea.classList.add("hidden");return;}
    continueGameArea.classList.remove("hidden"); const usedCards=saved.currentDeckSize-saved.deck.length;
    continueGameDescription.textContent=getCurrentLanguage()==="en"?`${saved.currentDeckSize}-card deck • ${usedCards} cards used`:`Колода ${saved.currentDeckSize} карт • використано ${usedCards} карт`;
}

function restoreSavedGame(){
    const saved=getSavedGame(); if(!saved){showToast(t("noSavedGame"));return;}
    hideGameResult();closeExitConfirmation();hideAllScreens();gameScreen.classList.remove("hidden");
    currentDeckSize=Number(saved.currentDeckSize); deck=Array.isArray(saved.deck)?saved.deck:[]; stacks=Array.isArray(saved.stacks)?saved.stacks:[];
    selectedStack=saved.selectedStack===null?null:Number(saved.selectedStack);
    currentGameStats={correctMoves:Number(saved.currentGameStats?.correctMoves||0),wrongMoves:Number(saved.currentGameStats?.wrongMoves||0),lostStacks:Number(saved.currentGameStats?.lostStacks||0)};
    stacks.forEach(stack=>{stack.animate=false;stack.closing=false;}); gameOver=false;waitingForAnimation=false;currentGameRecorded=false;isRestoringGame=true;applyLanguage();updateInterface();
    if(selectedStack!==null&&stacks[selectedStack]?.active) selectStack(selectedStack);
}

function hideAllScreens(){[mainMenu,deckMenu,profileScreen,settingsScreen,achievementsScreen,howToPlayScreen,gameScreen].forEach(el=>el.classList.add("hidden"));}
function showMainMenu(){hideGameResult();closeExitConfirmation();hideAllScreens();mainMenu.classList.remove("hidden");applyLanguage();updateContinueGameArea();}
function showDeckMenu(){hideGameResult();closeExitConfirmation();hideAllScreens();deckMenu.classList.remove("hidden");applyLanguage();}
function showProfile(){hideGameResult();closeExitConfirmation();hideAllScreens();loadProfile();profileScreen.classList.remove("hidden");applyLanguage();}
function showAchievements(){hideGameResult();closeExitConfirmation();hideAllScreens();achievementsScreen.classList.remove("hidden");renderAchievements();}
function showHowToPlay(){hideGameResult();closeExitConfirmation();hideAllScreens();howToPlayScreen.classList.remove("hidden");applyLanguage();}
function showSettings(){hideGameResult();closeExitConfirmation();hideAllScreens();loadSettings();settingsScreen.classList.remove("hidden");applyLanguage();}
function showGame(size){hideAllScreens();gameScreen.classList.remove("hidden");applyLanguage();startGame(size);}

function requestExitGame(){if(gameOver){showMainMenu();return;}if(!deck.length||!stacks.length){showMainMenu();return;}saveCurrentGame();openExitConfirmation();}
function openExitConfirmation(){applyLanguage();exitConfirmOverlay.classList.remove("hidden");}
function closeExitConfirmation(){exitConfirmOverlay.classList.add("hidden");}
function confirmExitGame(){saveCurrentGame();gameOver=true;waitingForAnimation=false;selectedStack=null;closeExitConfirmation();showToast(t("toastExit"));showMainMenu();}

function loadProfile(){const p=getProfileData();nicknameInput.value=p.nickname||"Гравець";[36,54].forEach(size=>{const s=p.stats[size];setText(`games${size}`,s.games);setText(`average${size}`,s.games?(s.totalScore/s.games).toFixed(1):0);setText(`best${size}`,s.best);});setText("totalCardsUsed",p.totalCardsUsed);setText("correctMoves",p.correctMoves);setText("wrongMoves",p.wrongMoves);setText("lostStacks",p.lostStacks);updateAchievementCounts();}
function saveNickname(){let nickname=nicknameInput.value.trim();if(!nickname)nickname="Гравець";const profile=getProfileData();profile.nickname=nickname;saveProfileData(profile);nicknameInput.value=nickname;showToast(t("toastNickname"));}
function recordGameResult(size,score){if(currentGameRecorded)return;currentGameRecorded=true;const p=getProfileData();const s=p.stats[size]||{games:0,totalScore:0,best:0};s.games++;s.totalScore+=score;s.best=Math.max(s.best,score);p.stats[size]=s;p.totalCardsUsed+=score;p.correctMoves+=currentGameStats.correctMoves;p.wrongMoves+=currentGameStats.wrongMoves;p.lostStacks+=currentGameStats.lostStacks;updateAchievementsForProfile(p);saveProfileData(p);}

function achievementValue(a,p){return Math.min(a.goal,Math.max(0,Number(a.metric(p)||0)));}
function updateAchievementsForProfile(profile){achievements.forEach(a=>{if(achievementValue(a,profile)>=a.goal)profile.achievements[a.id]=true;});}
function updateAchievementCounts(){const p=getProfileData();updateAchievementsForProfile(p);saveProfileData(p);const unlocked=achievements.filter(a=>p.achievements[a.id]).length;setText("achievementsProgress",`${unlocked} / ${achievements.length}`);setText("achievementsCount",`${unlocked} / ${achievements.length}`);}
function renderAchievements(){const p=getProfileData();updateAchievementsForProfile(p);saveProfileData(p);const list=$("achievementsList");list.innerHTML="";achievements.forEach(a=>{const value=achievementValue(a,p);const unlocked=!!p.achievements[a.id];const item=document.createElement("div");item.className=`achievement-item ${unlocked?"unlocked":"locked"}`;item.innerHTML=`<div class="achievement-icon">${a.icon}</div><div><div class="achievement-name">${a.name[getCurrentLanguage()]}</div><div class="achievement-description">${a.desc[getCurrentLanguage()]}</div></div><div class="achievement-progress">${unlocked?t("unlocked"):value+" / "+a.goal}</div>`;list.appendChild(item);});updateAchievementCounts();}

function showToast(text){toast.textContent=text;toast.classList.remove("hidden");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.add("hidden"),2200);}

function ensureAudio(){if(audioContext)return audioContext;try{audioContext=new (window.AudioContext||window.webkitAudioContext)();return audioContext;}catch{return null;}}
function tone(frequency,duration=0.08,type="sine",gain=0.04,delay=0){const s=getSettingsData();if(!s.sound||s.volume<=0)return;const ctx=ensureAudio();if(!ctx)return;const now=ctx.currentTime+delay;const osc=ctx.createOscillator();const g=ctx.createGain();osc.type=type;osc.frequency.value=frequency;g.gain.setValueAtTime(0.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(0.0001,gain*s.volume),now+0.01);g.gain.exponentialRampToValueAtTime(0.0001,now+duration);osc.connect(g);g.connect(ctx.destination);osc.start(now);osc.stop(now+duration+0.02);}
function playStackSelectSound(){tone(440,0.07,"triangle",0.035);}
function playCardMoveSound(){tone(240,0.05,"sine",0.02);tone(330,0.06,"sine",0.018,0.05);}
function playCorrectSound(){tone(660,0.08,"sine",0.04);tone(880,0.12,"sine",0.035,0.08);}
function playWrongSound(){tone(180,0.14,"sawtooth",0.025);tone(130,0.16,"sawtooth",0.02,0.09);}
function playStackLostSound(){tone(120,0.2,"triangle",0.025);}
function playFinishSound(){tone(523,0.1,"sine",0.04);tone(659,0.1,"sine",0.04,0.11);tone(784,0.18,"sine",0.04,0.22);}

function bindEvents(){
    $("playButton").addEventListener("click",showDeckMenu); $("continueGameButton").addEventListener("click",restoreSavedGame); $("howToPlayButton").addEventListener("click",showHowToPlay); $("profileButton").addEventListener("click",showProfile); $("settingsButton").addEventListener("click",showSettings); $("logoutButton").addEventListener("click",()=>{clearSavedGame();showToast(t("logoutMessage"));showMainMenu();});
    $("deck36Button").addEventListener("click",()=>showGame(36)); $("deck54Button").addEventListener("click",()=>showGame(54)); $("backToMenuButton").addEventListener("click",showMainMenu);
    $("backFromProfileButton").addEventListener("click",showMainMenu); $("backFromAchievementsButton").addEventListener("click",showProfile); $("backFromHowToPlayButton").addEventListener("click",showMainMenu); $("backFromSettingsButton").addEventListener("click",showMainMenu);
    $("openAchievementsButton").addEventListener("click",showAchievements); $("saveNicknameButton").addEventListener("click",saveNickname);
    [languageSelect,soundToggle,volumeSlider,animationToggle,difficultyToggle,themeSelect,cardBackSelect].forEach(el=>el.addEventListener("input",()=>{if(el===volumeSlider)updateVolumeLabel();saveCurrentSettings();}));
    $("backFromGameButton").addEventListener("click",requestExitGame); lowerButton.addEventListener("click",()=>playPrediction("lower")); higherButton.addEventListener("click",()=>playPrediction("higher"));
    $("nextGameButton").addEventListener("click",()=>showGame(currentDeckSize)); $("changeDeckButton").addEventListener("click",showDeckMenu); $("resultLobbyButton").addEventListener("click",showMainMenu);
    $("confirmExitButton").addEventListener("click",confirmExitGame); $("cancelExitButton").addEventListener("click",closeExitConfirmation);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!exitConfirmOverlay.classList.contains("hidden"))closeExitConfirmation();else if(!gameResultOverlay.classList.contains("hidden"))hideGameResult();}});
}

function init(){
    const settings=getSettingsData();
    if(!localStorage.getItem(STORAGE_KEYS.settings))saveSettingsData(settings);
    applyTheme(settings.theme);loadSettings();applyLanguage();loadProfile();updateContinueGameArea();bindEvents();
    // Розблокувати Web Audio після першої взаємодії користувача.
    document.addEventListener("pointerdown",()=>{const ctx=ensureAudio();if(ctx?.state==="suspended")ctx.resume();},{once:true});
}

document.addEventListener("DOMContentLoaded",init);
