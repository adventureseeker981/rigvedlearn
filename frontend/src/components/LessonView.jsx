import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { hymns } from '../data/mockData';
import { getUserProgress, updateUserProgress, addXP } from '../utils/sessionStorage';
import { speakSanskrit, stopSpeech } from '../utils/speechSynthesis';
import { useToast } from '../hooks/use-toast';
import MantraVisualizerPage from './MantraVisualizer';

const LessonView = () => {
  const { hymnId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  const hymn = hymns.find(h => h.id === parseInt(hymnId));
  const lesson = hymn?.lessons.find(l => l.id === parseInt(lessonId));
  const verses = lesson?.verses.map(vIndex => hymn.verses[vIndex - 1]).filter(Boolean);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  if (!hymn || !lesson || !verses) {
    return <div>Lesson not found</div>;
  }

  const currentVerse = verses[currentVerseIndex];
  const progress = (currentVerseIndex / verses.length) * 100;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakSanskrit(currentVerse.sanskrit, {
        onEnd: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          toast({
            title: "Audio Error",
            description: "Unable to play pronunciation. Please check your browser settings.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
      setShowHint(false);
      stopSpeech();
      setIsSpeaking(false);
    } else {
      completeLesson();
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
      setShowHint(false);
      stopSpeech();
      setIsSpeaking(false);
    }
  };

  const completeLesson = () => {
    const userProgress = getUserProgress();
    const lessonKey = `${hymnId}-${lessonId}`;
    
    if (!userProgress.lessonsCompleted.includes(lessonKey)) {
      const updatedProgress = updateUserProgress({
        lessonsCompleted: [...userProgress.lessonsCompleted, lessonKey],
        totalVersesLearned: userProgress.totalVersesLearned + verses.length
      });

      addXP(30);

      // Check if hymn is complete
      const allHymnLessonsCompleted = hymn.lessons.every(l => 
        updatedProgress.lessonsCompleted.includes(`${hymnId}-${l.id}`)
      );

      if (allHymnLessonsCompleted && !userProgress.hymnsCompleted.includes(hymn.id)) {
        updateUserProgress({
          hymnsCompleted: [...userProgress.hymnsCompleted, hymn.id]
        });
        addXP(50);
      }
    }

    setLessonComplete(true);
  };

  if (lessonComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white flex items-center justify-center">
        <Card className="max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#000080] mb-2">Lesson Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've earned 30 XP for completing this lesson!
            </p>
            <div className="bg-[#FFF8DC]/50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700 italic">
                "{hymn.microAction}"
              </p>
              <p className="text-xs text-[#FF9933] mt-2">Complete this micro-action today!</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/lessons')}
                className="flex-1"
              >
                Back to Lessons
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-[#000080]/90 text-white py-4 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => {
              stopSpeech();
              navigate('/lessons');
            }}
            className="text-white hover:bg-white/10 mb-2"
          >
            <ArrowLeft className="mr-2" size={18} />
            Exit Lesson
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{lesson.title}</h1>
              <p className="text-xs opacity-90">{hymn.title} • {hymn.deity}</p>
            </div>
            <Badge className="bg-white/20 text-white">
              Verse {currentVerseIndex + 1} of {verses.length}
            </Badge>
          </div>
          <Progress value={progress} className="mt-3 h-2 bg-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Sanskrit Text */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#000080]" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  {currentVerse.sanskrit}
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSpeak}
                  className={`rounded-full ${isSpeaking ? 'bg-[#FF9933] text-white' : 'hover:bg-[#FF9933]/10'}`}
                >
                  {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </Button>
              </div>

              {/* Transliteration */}
              <p className="text-lg text-gray-600 italic mb-4">
                {currentVerse.transliteration}
              </p>

              {/* Meaning */}
              <div className="bg-gradient-to-br from-[#FFF8DC] to-white p-6 rounded-xl border-2 border-[#FFD700]/30">
                <p className="text-lg text-gray-800">
                  {currentVerse.meaning}
                </p>
              </div>
            </div>

            {/* Hint Section */}
            {showHint && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Cultural Context</h4>
                    <p className="text-sm text-blue-800">{hymn.culturalContext}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="flex-1"
              >
                <Lightbulb className="mr-2" size={18} />
                {showHint ? 'Hide' : 'Show'} Hint
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentVerseIndex === 0}
                className="flex-1"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
              >
                {currentVerseIndex === verses.length - 1 ? 'Complete Lesson' : 'Next Verse'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonView;