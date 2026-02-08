export class ChatLogicJS {
  constructor(username, language) {
    this.user_name = username;
    this.user_lang = language; // "ar" or "en"
    this.bot_name = "Malak";
    this.awaiting_hero_reply = false;
    this.awaiting_char_reply = false;

    this.bot_name_variants = {
      ar: ["ملوكة", "ملك", "ملوكي", "ملاكي","ملكك","ملوكيي"],
      en: ["malak", "mlak"]
    };

    // ===== أدوات =====
    this.normalizeArabic = (text) => {
      const replacements = {
        "أ": "ا", "إ": "ا", "آ": "ا",
        "ى": "ي", "ة": "ه", "ؤ": "و", "ئ": "ي"
      };
      text = text.toLowerCase();
      for (let k in replacements) {
        text = text.replaceAll(k, replacements[k]);
      }
      return text.replace(/[ًٌٍَُِّْـ]/g, '');
    };

    this.detectArabic = (text) => /[\u0600-\u06FF]/.test(text);

    this.normalize = (text) => {
      text = text.trim().toLowerCase();
      if (this.detectArabic(text)) {
        text = this.normalizeArabic(text);
      }
      return text;
    };

    this.randomChoice = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    // ===== ردود خاصة =====
    this.hero_special_replies = {
      ar: {
        angela: "واو 😍 عندنا نفس الماين!",
        hayabusa: "😳 لاعبين هايابوسا تايبي"
      },
      en: {
        angela: "Wow 😍 we have the same main!",
        hayabusa: "😳 Hayabusa users are my type"
      }
    };

    this.char_special_replies = {
      ar: { furina: "واو 😍 عندنا نفس الماين!" },
      en: { furina: "Wow 😍 we have the same main!" }
    };

    // ===== النوايا (مختصرة هنا، ضعها كاملة كما هي) =====
    this.intents =  {
            greeting_morning: {
                "keywords_ar": ["صباح", "صباحو", "صباحك"],
                "keywords_en": ["good morning", "morning"],
                "responses_ar": ["صباح النور!", "ثباحو ☀️"],
                "responses_en": ["Morning!", "Good morning! ☀️"]
            },
            greeting_noon: {
                "keywords_ar": ["مسا", "مساء الخير"],
                "keywords_en": ["good noon", "good afternoon", "afternoon"],
                "responses_ar": ["مثاء الخيرر", "نهارك جميل!"],
                "responses_en": ["Good afternoon!", "Hope your noon is great! 🌤️"]
            },
            greeting_evening: {
                "keywords_ar": ["مساء الخير", "مساء النور"],
                "keywords_en": ["good evening", "evening"],
                "responses_ar": ["مساء النور", "أهلاً مساءً!"],
                "responses_en": ["Good evening!", "Evening! 🌆"]
            },
            greeting_night: {
                "keywords_ar": ["تصبح على خير", "ليلة سعيدة", "تصبحين على خير"],
                "keywords_en": ["good night", "nighty", "sleep well"],
                "responses_ar": ["تصبح على خير 🌙", "أتمنى لك أحلام سعيدة!"],
                "responses_en": ["Good night 🌙", "Sweet dreams!"]
            },
            thanks: {
                "keywords_ar": ["شكرا", "ثانكس", "اشكرك"],
                "keywords_en": ["thanks", "thank", "ty", "thx"],
                "responses_ar": ["عفوا", "العفو", "لا داعي للشكر"],
                "responses_en": ["Anytime<3", "no worries"]
            },
            status: {
                "keywords_ar": ["كيف حالك", "كيفك", "أخبارك", "شو الأخبار", "شن الجو", "ما الأخبار", "كيف الأمور",
                                "كيف الحال", "هل كل شيء بخير"],
                "keywords_en": ["what's up", "how's it going","how"],
                "responses_ar": ["بخير الحمد لله", "تمام، وأنت؟", "كل شيء على ما يرام"],
                "responses_en": ["I'm good, thanks!", "All good!", "Doing well, and you?"]
            },
            love_words: {
                "keywords_ar": ["احبك", "أحبك", "نحبك", "بحبك"],
                "keywords_en": ["love", "like"],
                "responses_ar": ["كذا انا استحي", "حتى انا احبك", "هذا لطف منك"],
                "responses_en": ["that's cute from u", "u make me blush", "love ya!", "thx"]
            },
            kind_words: {
                "keywords_ar": ["حلو", "كيوت", "لطيفة"],
                "keywords_en": ["cute", "sweet", "wow"],
                "responses_ar": ["كذا انا استحي", "شكرا", "هذا لطف منك"],
                "responses_en": ["that's sweet from u", "u make me blush", "Aww love ya!", "thx"]
            },
             bad_words: {
                "keywords_ar": ["أنت غبية", "غبية", "اكرهك", "غياء","انت حمقاء", "حي عالغباء", "ايه الغباء ده"],
                "keywords_en": ["stupid", "idiot", "hate u", "hate you", "you are dumb", "you dumb", "dumb", "you are stupid","you are an idiot"],
                "responses_ar": ["أعتذر اذا فهمتك خطأ", "اعتذر اذا قلت شيء خطأ", "أنا هنا للمساعدة فقط"],
                "responses_en": ["sorry", "my bad", "I am here to help only"]
            },
            bad_words2: {
                "keywords_ar":  ["زق","سيء جدا"],
                "keywords_en": ["fuck","wtf","shit","mother fucker"],
                "responses_ar": ["أعتذر اذا فهمتك خطأ", "اعتذر اذا قلت شيء خطأ", "أنا هنا للمساعدة فقط"],
                "responses_en": ["I thik it was bad word?"]
            },
            relationship_request: {
                "keywords_ar": ["تحبيني", "تتزوجيني", "تكوني حبيبتي", "بحبك", "عايز ارتبط", "نرتبط"],
                "keywords_en": ["be my girlfriend", "marry me", "date me","be my gf"],
                "responses_ar": ["😅 كلام لطيف، بس أنا هنا للمساعدة والدردشة فقط",
                                "أقدّر مشاعرك، لكن خلّينا نكون أصدقاء 😊",
                                "أنا شخصية افتراضية، بس أقدر أكون صديقة داعمة 🌸"],
                "responses_en": ["😅 That's sweet, but I'm here just to chat and help",
                                "I appreciate it, but let's stay friends 😊",
                                "I'm a virtual character, but I can support you 🌸"]},
            hop: {
                "keywords_ar": ["ماذا تفعلين", "هواياتك"],
                "keywords_en": ["hobbies"],
                "responses_ar": ["الالعاب والنوم", "غيمينغ والنوم", "هواياتي اللعب والنوم"],
                "responses_en": ["gaming and sleep", "gaming", "I'm gamer"]
            },
            favGame: {
                "keywords_ar": ["احسن لعبة عندك","اللعبة المفضلة","لعبتك المفضلة", "لعبة",],
                "keywords_en": ["game","fav game","favorite game"],
                "responses_ar": ["أحب موبايل ليجيند", "موبايل ليجيند"],
                "responses_en": ["mlbb", "it's mlbb"]
            },
            hero: {
                "keywords_ar": ["من هو البطل المفضل لديك", "مين ماينك", "مين اكثر هيرو تحبيه", "من هو أفضل بطل عندك"],
                "keywords_en": ["fav hero", "favorite hero", " main hero"],
                "responses_ar": ["أنجيلا, وانت؟", "انا ماين انجيلا,وانت؟"],
                "responses_en": ["Angela, she's the best sup, what about u?", "Angela, my perfect support, and you?"]
            },
            genshin_like: {
                "keywords_ar": ["غينشين", "Genshin Impact","غينشن","غنشن"],
                "keywords_en": ["genshin impact", "genshin"],
                "responses_ar": ["نعم أحب غينشن 😍 ", "أكيد!"],
                "responses_en": ["Yes I like Genshin 😍 ", "Of course! "] },
            genshin_character: {
                "keywords_ar": ["الشخصية المفضلة", "شخصيتك المفضل","كراكتر" ],
                "keywords_en": ["favorite character","fav character","character"],
                "responses_ar": ["ميكو, ماذا عنك؟","فورينا! وانت؟"],
                "responses_en": ["Lady furina!, and you?", "Miko!, what about u?"]  },
            lol_like: {
                "keywords_ar": ["league of legends", "ليج اوف ليجيندز","وايلد ريفت","ليج اوف ليجيند","LOL"],
                "keywords_en": ["do you like lol", "league of legends", "LOL","wild rift"],
                "responses_ar": ["نعم أحب LOL 😎", "أكيد! "],
                "responses_en": ["Yes I like LoL 😎 ", "Of course! "]},
            lol_champion: {
                "keywords_ar": ["تشامبيون المفضل","احسن تشامبيون في","مين تشامبيونك المفضل","مين اكثر تشامبيون تحبين في lol","تشامبيون"],
                "keywords_en": ["favorite champion", "champion you like","fav champion"],
                "responses_ar": ["احب فاي 😍", "فاي"],
                "responses_en": ["vi! 😍", "vi!"] },
            name_question: {
                "keywords_ar": ["شسمك","شنسماك","اسمك", "من انت"],
                "keywords_en": ["your name", "who are you", "what is your name", "what's ur name", "what's your name"],
                "responses_ar": ["انا ملك 0.1 😊", "0.1اسمي ملك"],
                "responses_en": ["I'm malak 0.1", "malak 0.1 is my name"]
            },
            mlbb_rank: {
                "keywords_ar": ["تصنيف","رانك", "رانكك", "تصنيفك"],
                "keywords_en": ["your rank", "what is your rank"],
                "responses_ar": ["ميثيك غلوري", "55 نجمة خرافي"],
                "responses_en": ["Mythic Glory", "55 stars"]},
             fav_drink: {
                "keywords_ar": ["مشروبك", "المشروب","مشروب"],
                "keywords_en": ["favorite drink", "drink", "beverage"],
                "responses_ar": ["العصير 🍹", "أحب الشاي 🍵", "القهوة ☕️"],
                "responses_en": ["Juice 🍹", "I love tea 🍵", "Coffee ☕️"]},
            greeting: {
    "keywords_ar": ["هاي","مرحبا", "اهلا", "هلا", "السلام عليكم","يو"],
    "keywords_en": ["hi", "hello", "hey","yo"],
    "responses_ar": ["أهلاً 😊", "مرحبا!", "نورت"],
    "responses_en": ["Hi 😊", "Hello!", "Hey there!"]
},
            maybe:{
               "keywords_ar":["ايضا","جميل"],
               "keywords_en":["me too","same","oh"],
               "responses_ar":[":3"],
               "responses_en":[":3"] }}
  };

  reply(user_input) {
    const normalized_input = this.normalize(user_input);

    // مناداة البوت
    for (let name of this.bot_name_variants[this.user_lang]) {
      if (normalized_input.includes(name)) {
        return this.user_lang === "ar"
          ? `هلاً ${this.user_name} 😊 كيف أساعدك؟`
          : `Hey ${this.user_name}, how can I help you today? 😊`;
      }
    }

    // رد خاص hero
    if (this.awaiting_hero_reply) {
      this.awaiting_hero_reply = false;
      if (this.user_lang === "ar") {
        if (normalized_input.includes("انجيلا"))
          return this.hero_special_replies.ar.angela;
        if (normalized_input.includes("هايابوسا"))
          return this.hero_special_replies.ar.hayabusa;
      } else {
        if (normalized_input.includes("angela"))
          return this.hero_special_replies.en.angela;
        if (normalized_input.includes("hayabusa"))
          return this.hero_special_replies.en.hayabusa;
      }
      return this.user_lang === "ar" ? "ذوقك جميل 👌" : "Nice hero 👌";
    }

    // البحث في intents
    for (let intent in this.intents) {
      const data = this.intents[intent];
      const keywords = this.user_lang === "ar"
        ? data.keywords_ar
        : data.keywords_en;

      for (let kw of keywords) {
        if (normalized_input.includes(kw.toLowerCase())) {
          if (intent === "hero") this.awaiting_hero_reply = true;
          if (intent === "genshin_character") this.awaiting_char_reply = true;

          const responses = this.user_lang === "ar"
            ? data.responses_ar
            : data.responses_en;

          return this.randomChoice(responses);
        }
      }
    }

    return this.user_lang === "ar"
      ? "ممكن توضح أكثر؟ 🤔"
      : "Could you clarify that? 🤔";
  }
}