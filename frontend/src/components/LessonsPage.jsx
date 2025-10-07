import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Circle, Book } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { hymns } from '../data/mockData';
import { getUserProgress, initializeProgress } from '../utils/sessionStorage';

const LessonsPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);

  useEffect(() => {
    initializeProgress();
    setProgress(getUserProgress());
  }, []);

  const isHymnUnlocked = (hymnIndex) => {
    if (!progress) return hymnIndex === 0;
    return hymnIndex === 0 || progress.hymnsCompleted.includes(hymns[hymnIndex - 1].id);
  };

  if (!progress) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleStartLesson = (hymn, lesson) => {
    navigate(`/lesson/${hymn.id}/${lesson.id}`);
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const deityColors = {
    Agni: 'from-rose-500 to-orange-500',
    Indra: 'from-violet-500 to-purple-500',
    Varuna: 'from-emerald-500 to-teal-500',
    Vishnu: 'from-amber-500 to-yellow-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Learning Path</h1>
          <p className="text-sm opacity-90 mt-1">Choose a hymn to begin your journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hymns List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Hymns</h2>
            <div className="space-y-3">
              {hymns.map((hymn, index) => {
                const unlocked = isHymnUnlocked(index);
                const completed = progress.hymnsCompleted.includes(hymn.id);
                
                return (
                  <Card
                    key={hymn.id}
                    className={`cursor-pointer transition-all ${
                      selectedHymn?.id === hymn.id ? 'ring-2 ring-[#FF9933]' : ''
                    } ${!unlocked ? 'opacity-50' : 'hover:shadow-lg'}`}
                    onClick={() => unlocked && setSelectedHymn(hymn)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${deityColors[hymn.deity]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm">{hymn.number}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800 truncate">{hymn.title}</h3>
                            {!unlocked && <Lock size={14} className="text-gray-400" />}
                            {completed && <CheckCircle size={14} className="text-green-500" />}
                          </div>
                          <p className="text-xs text-gray-600">{hymn.deity}</p>
                          <Badge className={`text-xs mt-1 ${difficultyColors[hymn.difficulty]}`}>
                            {hymn.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Hymn Details */}
          <div className="lg:col-span-2">
            {selectedHymn ? (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${deityColors[selectedHymn.deity]} rounded-xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{selectedHymn.number}</span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-800 mb-2">{selectedHymn.title}</CardTitle>
                        <p className="text-sm text-gray-600">Dedicated to {selectedHymn.deity}</p>
                        <Badge className={`text-xs mt-2 ${difficultyColors[selectedHymn.difficulty]}`}>
                          {selectedHymn.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Cultural Context</h4>
                        <p className="text-slate-700">{selectedHymn.culturalContext}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-teal-700 mb-2">Today's Micro-Action</h4>
                        <p className="text-slate-700">{selectedHymn.microAction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lessons */}
                <h3 className="text-xl font-bold text-slate-800 mb-4">Lessons</h3>
                <div className="space-y-3">
                  {selectedHymn.lessons.map((lesson, index) => {
                    const lessonCompleted = progress.lessonsCompleted.includes(`${selectedHymn.id}-${lesson.id}`);
                    const previousCompleted = index === 0 || progress.lessonsCompleted.includes(`${selectedHymn.id}-${selectedHymn.lessons[index - 1].id}`);
                    const canStart = index === 0 || previousCompleted;

                    return (
                      <Card
                        key={lesson.id}
                        className={`${canStart ? 'hover:shadow-lg' : 'opacity-50'} transition-all`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                lessonCompleted ? 'bg-green-500' : 'bg-gray-200'
                              }`}>
                                {lessonCompleted ? (
                                  <CheckCircle className="text-white" size={20} />
                                ) : (
                                  <Circle className="text-gray-400" size={20} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#000080]">{lesson.title}</h4>
                                <p className="text-xs text-gray-500">{lesson.verses.length} verses • ~5 min</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleStartLesson(selectedHymn, lesson)}
                              disabled={!canStart}
                              className={`${
                                lessonCompleted
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white'
                              }`}
                            >
                              {lessonCompleted ? 'Review' : 'Start'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Book className="mx-auto mb-4 text-gray-300" size={64} />
                  <p>Select a hymn to view lessons</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;