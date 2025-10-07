// Session storage utilities for progress tracking

const STORAGE_KEYS = {
  USER_PROGRESS: 'rigveda_user_progress',
  STREAK_DATA: 'rigveda_streak_data',
  ACHIEVEMENTS: 'rigveda_achievements',
  MICRO_ACTIONS: 'rigveda_micro_actions',
  QUESTS: 'rigveda_quests',
  XP_DATA: 'rigveda_xp_data'
};

// Initialize default progress
export const initializeProgress = () => {
  if (!sessionStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) {
    const defaultProgress = {
      totalVersesLearned: 0,
      hymnsCompleted: [],
      lessonsCompleted: [],
      currentLevel: 1,
      xp: 0,
      accuracy: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0
    };
    sessionStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(defaultProgress));
  }

  if (!sessionStorage.getItem(STORAGE_KEYS.STREAK_DATA)) {
    const defaultStreak = {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: new Date().toISOString(),
      streakFreezes: 2
    };
    sessionStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(defaultStreak));
  }

  if (!sessionStorage.getItem(STORAGE_KEYS.XP_DATA)) {
    const defaultXP = {
      currentXP: 0,
      currentLevel: 1,
      xpToNextLevel: 100
    };
    sessionStorage.setItem(STORAGE_KEYS.XP_DATA, JSON.stringify(defaultXP));
  }
};

// Get user progress
export const getUserProgress = () => {
  const progress = sessionStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  return progress ? JSON.parse(progress) : null;
};

// Update user progress
export const updateUserProgress = (updates) => {
  const current = getUserProgress();
  const updated = { ...current, ...updates };
  sessionStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
  return updated;
};

// Streak management
export const getStreakData = () => {
  const streak = sessionStorage.getItem(STORAGE_KEYS.STREAK_DATA);
  return streak ? JSON.parse(streak) : null;
};

export const updateStreak = () => {
  const streakData = getStreakData();
  const today = new Date().toDateString();
  const lastVisit = new Date(streakData.lastVisit).toDateString();
  
  if (today !== lastVisit) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = yesterday.toDateString() === lastVisit;
    
    const newStreak = isConsecutive ? streakData.currentStreak + 1 : 1;
    const updated = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streakData.longestStreak),
      lastVisit: new Date().toISOString()
    };
    
    sessionStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(updated));
    return updated;
  }
  
  return streakData;
};

// XP management
export const getXPData = () => {
  const xpData = sessionStorage.getItem(STORAGE_KEYS.XP_DATA);
  return xpData ? JSON.parse(xpData) : null;
};

export const addXP = (amount) => {
  const xpData = getXPData();
  let newXP = xpData.currentXP + amount;
  let newLevel = xpData.currentLevel;
  let xpToNext = xpData.xpToNextLevel;
  
  // Level up logic
  while (newXP >= xpToNext) {
    newXP -= xpToNext;
    newLevel++;
    xpToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
  }
  
  const updated = {
    currentXP: newXP,
    currentLevel: newLevel,
    xpToNextLevel: xpToNext
  };
  
  sessionStorage.setItem(STORAGE_KEYS.XP_DATA, JSON.stringify(updated));
  
  // Also update progress
  updateUserProgress({ currentLevel: newLevel, xp: xpData.currentXP + amount });
  
  return updated;
};

// Achievements
export const getAchievements = () => {
  const achievements = sessionStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  return achievements ? JSON.parse(achievements) : [];
};

export const unlockAchievement = (achievementId) => {
  const achievements = getAchievements();
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);
    sessionStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    return true;
  }
  return false;
};

// Micro actions
export const getMicroActions = () => {
  const actions = sessionStorage.getItem(STORAGE_KEYS.MICRO_ACTIONS);
  return actions ? JSON.parse(actions) : {};
};

export const completeMicroAction = (actionId) => {
  const actions = getMicroActions();
  const today = new Date().toDateString();
  
  if (!actions[today]) {
    actions[today] = [];
  }
  
  if (!actions[today].includes(actionId)) {
    actions[today].push(actionId);
    sessionStorage.setItem(STORAGE_KEYS.MICRO_ACTIONS, JSON.stringify(actions));
    return true;
  }
  
  return false;
};

// Export/Import progress
export const exportProgress = () => {
  const data = {
    progress: getUserProgress(),
    streak: getStreakData(),
    achievements: getAchievements(),
    microActions: getMicroActions(),
    xp: getXPData(),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rigveda-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importProgress = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.progress) sessionStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(data.progress));
        if (data.streak) sessionStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(data.streak));
        if (data.achievements) sessionStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
        if (data.microActions) sessionStorage.setItem(STORAGE_KEYS.MICRO_ACTIONS, JSON.stringify(data.microActions));
        if (data.xp) sessionStorage.setItem(STORAGE_KEYS.XP_DATA, JSON.stringify(data.xp));
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};