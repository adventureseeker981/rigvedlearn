import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { hymns } from '../data/mockData';
import { getUserProgress, addXP } from '../utils/sessionStorage';
import { useToast } from '../hooks/use-toast';

const PracticePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [practiceVerses, setPracticeVerses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generatePractice();
  }, []);

  const generatePractice = () => {
    const progress = getUserProgress();
    const completedLessons = progress.lessonsCompleted;

    // Get all verses from completed lessons
    const learnedVerses = [];
    completedLessons.forEach(lessonKey => {
      const [hymnId] = lessonKey.split('-');
      const hymn = hymns.find(h => h.id === parseInt(hymnId));
      if (hymn) {
        hymn.verses.forEach(verse => {
          learnedVerses.push({ ...verse, hymnTitle: hymn.title, deity: hymn.deity });
        });
      }
    });

    // Shuffle and take 5 random verses
    const shuffled = learnedVerses.sort(() => Math.random() - 0.5).slice(0, 5);
    setPracticeVerses(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore(0);
  };

  const handleNext = () => {
    if (currentIndex < practiceVerses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Practice complete
      const xpEarned = score * 5;
      addXP(xpEarned);
      toast({
        title: "Practice Complete!",
        description: `You answered ${score}/${practiceVerses.length} correctly and earned ${xpEarned} XP.`
      });
    }
  };

  const handleCorrect = () => {
    if (!showAnswer) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleIncorrect = () => {
    setShowAnswer(true);
  };

  if (practiceVerses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#000080] mb-4">No Practice Available</h2>
            <p className="text-gray-600 mb-6">
              Complete some lessons first to unlock practice mode!
            </p>
            <Button
              onClick={() => navigate('/lessons')}
              className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
            >
              Go to Lessons
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentVerse = practiceVerses[currentIndex];
  const progress = ((currentIndex + 1) / practiceVerses.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">Practice Mode</h1>
              <p className="text-sm opacity-90">Strengthen your memory with spaced repetition</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={generatePractice}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <RefreshCw size={16} className="mr-2" />
              New Set
            </Button>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <div className="flex justify-between text-xs mt-2">
            <span>Question {currentIndex + 1}/{practiceVerses.length}</span>
            <span>Score: {score}/{practiceVerses.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#000080]">
              From: {currentVerse.hymnTitle} ({currentVerse.deity})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600 mb-4">What is the meaning of this verse?</p>
              <h2 className="text-3xl font-bold text-[#000080] mb-3" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {currentVerse.sanskrit}
              </h2>
              <p className="text-lg text-gray-600 italic">
                {currentVerse.transliteration}
              </p>
            </div>

            {/* Answer */}
            {showAnswer && (
              <div className="bg-gradient-to-br from-[#FFF8DC] to-white p-6 rounded-xl border-2 border-[#FFD700]/30 mb-6">
                <h3 className="font-semibold text-[#000080] mb-2">Meaning:</h3>
                <p className="text-lg text-gray-800">{currentVerse.meaning}</p>
              </div>
            )}

            {/* Controls */}
            {!showAnswer ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleIncorrect}
                  className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  I Don't Remember
                </Button>
                <Button
                  onClick={handleCorrect}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  I Remember!
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
              >
                {currentIndex === practiceVerses.length - 1 ? 'Finish Practice' : 'Next Verse'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticePage;