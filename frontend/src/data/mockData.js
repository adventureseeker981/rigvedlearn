// Mock data for Rigveda Learning App

export const hymns = [
  {
    id: 1,
    number: "1.1",
    deity: "Agni",
    title: "Invocation to Agni",
    verses: [
      {
        id: 1,
        sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्",
        transliteration: "Agnim īḷe purohitaṃ yajñasya devam ṛtvijam",
        meaning: "I praise Agni, the chosen Priest, God, minister of sacrifice",
        audio: "1.1.1"
      },
      {
        id: 2,
        sanskrit: "होतारं रत्नधातमम्",
        transliteration: "Hotāraṃ ratnadhātamam",
        meaning: "The hotar, lavishest of wealth",
        audio: "1.1.2"
      }
    ],
    lessons: [
      { id: 1, title: "Introduction to Agni", verses: [1, 2], completed: false },
      { id: 2, title: "The Sacred Fire", verses: [3, 4], completed: false }
    ],
    culturalContext: "Agni is the fire deity and messenger between mortals and gods. This hymn establishes the foundation of Vedic rituals.",
    microAction: "Light a candle mindfully and take 5 deep breaths",
    difficulty: "beginner"
  },
  {
    id: 2,
    number: "1.32",
    deity: "Indra",
    title: "Indra Slays Vritra",
    verses: [
      {
        id: 1,
        sanskrit: "इन्द्रस्य नु वीर्याणि प्र वोचं यानि चकार प्रथमानि वज्री",
        transliteration: "Indrasya nu vīryāṇi pra vocaṃ yāni cakāra prathamāni vajrī",
        meaning: "Now I shall proclaim the heroic deeds of Indra, which the wielder of the vajra performed first",
        audio: "1.32.1"
      }
    ],
    lessons: [
      { id: 1, title: "The Warrior God", verses: [1], completed: false }
    ],
    culturalContext: "Indra represents courage and the ability to overcome obstacles. The Vritra myth symbolizes breaking through barriers.",
    microAction: "Identify one obstacle today and take one action to overcome it",
    difficulty: "intermediate"
  },
  {
    id: 3,
    number: "1.25",
    deity: "Varuna",
    title: "Hymn to Varuna",
    verses: [
      {
        id: 1,
        sanskrit: "यद्वा दाशेम वरुण प्रचेता यद्वोचेम निष्फलं जीवसे अह",
        transliteration: "Yad vā dāśema varuṇa pracetā yad vocema niṣphalaṃ jīvase aha",
        meaning: "Whatever we have done against you, O Varuna, the all-knowing, may that not harm us in life",
        audio: "1.25.1"
      }
    ],
    lessons: [
      { id: 1, title: "Cosmic Order and Ethics", verses: [1], completed: false }
    ],
    culturalContext: "Varuna maintains Rita (cosmic order) and oversees ethical conduct and environmental balance.",
    microAction: "Perform a water audit - measure your daily water usage",
    difficulty: "intermediate"
  }
];

export const achievements = [
  {
    id: "first_hymn",
    title: "First Hymn Master",
    description: "Complete your first hymn",
    icon: "trophy",
    xp: 100,
    unlocked: false
  },
  {
    id: "sanskrit_scholar",
    title: "Sanskrit Scholar",
    description: "Learn 50 Sanskrit verses",
    icon: "book-open",
    xp: 200,
    unlocked: false
  },
  {
    id: "agni_devotee",
    title: "Agni Initiator",
    description: "Master all Agni hymns",
    icon: "flame",
    xp: 150,
    unlocked: false
  },
  {
    id: "weekly_warrior",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    icon: "calendar",
    xp: 100,
    unlocked: false
  },
  {
    id: "rita_keeper",
    title: "Rita Keeper",
    description: "Complete 10 ethical challenges",
    icon: "scale",
    xp: 200,
    unlocked: false
  },
  {
    id: "varuna_steward",
    title: "Varuna Steward",
    description: "Complete 5 environmental quests",
    icon: "droplet",
    xp: 150,
    unlocked: false
  },
  {
    id: "indra_solver",
    title: "Indra Solver",
    description: "Overcome 20 challenge lessons",
    icon: "zap",
    xp: 200,
    unlocked: false
  }
];

export const microActions = [
  {
    id: "gratitude_water",
    title: "Gratitude Water",
    description: "Drink 1 glass of water with gratitude",
    category: "daily",
    xp: 10
  },
  {
    id: "deep_breaths",
    title: "Mindful Breathing",
    description: "Take 5 deep breaths before tasks",
    category: "daily",
    xp: 10
  },
  {
    id: "reflection",
    title: "Daily Reflection",
    description: "Write 2 lines of reflection",
    category: "daily",
    xp: 15
  }
];

export const environmentalQuests = [
  {
    id: "water_audit",
    title: "Water Wisdom",
    description: "Track and reduce your water usage for a day",
    deity: "Varuna",
    xp: 50,
    completed: false
  },
  {
    id: "litter_walk",
    title: "Sacred Earth Walk",
    description: "Take a litter-free walk and pick up 5 pieces of trash",
    deity: "Varuna",
    xp: 50,
    completed: false
  },
  {
    id: "tree_care",
    title: "Tree Guardian",
    description: "Water or care for a tree in your neighborhood",
    deity: "Varuna",
    xp: 50,
    completed: false
  }
];

export const ethicalChallenges = [
  {
    id: "extra_change",
    title: "Honest Return",
    description: "A cashier gives you extra change. What do you do?",
    options: [
      { id: "a", text: "Keep it, they won't notice", rita: false },
      { id: "b", text: "Return it immediately", rita: true },
      { id: "c", text: "Donate it to charity", rita: true }
    ],
    xp: 30
  },
  {
    id: "plagiarism",
    title: "Academic Integrity",
    description: "You see a classmate copying in an exam. What do you do?",
    options: [
      { id: "a", text: "Ignore it", rita: false },
      { id: "b", text: "Report to the teacher", rita: true },
      { id: "c", text: "Talk to the student privately after", rita: true }
    ],
    xp: 30
  },
  {
    id: "team_credit",
    title: "Team Recognition",
    description: "Your team's work is praised but you did most of it. What do you do?",
    options: [
      { id: "a", text: "Take all the credit", rita: false },
      { id: "b", text: "Share credit with the team", rita: true },
      { id: "c", text: "Acknowledge individual contributions", rita: true }
    ],
    xp: 30
  }
];

export const dailyQuotes = [
  {
    sanskrit: "एकं सद्विप्रा बहुधा वदन्ति",
    transliteration: "Ekaṃ sad viprā bahudhā vadanti",
    meaning: "Truth is One, the wise call it by many names",
    reference: "Rigveda 1.164.46"
  },
  {
    sanskrit: "आ नो भद्राः क्रतवो यन्तु विश्वतः",
    transliteration: "Ā no bhadrāḥ kratavo yantu viśvataḥ",
    meaning: "Let noble thoughts come to us from all sides",
    reference: "Rigveda 1.89.1"
  },
  {
    sanskrit: "सत्यं वद धर्मं चर",
    transliteration: "Satyaṃ vada dharmaṃ cara",
    meaning: "Speak the truth, practice righteousness",
    reference: "Taittiriya Upanishad"
  }
];