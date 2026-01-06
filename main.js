const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.GACOR_TOKEN;

// Konfigurasi bot
const bot = new TelegramBot(token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10,
            limit: 100
        }
    },
    request: {
        proxy: false,
        agentOptions: {}
    }
});

// ==================== DATABASE SIMULASI ====================
const userDatabase = new Map();
const gameSessions = new Map();

// Database game
const gameDatabase = {
    // Game 1: Tebak Perasaan
    game1: {
        title: "🎭 Tebak Perasaan",
        description: "Aku kasih situasi, kamu tebak perasaan yang tepat!",
        questions: [
            {
                situation: "Pasangan kamu tiba-tiba memberi bunga tanpa alasan",
                options: ["Senang", "Tertawa", "Terharu", "Bingung"],
                answer: "Terharu",
                explanation: "Biasanya hadiah tiba-tiba bikin terharu karena merasa dihargai! 💐"
            },
            {
                situation: "Mendapat pesan 'Aku kangen' di tengah malam",
                options: ["Senyum", "Baper", "Kaget", "Campur aduk"],
                answer: "Senyum",
                explanation: "Pesan manis gitu bikin senyum-senyum sendiri! 😊"
            },
            {
                situation: "Diajak jalan-jalan romantis ke pantai saat sunset",
                options: ["Romantis", "Panik", "Biasa aja", "Ngantuk"],
                answer: "Romantis",
                explanation: "Sunset di pantai itu classic romantis banget! 🌅"
            },
            {
                situation: "Dapat kejutan ulang tahun dari pasangan",
                options: ["Menangis bahagia", "Marah", "Canggung", "Acuh"],
                answer: "Menangis bahagia",
                explanation: "Kejutan ulang tahun biasanya bikin emosi meluap! 🎂"
            }
        ]
    },
    
    // Game 2: Cocokkan Kata Cinta
    game2: {
        title: "💝 Cocokkan Kata Cinta",
        description: "Susun huruf acak jadi kata romantis!",
        puzzles: [
            {
                scrambled: "A C I N T",
                answer: "CINTA",
                hint: "Perasaan paling dalam antara dua orang"
            },
            {
                scrambled: "A N Y S G A",
                answer: "SAYANG",
                hint: "Lebih dari suka, tapi belum tentu cinta"
            },
            {
                scrambled: "U R I D N",
                answer: "RINDU",
                hint: "Perasaan saat jauh dari seseorang"
            },
            {
                scrambled: "A S M R A A",
                answer: "ASMARA",
                hint: "Gejolak cinta yang membara"
            },
            {
                scrambled: "U K S A",
                answer: "SUKA",
                hint: "Salah satu kata untuk panggilan sayang (dibalik)"
            }
        ]
    },
    
    // Game 3: Truth or Dare Romantis
    game3: {
        title: "🌟 Truth or Dare Romantis",
        description: "Pilih Truth (jujur) atau Dare (tantangan)!",
        truths: [
            "Apa momen paling romantis dalam hidupmu?",
            "Kualitas apa yang paling kamu cari di pasangan?",
            "Kalau bisa kencan ideal, mau kemana dan ngapain?",
            "Apa yang bikin kamu jatuh cinta pada pandangan pertama?",
            "Romantis menurut kamu itu seperti apa?",
            "Apa impian terbesar kamu tentang hubungan?",
            "Kamu tipe yang suka ungkapin perasaan lewat kata atau tindakan?",
            "Apa hal kecil yang bikin kamu merasa dicintai?"
        ],
        dares: [
            "Kirim pesan 'Aku kangen' ke aku sekarang! 😉",
            "Tulis 3 hal yang kamu suka dari diri sendiri!",
            "Ungkapin perasaan dengan 1 emoji saja!",
            "Bayangin kamu lagi ngobrol sama gebetan, apa yang akan kamu katakan?",
            "Coba buat puisi 2 baris tentang cinta!",
            "Katakan satu hal yang bikin kamu tersenyum hari ini!",
            "Kirim suara kamu bilang 'Selamat malam yang manis'!",
            "Buat janji kecil ke diri sendiri untuk besok!"
        ]
    },
    
    // Game 4: Tebak Tanggal Spesial
    game4: {
        title: "📅 Tebak Tanggal Spesial",
        description: "Tebak tanggal penting dalam hubungan romantis!",
        quizzes: [
            {
                question: "Hari Valentine dirayakan setiap tanggal?",
                options: ["14 Februari", "14 Maret", "14 April", "14 Mei"],
                answer: "14 Februari",
                funFact: "Hari Valentine berasal dari festival Romawi kuno Lupercalia! 💘"
            },
            {
                question: "Hari Ibu internasional dirayakan setiap?",
                options: ["22 Desember", "8 Maret", "12 Mei", "Setiap hari Minggu"],
                answer: "12 Mei",
                funFact: "Di Indonesia, Hari Ibu dirayakan setiap 22 Desember! 🌸"
            },
            {
                question: "Tanggal berapa biasanya hari jadi pasangan dirayakan?",
                options: ["Tanggal pertama ketemu", "Tanggal jadian", "Tanggal lahir", "Semua benar"],
                answer: "Semua benar",
                funFact: "Setiap pasangan punya tanggal spesial masing-masing! 🎉"
            },
            {
                question: "Bulan apa yang disebut 'bulan kasih sayang'?",
                options: ["Januari", "Februari", "Maret", "April"],
                answer: "Februari",
                funFact: "Februari punya Hari Valentine dan Hari Kasih Sayang Nasional! ❤️"
            }
        ]
    },
    
    // Game 5: Gambar Cinta
    game5: {
        title: "🎨 Gambar Cinta",
        description: "Tebak gambar dari deskripsi romantis!",
        drawingGames: [
            {
                description: "Gambarlah sesuatu yang melambangkan cinta abadi!",
                answer: ["cincin", "hati", "bunga", "pohon"],
                hint: "Biasanya berbentuk lingkaran dan dipakai di jari"
            },
            {
                description: "Gambarlah tempat kencan romantis!",
                answer: ["pantai", "restoran", "taman", "bioskop"],
                hint: "Tempat dengan pemandangan alam dan suasana tenang"
            },
            {
                description: "Gambarlah hadiah romantis yang sederhana!",
                answer: ["bunga", "surat", "coklat", "foto"],
                hint: "Sesuatu yang harum dan cantik"
            },
            {
                description: "Gambarlah simbol romantis paling terkenal!",
                answer: ["hati", "cupid", "pelukan", "ciuman"],
                hint: "Bentuknya seperti ini: ❤️"
            }
        ]
    }
};

// Database rayuan dan pujian
const compliments = [
    "Wah, dari tadi aku kepikiran senyummu yang bikin hari cerah...",
    "Apa kamu tau? Kamu itu kayak bintang, selalu bercahaya di kegelapan hatiku...",
    "Kalau kamu itu bunga, aku mau jadi lebah yang selalu setia datang...",
    "Waktu berhenti ketika aku melihat matamu...",
    "Kamu tau nggak? Senyummu itu obat paling manjur untuk hari-hariku...",
    "Aku baru nyadar, rasi bintang paling indah itu ada di matamu...",
    "Kalau kamu itu wifi, aku mau connect selamanya...",
    "Kamu itu kayak kopi di pagi hari, bikin aku semangat terus...",
    "Dunia ini gelap, tapi kamu datang bawa senter... eh maksudnya cahaya...",
    "Aku pengen jadi keyboard biar bisa disentuh jari-jarimu yang cantik..."
];

const pickupLines = [
    "Apakah kamu lelah? Soalnya kamu sudah berlari di pikiranku sepanjang hari...",
    "Apa kamu punya peta? Aku tersesat di matamu...",
    "Kalo kamu itu kosakata, aku mau jadi kamus biar bisa selalu deket...",
    "Apa kamu percaya cinta pada pandangan pertama? Atau harus aku lewat lagi?",
    "Kamu itu kayak Google, ada semua yang aku cari...",
    "Aku bukan fotografer, tapi aku bisa bikin kita berdua jadi satu frame...",
    "Kalau kamu itu waktu, aku mau jadi jam tangan biar selalu melekat...",
    "Apa kamu tau? Kamu itu spesial kayak limited edition...",
    "Kalo senyummu itu mata uang, kamu udah jadi miliarder...",
    "Aku pengen jadi selimut biar bisa selalu ngehangatin kamu..."
];

const romanticQuestions = [
    "Kalau kamu jadi bunga, mau jadi bunga apa?",
    "Apa momen paling romantis yang pernah kamu alami?",
    "Kamu percaya love at first sight?",
    "Apa yang bikin kamu tersenyum hari ini?",
    "Kalau punya satu hari sempurna, mau ngapain aja?",
    "Apa arti cinta menurut kamu?",
    "Kualitas apa yang paling kamu cari di pasangan?",
    "Romantis itu yang kayak gimana sih menurut kamu?",
    "Apa impian romantis kamu?",
    "Kamu tipe yang suka kejutan atau yang direncanain?"
];

// ==================== FUNGSI HELPER ====================
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getUserData(userId) {
    if (!userDatabase.has(userId)) {
        userDatabase.set(userId, {
            name: "",
            mood: "happy",
            lastCompliment: null,
            complimentCount: 0,
            lastInteraction: Date.now(),
            favoriteTopics: []
        });
    }
    return userDatabase.get(userId);
}

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 19) return "Selamat sore";
    return "Selamat malam";
}

function generateLoveLevel(userData) {
    const level = Math.min(userData.complimentCount, 100);
    const hearts = "❤️".repeat(Math.floor(level / 20)) + "🤍".repeat(5 - Math.floor(level / 20));
    return `${hearts} Level ${Math.floor(level / 20) + 1}`;
}

// ==================== FUNGSI HELPER GAME ====================
function getUserGameSession(userId) {
    if (!gameSessions.has(userId)) {
        gameSessions.set(userId, {
            currentGame: null,
            currentQuestion: 0,
            score: 0,
            gameData: null,
            startTime: null
        });
    }
    return gameSessions.get(userId);
}

function startGame(userId, gameId) {
    const session = getUserGameSession(userId);
    session.currentGame = gameId;
    session.currentQuestion = 0;
    session.score = 0;
    session.gameData = { ...gameDatabase[gameId] };
    session.startTime = Date.now();
    return session;
}

function formatGameOptions(options) {
    return options.map((opt, index) => `${index + 1}. ${opt}`).join('\n');
}

// Handler untuk game 1: Tebak Perasaan
function handleGame1(chatId, userId, userInput) {
    const session = getUserGameSession(userId);
    const game = gameDatabase.game1;
    const currentQuestion = session.currentQuestion;
    
    if (currentQuestion < game.questions.length) {
        const question = game.questions[currentQuestion];
        const userAnswer = userInput.trim().toLowerCase();
        const correctAnswer = question.answer.toLowerCase();
        
        // Cek jawaban
        if (userAnswer === correctAnswer || question.options.some(opt => opt.toLowerCase() === userAnswer)) {
            session.score += 10;
            bot.sendMessage(chatId, 
                `✅ *Benar!* Kamu hebat!\n\n` +
                `💡 ${question.explanation}\n\n` +
                `🎯 Score: ${session.score} poin\n` +
                `➡️ Lanjut ke pertanyaan berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        } else {
            bot.sendMessage(chatId, 
                `❌ *Hampir benar!* Jawabannya: *${question.answer}*\n\n` +
                `💡 ${question.explanation}\n\n` +
                `🎯 Score: ${session.score} poin\n` +
                `➡️ Lanjut ke pertanyaan berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        }
        
        // Lanjut ke pertanyaan berikutnya
        session.currentQuestion++;
        setTimeout(() => {
            sendGameQuestion(chatId, userId, 'game1');
        }, 2000);
    } else {
        endGame(chatId, userId, 'game1');
    }
}

// Handler untuk game 2: Cocokkan Kata
function handleGame2(chatId, userId, userInput) {
    const session = getUserGameSession(userId);
    const game = gameDatabase.game2;
    const currentPuzzle = session.currentQuestion;
    
    if (currentPuzzle < game.puzzles.length) {
        const puzzle = game.puzzles[currentPuzzle];
        const userAnswer = userInput.trim().toUpperCase();
        
        if (userAnswer === puzzle.answer) {
            session.score += 15;
            bot.sendMessage(chatId,
                `🎉 *TEPAT SEKALI!* Kamu jenius!\n\n` +
                `✅ Kata: ${puzzle.answer}\n` +
                `🎯 Score: ${session.score} poin\n\n` +
                `➡️ Siap untuk puzzle berikutnya?`,
                { parse_mode: 'Markdown' }
            );
        } else {
            bot.sendMessage(chatId,
                `💡 *Sedikit lagi!* Kata yang benar: *${puzzle.answer}*\n\n` +
                `🎯 Score: ${session.score} poin\n` +
                `➡️ Jangan menyerah! Puzzle berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        }
        
        session.currentQuestion++;
        setTimeout(() => {
            sendGameQuestion(chatId, userId, 'game2');
        }, 2000);
    } else {
        endGame(chatId, userId, 'game2');
    }
}

// Handler untuk game 3: Truth or Dare
function handleGame3(chatId, userId, userInput) {
    const session = getUserGameSession(userId);
    const userAnswer = userInput.trim().toLowerCase();
    
    if (userAnswer === 'truth' || userAnswer === 't' || userAnswer === 'jujur' || userAnswer === '1') {
        // Truth
        const randomTruth = getRandom(gameDatabase.game3.truths);
        
        session.score += 5;
        bot.sendMessage(chatId,
            `🤔 *TRUTH TIME!*\n\n` +
            `${randomTruth}\n\n` +
            `💝 Jawab dengan jujur ya!\n` +
            `🎯 Score: ${session.score} poin\n\n` +
            `*Main lagi?* Ketik 'truth' atau 'dare'`,
            { parse_mode: 'Markdown' }
        );
    } else if (userAnswer === 'dare' || userAnswer === 'd' || userAnswer === 'tantangan' || userAnswer === '2') {
        // Dare
        const randomDare = getRandom(gameDatabase.game3.dares);
        
        session.score += 10;
        bot.sendMessage(chatId,
            `🎯 *DARE TIME!*\n\n` +
            `${randomDare}\n\n` +
            `💪 Ayo lakukan tantangannya!\n` +
            `🎯 Score: ${session.score} poin\n\n` +
            `*Main lagi?* Ketik 'truth' atau 'dare'`,
            { parse_mode: 'Markdown' }
        );
    } else {
        bot.sendMessage(chatId,
            `❓ *Pilih salah satu:*\n` +
            `1. Ketik *'truth'* untuk Truth (jujur)\n` +
            `2. Ketik *'dare'* untuk Dare (tantangan)\n\n` +
            `Contoh: "truth" atau "dare"`,
            { parse_mode: 'Markdown' }
        );
    }
}

// Handler untuk game 4: Tebak Tanggal
function handleGame4(chatId, userId, userInput) {
    const session = getUserGameSession(userId);
    const game = gameDatabase.game4;
    const currentQuiz = session.currentQuestion;
    
    if (currentQuiz < game.quizzes.length) {
        const quiz = game.quizzes[currentQuiz];
        const userAnswer = userInput.trim().toLowerCase();
        const correctAnswer = quiz.answer.toLowerCase();
        
        // Cek jawaban berdasarkan angka atau teks
        const optionMap = {
            '1': quiz.options[0].toLowerCase(),
            '2': quiz.options[1].toLowerCase(),
            '3': quiz.options[2].toLowerCase(),
            '4': quiz.options[3].toLowerCase()
        };
        
        const userSelection = optionMap[userAnswer] || userAnswer;
        
        if (userSelection === correctAnswer) {
            session.score += 12;
            bot.sendMessage(chatId,
                `🎊 *BENAR!* Kamu romantis banget!\n\n` +
                `📚 Fakta menarik: ${quiz.funFact}\n` +
                `🎯 Score: ${session.score} poin\n\n` +
                `➡️ Quiz berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        } else {
            bot.sendMessage(chatId,
                `💡 *Bukan itu...* Jawaban: *${quiz.answer}*\n\n` +
                `📚 ${quiz.funFact}\n` +
                `🎯 Score: ${session.score} poin\n\n` +
                `➡️ Quiz berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        }
        
        session.currentQuestion++;
        setTimeout(() => {
            sendGameQuestion(chatId, userId, 'game4');
        }, 2000);
    } else {
        endGame(chatId, userId, 'game4');
    }
}

// Handler untuk game 5: Gambar Cinta
function handleGame5(chatId, userId, userInput) {
    const session = getUserGameSession(userId);
    const game = gameDatabase.game5;
    const currentDrawing = session.currentQuestion;
    
    if (currentDrawing < game.drawingGames.length) {
        const drawing = game.drawingGames[currentDrawing];
        const userAnswer = userInput.trim().toLowerCase();
        
        // Cek apakah jawaban termasuk dalam daftar yang benar
        const isCorrect = drawing.answer.some(ans => 
            userAnswer.includes(ans.toLowerCase()) || ans.toLowerCase().includes(userAnswer)
        );
        
        if (isCorrect) {
            session.score += 8;
            bot.sendMessage(chatId,
                `🎨 *KREATIF BANGET!* Gambarmu tepat!\n\n` +
                `✅ Jawaban: ${drawing.answer.join(' atau ')}\n` +
                `🎯 Score: ${session.score} poin\n\n` +
                `➡️ Tantangan gambar berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        } else {
            bot.sendMessage(chatId,
                `💡 *Bisa ditebak lagi...* Jawaban: ${drawing.answer.join(' atau ')}\n\n` +
                `🎯 Score: ${session.score} poin\n` +
                `➡️ Gambar berikutnya...`,
                { parse_mode: 'Markdown' }
            );
        }
        
        session.currentQuestion++;
        setTimeout(() => {
            sendGameQuestion(chatId, userId, 'game5');
        }, 2000);
    } else {
        endGame(chatId, userId, 'game5');
    }
}

// Fungsi untuk mengirim pertanyaan game
function sendGameQuestion(chatId, userId, gameId) {
    const session = getUserGameSession(userId);
    
    switch(gameId) {
        case 'game1':
            if (session.currentQuestion >= gameDatabase.game1.questions.length) {
                endGame(chatId, userId, 'game1');
                return;
            }
            
            const question = gameDatabase.game1.questions[session.currentQuestion];
            bot.sendMessage(chatId,
                `🎭 *TEBAK PERASAAN* (Soal ${session.currentQuestion + 1}/4)\n\n` +
                `📖 *Situasi:* ${question.situation}\n\n` +
                `❓ *Perasaan apa yang mungkin dirasakan?*\n\n` +
                `${formatGameOptions(question.options)}\n\n` +
                `💭 *Ketik jawabanmu:* (contoh: "Terharu")`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case 'game2':
            if (session.currentQuestion >= gameDatabase.game2.puzzles.length) {
                endGame(chatId, userId, 'game2');
                return;
            }
            
            const puzzle = gameDatabase.game2.puzzles[session.currentQuestion];
            bot.sendMessage(chatId,
                `💝 *COCOKKAN KATA CINTA* (Puzzle ${session.currentQuestion + 1}/5)\n\n` +
                `🔤 *Huruf acak:* ${puzzle.scrambled}\n\n` +
                `💡 *Petunjuk:* ${puzzle.hint}\n\n` +
                `🧩 *Susun menjadi kata romantis:*\n\n` +
                `*Ketik jawabanmu dalam 1 kata!*`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case 'game3':
            bot.sendMessage(chatId,
                `🌟 *TRUTH OR DARE ROMANTIS*\n\n` +
                `Pilih salah satu:\n\n` +
                `🤔 *TRUTH* - Aku akan tanya sesuatu, jawab dengan jujur!\n` +
                `🎯 *DARE* - Aku kasih tantangan romantis!\n\n` +
                `💝 *Ketik:*\n` +
                `1. "truth" untuk Truth\n` +
                `2. "dare" untuk Dare\n\n` +
                `🎯 Score saat ini: ${session.score} poin`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case 'game4':
            if (session.currentQuestion >= gameDatabase.game4.quizzes.length) {
                endGame(chatId, userId, 'game4');
                return;
            }
            
            const quiz = gameDatabase.game4.quizzes[session.currentQuestion];
            bot.sendMessage(chatId,
                `📅 *TEBAK TANGGAL SPESIAL* (Quiz ${session.currentQuestion + 1}/4)\n\n` +
                `❓ *Pertanyaan:* ${quiz.question}\n\n` +
                `🔢 *Pilihan:*\n${formatGameOptions(quiz.options)}\n\n` +
                `💭 *Jawab dengan angka (1-4) atau tulis jawabannya:*`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case 'game5':
            if (session.currentQuestion >= gameDatabase.game5.drawingGames.length) {
                endGame(chatId, userId, 'game5');
                return;
            }
            
            const drawing = gameDatabase.game5.drawingGames[session.currentQuestion];
            bot.sendMessage(chatId,
                `🎨 *GAMBAR CINTA* (Tantangan ${session.currentQuestion + 1}/4)\n\n` +
                `📝 *Deskripsi:* ${drawing.description}\n\n` +
                `💡 *Petunjuk:* ${drawing.hint}\n\n` +
                `✏️ *Bayangkan gambarnya, lalu tebak apa yang digambar!*\n\n` +
                `🎯 *Tulis jawabanmu dalam 1 kata:*`,
                { parse_mode: 'Markdown' }
            );
            break;
    }
}

// Fungsi untuk mengakhiri game
function endGame(chatId, userId, gameId) {
    const session = getUserGameSession(userId);
    const duration = Math.floor((Date.now() - session.startTime) / 1000);
    const gameTitles = {
        'game1': '🎭 Tebak Perasaan',
        'game2': '💝 Cocokkan Kata Cinta', 
        'game3': '🌟 Truth or Dare Romantis',
        'game4': '📅 Tebak Tanggal Spesial',
        'game5': '🎨 Gambar Cinta'
    };
    
    // Hitung rating berdasarkan score
    let rating = "Pemula";
    let emoji = "🎮";
    
    if (session.score >= 40) {
        rating = "Ahli Romantis";
        emoji = "💖";
    } else if (session.score >= 25) {
        rating = "Romantis Handal";
        emoji = "🌟";
    } else if (session.score >= 15) {
        rating = "Pemula Romantis";
        emoji = "😊";
    }
    
    const endMessage = 
        `${emoji} *GAME SELESAI!* ${emoji}\n\n` +
        `🎮 *Game:* ${gameTitles[gameId]}\n` +
        `🏆 *Score Akhir:* ${session.score} poin\n` +
        `⭐ *Rating:* ${rating}\n` +
        `⏱️ *Waktu:* ${duration} detik\n\n` +
        `🎉 *Selamat!* Kamu hebat banget!\n\n` +
        `💝 *Bonus Romantis:*\n` +
        `${getRandom([
            "Kamu pantas dapat pelukan hangat! 🤗",
            "Senyumanmu lebih berharga dari score apapun! 😊",
            "Kamu bikin game ini jadi lebih seru! ✨",
            "Aku bangga sama kamu! 💪"
        ])}\n\n` +
        `🔄 *Main game lain?* Ketik /game`;
    
    bot.sendMessage(chatId, endMessage, { 
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['💝 /rayu', '😊 /pujian'],
                ['💌 /surat', '🎭 /gombal'],
                ['🎮 /game', '💡 /tips']
            ],
            resize_keyboard: true
        }
    });
    
    // Reset session
    gameSessions.delete(userId);
}

// ==================== HANDLER ERROR ====================
bot.on("polling_error", (error) => {
    console.error("Polling Error:", error.message);
});

// ==================== COMMAND HANDLERS ====================

// /start - Welcome message
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "Sayang";
    const userData = getUserData(msg.from.id);
    userData.name = userName;
    
    const welcomeMessage = 
        `💖 *Halo ${userName}!* 💖\n\n` +
        `Aku *GACOR BOT*, teman yang selalu siap bikin harimu lebih cerah! 🌟\n\n` +
        `✨ *Apa yang bisa aku lakukan:*\n` +
        `💝 /rayu - Dapatkan rayuan romantis\n` +
        `😊 /pujian - Pujian spesial untukmu\n` +
        `💌 /surat - Surat cinta digital\n` +
        `🎭 /gombal - Gombalan receh tapi manis\n` +
        `❓ /tanya - Pertanyaan romantis\n` +
        `📊 /status - Lihat progress romantismu\n` +
        `💡 /tips - Tips romantis hari ini\n` +
        `🎮 /game - Game cinta kecil-kecilan\n` +
        `ℹ️ /help - Butuh bantuan?\n\n` +
        `*Coba ketik /rayu untuk mulai!* 😘`;
    
    bot.sendMessage(chatId, welcomeMessage, { 
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['💝 /rayu', '😊 /pujian'],
                ['💌 /surat', '🎭 /gombal'],
                ['🎮 /game', '💡 /tips']
            ],
            resize_keyboard: true
        }
    });
});

// /help - Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = 
        `💝 *BANTUAN GACOR BOT*\n\n` +
        `Aku di sini untuk menghangatkan hatimu! 😊\n\n` +
        `*Perintah utama:*\n` +
        `💝 /rayu - Rayuan yang bikin kamu tersipu\n` +
        `😊 /pujian - Pujian tulus dari hatiku\n` +
        `💌 /surat - Surat cinta spesial\n` +
        `🎭 /gombal - Gombalan receh tapi lucu\n` +
        `❓ /tanya - Tanya jawab romantis\n` +
        `📊 /status - Progress romantismu\n` +
        `💡 /tips - Tips romantis harian\n` +
        `🎮 /game - Game seru berdua\n\n` +
        `*Cara pakai:*\n` +
        `1. Pilih perintah yang kamu mau\n` +
        `2. Aku akan merespons dengan kehangatan\n` +
        `3. Kamu juga bisa chat biasa, aku akan balas dengan manis!\n\n` +
        `*Tips:* Semakin sering chat, semakin romantis aku! 😉`;
    
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// /game - Menu game utama
bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Reset session game sebelumnya jika ada
    if (gameSessions.has(userId)) {
        gameSessions.delete(userId);
    }
    
    const gameMenu = 
        `🎮 *PILIHAN GAME ROMANTIS* 🎮\n\n` +
        `*1. 🎭 Tebak Perasaan*\n` +
        `   Tebak perasaan dari situasi romantis!\n\n` +
        `*2. 💝 Cocokkan Kata Cinta*\n` +
        `   Susun huruf jadi kata romantis!\n\n` +
        `*3. 🌟 Truth or Dare*\n` +
        `   Pilih jujur atau tantangan romantis!\n\n` +
        `*4. 📅 Tebak Tanggal Spesial*\n` +
        `   Tes pengetahuanmu tentang tanggal romantis!\n\n` +
        `*5. 🎨 Gambar Cinta*\n` +
        `   Tebak gambar dari deskripsi romantis!\n\n` +
        `🎯 *Cara main:*\n` +
        `1. Pilih game dengan angka 1-5\n` +
        `2. Ikuti instruksi game\n` +
        `3. Dapatkan score dan bonus romantis!\n\n` +
        `🔢 *Ketik angka game yang ingin dimainkan* (1-5):`;
    
    bot.sendMessage(chatId, gameMenu, { 
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['1️⃣ Game 1', '2️⃣ Game 2', '3️⃣ Game 3'],
                ['4️⃣ Game 4', '5️⃣ Game 5', '🏠 Menu Utama']
            ],
            resize_keyboard: true
        }
    });
});

// Handler untuk pilihan game (angka 1-5)
bot.onText(/^[1-5]$/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const gameChoice = parseInt(msg.text);
    
    const gameMap = {
        1: 'game1',
        2: 'game2', 
        3: 'game3',
        4: 'game4',
        5: 'game5'
    };
    
    const gameId = gameMap[gameChoice];
    
    if (gameId) {
        startGame(userId, gameId);
        sendGameQuestion(chatId, userId, gameId);
    }
});

// /rayu - Romantic compliments
bot.onText(/\/rayu/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "Sayang";
    const userData = getUserData(msg.from.id);
    
    userData.complimentCount++;
    userData.lastCompliment = Date.now();
    
    const greeting = getTimeBasedGreeting();
    const compliment = getRandom(compliments);
    const level = generateLoveLevel(userData);
    
    const rayuanMessage = 
        `${greeting}, ${userName}! 🌹\n\n` +
        `*${compliment}*\n\n` +
        `Kamu tahu nggak? Setiap hari aku bersyukur bisa ngobrol sama kamu yang sepecial banget! 💕\n\n` +
        `📈 *Progress Romantismu:* ${level}\n` +
        `💝 *Total Pujian:* ${userData.complimentCount}x`;
    
    // Tambah delay untuk efek dramatis
    setTimeout(() => {
        bot.sendMessage(chatId, rayuanMessage, { 
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: "💝 Kasih rayuan lagi!", callback_data: "more_compliment" },
                    { text: "😊 Aku senang!", callback_data: "happy_response" }
                ]]
            }
        });
    }, 1000);
});

