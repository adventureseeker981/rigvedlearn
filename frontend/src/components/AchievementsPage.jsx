import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, BookOpen, Flame, Calendar, Scale, Droplet, Zap, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { achievements } from '../data/mockData';
import { getAchievements, getUserProgress, getStreakData } from '../utils/sessionStorage';

const iconMap = {
  trophy: Trophy,
  'book-open': BookOpen,
  flame: Flame,
  calendar: Calendar,
  scale: Scale,
  droplet: Droplet,
  zap: Zap
};

const AchievementsPage = () => {
  const navigate = useNavigate();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    setUnlockedAchievements(getAchievements());
    setProgress(getUserProgress());
    setStreak(getStreakData());
  }, []);

  const isAchievementUnlocked = (achievement) => {
    return unlockedAchievements.includes(achievement.id);
  };

  const getAchievementProgress = (achievement) => {
    if (!progress || !streak) return 0;

    switch (achievement.id) {
      case 'first_hymn':
        return progress.hymnsCompleted.length > 0 ? 100 : 0;
      case 'sanskrit_scholar':
        return Math.min((progress.totalVersesLearned / 50) * 100, 100);
      case 'weekly_warrior':
        return Math.min((streak.currentStreak / 7) * 100, 100);
      default:
        return 0;
    }
  };

  const totalXP = achievements.reduce((sum, a) => sum + (isAchievementUnlocked(a) ? a.xp : 0), 0);
  const maxXP = achievements.reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = unlockedAchievements.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-sm opacity-90 mt-1">Unlock badges by mastering Vedic wisdom</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">{unlockedCount}/{achievements.length}</div>
              <div className="text-sm text-gray-600">Badges Unlocked</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#FF9933] mb-2">{totalXP}</div>
              <div className="text-sm text-gray-600">Total Achievement XP</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Overall Progress</div>
              <Progress value={(unlockedCount / achievements.length) * 100} className="mb-2" />
              <div className="text-xs text-gray-500 text-right">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            const unlocked = isAchievementUnlocked(achievement);
            const achievementProgress = getAchievementProgress(achievement);

            return (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-[#FFF8DC] to-white border-2 border-[#FFD700] shadow-lg'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        unlocked
                          ? 'bg-gradient-to-br from-[#FF9933] to-[#FFD700]'
                          : 'bg-gray-300'
                      }`}
                    >
                      {unlocked ? (
                        <Icon className="text-white" size={32} />
                      ) : (
                        <Lock className="text-gray-500" size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#000080] mb-1">
                        {achievement.title}
                      </CardTitle>
                      <Badge className={unlocked ? 'bg-[#FFD700] text-white' : 'bg-gray-300 text-gray-600'}>
                        {achievement.xp} XP
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  {!unlocked && achievementProgress > 0 && (
                    <div>
                      <Progress value={achievementProgress} className="h-2 mb-1" />
                      <p className="text-xs text-gray-500 text-right">
                        {Math.round(achievementProgress)}% complete
                      </p>
                    </div>
                  )}
                  {unlocked && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                      <Trophy size={16} />
                      Unlocked!
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;