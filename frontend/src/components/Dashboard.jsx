import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Trophy, Play, Settings, Download, Upload, Flame, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import Tutorial from './Tutorial';
import { 
  getUserProgress, 
  getStreakData, 
  getXPData, 
  updateStreak,
  initializeProgress,
  exportProgress,
  importProgress
} from '../utils/sessionStorage';
import { dailyQuotes } from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [xpData, setXPData] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    initializeProgress();
    const newStreak = updateStreak();
    setProgress(getUserProgress());
    setStreakData(newStreak);
    setXPData(getXPData());

    // Random daily quote
    const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    setDailyQuote(randomQuote);

    // Check if tutorial should be shown
    const tutorialCompleted = sessionStorage.getItem('rigveda_tutorial_completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importProgress(file).then(() => {
        setProgress(getUserProgress());
        setStreakData(getStreakData());
        setXPData(getXPData());
      });
    }
  };

  if (!progress || !streakData || !xpData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const overallProgress = (progress.totalVersesLearned / 100) * 100; // Assuming ~100 verses total
  const xpProgress = (xpData.currentXP / xpData.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] via-white to-[#FFF8DC]">
      <Tutorial isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Rigveda Learning</h1>
              <p className="text-sm opacity-90 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportProgress}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <div>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport} 
                  className="hidden" 
                  id="import-file"
                />
                <label htmlFor="import-file">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('import-file').click();
                    }}
                  >
                    <Upload size={16} className="mr-2" />
                    Import
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Quote */}
        {dailyQuote && (
          <Card className="mb-8 border-2 border-[#FFD700]/30 bg-gradient-to-br from-white to-[#FFF8DC]/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="text-[#FFD700] flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-lg text-[#000080] font-semibold mb-1">{dailyQuote.sanskrit}</p>
                  <p className="text-sm text-gray-600 italic mb-2">{dailyQuote.transliteration}</p>
                  <p className="text-gray-700">{dailyQuote.meaning}</p>
                  <p className="text-xs text-gray-500 mt-2">— {dailyQuote.reference}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Streak Card */}
          <Card id="streak-counter" className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <Flame className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FF9933]">{streakData.currentStreak}</div>
                  <div className="text-xs text-gray-500">Longest: {streakData.longestStreak} days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#000080] to-blue-600 rounded-full flex items-center justify-center">
                  <Trophy className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#000080]">{xpData.currentLevel}</div>
                  <div className="text-xs text-gray-500">XP: {xpData.currentXP}/{xpData.xpToNextLevel}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verses Learned */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Verses Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-yellow-600 rounded-full flex items-center justify-center">
                  <Book className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FFD700]">{progress.totalVersesLearned}</div>
                  <div className="text-xs text-gray-500">Accuracy: {progress.accuracy}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Wheel and XP Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Wheel */}
          <Card id="progress-wheel" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#000080]">Mandala 1 Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48 mb-4">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#progress-gradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(overallProgress / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF9933" />
                        <stop offset="100%" stopColor="#FFD700" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#000080]">{Math.round(overallProgress)}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Continue your journey through the sacred hymns
                </p>
              </div>
            </CardContent>
          </Card>

          {/* XP Progress */}
          <Card id="xp-bar" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#000080]">Experience Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#000080]">Level {xpData.currentLevel}</span>
                    <span className="text-gray-600">Level {xpData.currentLevel + 1}</span>
                  </div>
                  <Progress value={xpProgress} className="h-4 bg-gray-200">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] rounded-full transition-all"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </Progress>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{xpData.currentXP} XP</span>
                    <span>{xpData.xpToNextLevel} XP</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#FFF8DC]/50 rounded-lg">
                    <span className="text-sm">Complete a lesson</span>
                    <span className="text-sm font-bold text-[#FF9933]">+30 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FFF8DC]/50 rounded-lg">
                    <span className="text-sm">Daily practice</span>
                    <span className="text-sm font-bold text-[#FF9933]">+20 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FFF8DC]/50 rounded-lg">
                    <span className="text-sm">Perfect score</span>
                    <span className="text-sm font-bold text-[#FF9933]">+50 XP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            id="today-lesson-btn"
            size="lg"
            onClick={() => navigate('/lessons')}
            className="h-24 bg-gradient-to-br from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="text-center">
              <Play className="mx-auto mb-2" size={24} />
              <div className="font-bold">Today's Lesson</div>
            </div>
          </Button>

          <Button
            id="practice-btn"
            size="lg"
            variant="outline"
            onClick={() => navigate('/practice')}
            className="h-24 border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white transition-all"
          >
            <div className="text-center">
              <Book className="mx-auto mb-2" size={24} />
              <div className="font-bold">Practice Mode</div>
            </div>
          </Button>

          <Button
            id="achievements-btn"
            size="lg"
            variant="outline"
            onClick={() => navigate('/achievements')}
            className="h-24 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-white transition-all"
          >
            <div className="text-center">
              <Trophy className="mx-auto mb-2" size={24} />
              <div className="font-bold">Achievements</div>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/quests')}
            className="h-24 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="text-center">
              <Settings className="mx-auto mb-2" size={24} />
              <div className="font-bold">Quests & Habits</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;