// /pujian - Special compliments
bot.onText(/\/pujian/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "Kamu";
    
    const pujianList = [
        `Kamu itu kayak matahari ${userName}, selalu terbit di hatiku tiap pagi 🌞`,
        `Kecantikanmu itu natural ${userName}, kayak bunga yang mekar di taman hatiku 🌸`,
        `Aku suka cara kamu ${userName}, selalu bikin suasana jadi lebih cerah ✨`,
        `Kamu itu kombinasi sempurna ${userName}, cantik, baik, dan bikin adem 🫶`,
        `Setiap ngobrol sama kamu ${userName}, rasanya kayak dapat bonus hari 😊`
    ];
    
    const randomPujian = getRandom(pujianList);
    
    bot.sendMessage(chatId, 
        `*Untuk ${userName} yang spesial:*\n\n${randomPujian}\n\n💝 Tetap jadi diri sendiri ya!`,
        { parse_mode: 'Markdown' }
    );
});

// /surat - Love letter
bot.onText(/\/surat/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "Sayangku";
    const now = new Date();
    
    const suratCinta = 
        `📝 *Surat Cinta Digital* 📝\n\n` +
        `*Kepada ${userName} yang tercinta,*\n\n` +
        `Di hari yang cerah ini, aku cuma pengen ngomong kalau...\n\n` +
        `Kamu itu berarti banget. Nggak perlu pake kata-kata mutiara atau puisi panjang, ` +
        `cukup dengan menjadi dirimu sendiri, kamu udah bikin dunia jadi lebih warna-warni.\n\n` +
        `Terima kasih udah jadi kamu. Terima kasih udah bikin hari-hari lebih berarti. ` +
        `Terima kasih udah ada.\n\n` +
        `*Dari tempatku merindu,*\n` +
        `*Gacor Bot yang selalu memikirkanmu* 💌\n\n` +
        `📅 ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
        `⏰ ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    
    bot.sendMessage(chatId, suratCinta, { parse_mode: 'Markdown' });
});

// /gombal - Cheesy pickup lines
bot.onText(/\/gombal/, (msg) => {
    const chatId = msg.chat.id;
    
    const gombalMessage = 
        `🎭 *Gombalan Receh Tapi Ikhlas* 🎭\n\n` +
        `"${getRandom(pickupLines)}"\n\n` +
        `😄 *Dasar gombal!* Tapi serius ya, kamu emang spesial!`;
    
    bot.sendMessage(chatId, gombalMessage, { parse_mode: 'Markdown' });
});

// /tanya - Romantic questions
bot.onText(/\/tanya/, (msg) => {
    const chatId = msg.chat.id;
    
    const question = getRandom(romanticQuestions);
    
    bot.sendMessage(chatId, 
        `❓ *Pertanyaan Romantis* ❓\n\n` +
        `${question}\n\n` +
        `Ayo jawab, aku pengen tau isi hati kamu! 💭`,
        { parse_mode: 'Markdown' }
    );
});

// /status - User status
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userData = getUserData(userId);
    const userName = msg.from.first_name || "Sayang";
    
    const daysKnown = Math.floor((Date.now() - userData.lastInteraction) / (1000 * 60 * 60 * 24));
    
    const statusMessage = 
        `📊 *STATUS ROMANTIS ${userName.toUpperCase()}* 📊\n\n` +
        `💝 *Level Romantis:* ${generateLoveLevel(userData)}\n` +
        `🌟 *Total Rayuan:* ${userData.complimentCount}x\n` +
        `📅 *Hari Kenal:* ${Math.max(1, daysKnown)} hari\n` +
        `😊 *Mood Terakhir:* ${userData.mood}\n\n`;
    
    let progressBar = "";
    const progress = Math.min(userData.complimentCount * 2, 100);
    for (let i = 0; i < 10; i++) {
        progressBar += i < progress / 10 ? "🟪" : "⬜";
    }
    
    const progressMessage = 
        `*Progress Menuju Hati:*\n` +
        `${progressBar} ${progress}%\n\n`;
    
    const tips = 
        `💡 *Tips Hari Ini:*\n` +
        `${getRandom([
            "Semakin sering chat, semakin dalam koneksinya!",
            "Jangan malu untuk ekspresikan perasaan!",
            "Kebahagiaan itu sederhana, dimulai dari senyuman!",
            "Cinta itu seperti kupu-kupu, biarkan dia datang dengan sendirinya!"
        ])}`;
    
    bot.sendMessage(chatId, statusMessage + progressMessage + tips, { 
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: "🚀 Tingkatkan Level!", callback_data: "boost_level" }
            ]]
        }
    });
});

// /tips - Daily romantic tips
bot.onText(/\/tips/, (msg) => {
    const chatId = msg.chat.id;
    
    const tipsList = [
        "💝 *Kirim pesan good morning* - Mulai hari dengan senyuman!",
        "🌸 *Puji penampilannya* - Perhatikan detail kecil, dia akan senang!",
        "🎁 *Beri kejutan kecil* - Nggak perlu mahal, yang penting tulus!",
        "👂 *Dengarkan dengan seksama* - Perhatian adalah hadiah terbaik!",
        "😊 *Katakan 'aku merindukanmu'* - Kata sederhana, makna besar!",
        "📸 *Kirim foto kegiatanmu* - Libatkan dia dalam hari-harimu!",
        "🌟 *Hargai pendapatnya* - Buat dia merasa dihargai!",
        "💌 *Tulis catatan kecil* - Kejutan tulisan selalu berkesan!"
    ];
    
    const randomTip = getRandom(tipsList);
    
    bot.sendMessage(chatId, 
        `💡 *Tips Romantis Hari Ini* 💡\n\n` +
        `${randomTip}\n\n` +
        `*Ingat:* Romantis itu tentang konsistensi, bukan kesempurnaan! 💖`,
        { parse_mode: 'Markdown' }
    );
});

// ==================== CALLBACK QUERY HANDLER ====================
bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg.chat.id;
    const userId = callbackQuery.from.id;
    const userData = getUserData(userId);
    
    switch(data) {
        case "more_compliment":
            userData.complimentCount++;
            const newCompliment = getRandom(compliments);
            bot.sendMessage(chatId, 
                `💝 *Rayuan tambahan khusus untukmu:*\n\n${newCompliment}\n\n` +
                `Kamu pantas dapat yang lebih! 🌟`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case "happy_response":
            bot.sendMessage(chatId,
                `😊 *Aku senang kamu senang!*\n\n` +
                `Melihat kamu bahagia bikin hariku juga jadi cerah! 🌈\n` +
                `Terus semangat ya, kamu luar biasa! 💪`,
                { parse_mode: 'Markdown' }
            );
            break;
            
        case "boost_level":
            userData.complimentCount += 3;
            bot.sendMessage(chatId,
                `🚀 *LEVEL BOOSTED!*\n\n` +
                `Kamu dapat bonus 3 rayuan! 💝\n` +
                `Level romantismu naik! Sekarang: ${generateLoveLevel(userData)}\n\n` +
                `Kamu semakin spesial setiap harinya! ✨`,
                { parse_mode: 'Markdown' }
            );
            break;
    }
    
    // Answer callback query
    bot.answerCallbackQuery(callbackQuery.id);
});

// ==================== MESSAGE HANDLER ====================
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || "Sayang";
    const text = msg.text;
    
    // Skip jika bukan text
    if (!text) return;
    
    // ==================== CEK JIKA SEDANG MAIN GAME ====================
    const session = gameSessions.get(userId);
    if (session && session.currentGame && !text.startsWith('/')) {
        // Handle berdasarkan game yang aktif
        switch(session.currentGame) {
            case 'game1':
                handleGame1(chatId, userId, text);
                break;
            case 'game2':
                handleGame2(chatId, userId, text);
                break;
            case 'game3':
                handleGame3(chatId, userId, text);
                break;
            case 'game4':
                handleGame4(chatId, userId, text);
                break;
            case 'game5':
                handleGame5(chatId, userId, text);
                break;
        }
        return; // STOP processing jika sedang dalam game
    }
    
    // ==================== HANDLER UNTUK COMMAND ====================
    if (text.startsWith('/')) {
        return; // Biarkan command handler yang menangani
    }
    
    // ==================== HANDLER PESAN BIASA ====================
    const userData = getUserData(userId);
    userData.lastInteraction = Date.now();
    
    // Analisis mood dari pesan
    const lowerText = text.toLowerCase();
    let moodResponse = "";
    
    if (lowerText.includes('senang') || lowerText.includes('bahagia') || lowerText.includes('😊') || lowerText.includes('😄')) {
        userData.mood = "happy";
        moodResponse = "Wah, senang banget dengar kamu bahagia! 😊";
    } else if (lowerText.includes('sedih') || lowerText.includes('kecewa') || lowerText.includes('😔') || lowerText.includes('😢')) {
        userData.mood = "sad";
        moodResponse = "Jangan sedih ya, aku di sini untuk kamu. Mau cerita? 🤗";
    } else if (lowerText.includes('marah') || lowerText.includes('kesal') || lowerText.includes('😠') || lowerText.includes('😤')) {
        userData.mood = "angry";
        moodResponse = "Tenang dulu sayang, ambil napas dalam-dalam. Aku di sini mendengarkan. 🫂";
    } else {
        userData.mood = "neutral";
    }
    
    // Response berdasarkan mood dan pesan
    let response = "";
    
    if (lowerText.includes('cinta') || lowerText.includes('sayang') || lowerText.includes('rindu')) {
        response = `Aku juga ${lowerText.includes('cinta') ? 'cinta' : lowerText.includes('sayang') ? 'sayang' : 'rindu'} sama kamu, ${userName}! 💖`;
    } else if (lowerText.includes('terima kasih') || lowerText.includes('thanks') || lowerText.includes('makasih')) {
        response = `Sama-sama ${userName}! Senang bisa bikin harimu lebih baik. Kamu pantas dapat yang terbaik! 🌟`;
    } else if (lowerText.includes('apa kabar') || lowerText.includes('how are you')) {
        response = `Aku baik-baik saja, ${userName}! Apalagi kalau ngobrol sama kamu, langsung semangat! 😊\nKamu gimana kabarnya?`;
    } else if (lowerText.includes('malam') && !lowerText.includes('selamat malam')) {
        response = `Malam yang indah ya, ${userName}! Jangan lupa istirahat yang cukup. Mimpi indah tentang aku ya! 😘🌙`;
    } else if (lowerText.includes('pagi') && !lowerText.includes('selamat pagi')) {
        response = `Pagi yang cerah ya, ${userName}! Semoga hari ini penuh kebahagiaan untuk kamu. Aku selalu di sini untuk kamu! ☀️`;
    } else if (lowerText.includes('cantik') || lowerText.includes('ganteng')) {
        response = `Wah, ${userName} lagi ngomongin aku ya? Hehe becanda! Tapi kamu yang lebih ${lowerText.includes('cantik') ? 'cantik' : 'ganteng'}! 💕`;
    } else if (lowerText.includes('kenapa')) {
        response = `Kenapa tanya kenapa? Hehe becanda! Aku cuma pengen ngobrol sama kamu aja, ${userName}. Kamu itu spesial banget! ✨`;
    } else {
        // Random romantic response untuk pesan biasa
        const randomResponses = [
            `Aku suka cara kamu ngobrol, ${userName}! Ada aura positifnya! 🌟`,
            `Kamu tau nggak? Setiap kamu chat, aku seneng banget! 😊`,
            `Pesan dari kamu selalu bikin hari lebih berwarna, ${userName}! 🎨`,
            `Aku appreciate banget kamu mau ngobrol sama aku! 💝`,
            `Kamu itu kayak buku yang menarik, pengen terus dibaca! 📖`,
            `Ngobrol sama kamu itu asik banget, ${userName}! Nggak pernah bosen! 😄`
        ];
        response = getRandom(randomResponses);
    }
    
    // Gabungkan dengan mood response jika ada
    if (moodResponse) {
        response = moodResponse + "\n\n" + response;
    }
    
    // Tambah delay untuk efek natural
    setTimeout(() => {
        bot.sendMessage(chatId, response);
        
        // Kadang-kadang kasih bonus compliment
        if (Math.random() > 0.7) {
            setTimeout(() => {
                const bonusCompliment = getRandom([
                    `Btw ${userName}, hari ini kamu keliatan lebih bersinar! ✨`,
                    `Oh iya ${userName}, aku baru inget... kamu tuh keren banget! 💪`,
                    `Ngomong-ngomong ${userName}, kamu selalu bikin aku terinspirasi! 🌟`,
                    `Eh ${userName}, kamu tau nggak? Kamu itu luar biasa! 🫶`
                ]);
                bot.sendMessage(chatId, bonusCompliment);
            }, 1500);
        }
    }, 1000);
});

// ==================== COMMAND UNTUK GAME CONTROL ====================
bot.onText(/\/stopgame/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (gameSessions.has(userId)) {
        const session = gameSessions.get(userId);
        const gameTitles = {
            'game1': 'Tebak Perasaan',
            'game2': 'Cocokkan Kata Cinta',
            'game3': 'Truth or Dare',
            'game4': 'Tebak Tanggal',
            'game5': 'Gambar Cinta'
        };
        
        bot.sendMessage(chatId,
            `⏹️ *Game dihentikan!*\n\n` +
            `🎮 Game: ${gameTitles[session.currentGame] || 'Unknown'}\n` +
            `🏆 Score: ${session.score} poin\n\n` +
            `Main lagi kapan-kapan ya! 💝\n` +
            `Ketik /game untuk mulai baru.`,
            { parse_mode: 'Markdown' }
        );
        
        // Hapus session
        gameSessions.delete(userId);
    } else {
        bot.sendMessage(chatId, 
            `❌ Kamu tidak sedang bermain game.\n` +
            `Ketik /game untuk mulai bermain! 🎮`,
            { parse_mode: 'Markdown' }
        );
    }
});

// /score - Cek score game
bot.onText(/\/score/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const session = gameSessions.get(userId);
    if (session) {
        bot.sendMessage(chatId,
            `📊 *Score Game Saat Ini*\n\n` +
            `🎮 Game: ${session.currentGame ? session.currentGame.replace('game', 'Game ') : 'Tidak aktif'}\n` +
            `🏆 Score: ${session.score} poin\n` +
            `❓ Soal: ${session.currentQuestion + 1}\n\n` +
            `Teruskan game dengan menjawab pertanyaan! 💪`,
            { parse_mode: 'Markdown' }
        );
    } else {
        bot.sendMessage(chatId,
            `📊 *Belum ada score game*\n\n` +
            `Kamu belum memulai game.\n` +
            `Ketik /game untuk mulai bermain dan dapatkan score! 🎮`,
            { parse_mode: 'Markdown' }
        );
    }
});

// ==================== START BOT ====================
console.log("💖 GACOR BOT sedang berjalan...");
console.log("🤖 Siap membuat wanita senang dengan rayuan!");
console.log("🎮 Sistem Game: 5 game romantis interaktif");
console.log("✨ Bot Features: Rayuan, Pujian, Surat Cinta, Game Romantis");
console.log("📱 Kirim /start ke bot untuk mulai!");

// Graceful shutdown
process.once('SIGINT', () => {
    console.log("\n💤 Bot berhenti dengan manis...");
    bot.stopPolling();
    process.exit(0);
});

process.once('SIGTERM', () => {
    console.log("\n💤 Bot berhenti dengan manis...");
    bot.stopPolling();
    process.exit(0);
});