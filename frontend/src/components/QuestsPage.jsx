import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Heart, CheckCircle, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { microActions, environmentalQuests, ethicalChallenges } from '../data/mockData';
import { getMicroActions, completeMicroAction, addXP } from '../utils/sessionStorage';
import { useToast } from '../hooks/use-toast';

const QuestsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedMicroActions, setCompletedMicroActions] = useState({});
  const [completedQuests, setCompletedQuests] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    setCompletedMicroActions(getMicroActions());
  }, []);

  const handleCompleteMicroAction = (actionId, xp) => {
    const completed = completeMicroAction(actionId);
    if (completed) {
      addXP(xp);
      setCompletedMicroActions(getMicroActions());
      toast({
        title: "Micro-Action Complete!",
        description: `You earned ${xp} XP for building a Rita-aligned habit.`
      });
    }
  };

  const handleCompleteQuest = (questId, xp) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId]);
      addXP(xp);
      toast({
        title: "Quest Complete!",
        description: `You earned ${xp} XP for completing a Varuna quest.`
      });
    }
  };

  const handleEthicalChoice = (challenge, optionId) => {
    const option = challenge.options.find(o => o.id === optionId);
    if (option.rita) {
      addXP(challenge.xp);
      toast({
        title: "Rita-Aligned Choice!",
        description: `You earned ${challenge.xp} XP for choosing the ethical path.`
      });
    } else {
      toast({
        title: "Reflect on Your Choice",
        description: "Consider how this aligns with Rita (cosmic order).",
        variant: "destructive"
      });
    }
    setSelectedChallenge(null);
  };

  const today = new Date().toDateString();
  const todayActions = completedMicroActions[today] || [];

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
          <h1 className="text-3xl font-bold">Quests & Daily Habits</h1>
          <p className="text-sm opacity-90 mt-1">Build Rita-aligned habits and complete challenges</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="micro-actions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="micro-actions">Daily Habits</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="ethical">Ethical Challenges</TabsTrigger>
          </TabsList>

          {/* Micro Actions */}
          <TabsContent value="micro-actions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-[#FF9933]" />
                  Daily Micro-Actions
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Complete {todayActions.length}/{microActions.length} actions today
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {microActions.map((action) => {
                    const completed = todayActions.includes(action.id);
                    return (
                      <Card key={action.id} className={completed ? 'bg-green-50 border-green-200' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                completed ? 'bg-green-500' : 'bg-gray-200'
                              }`}>
                                {completed ? (
                                  <CheckCircle className="text-white" size={20} />
                                ) : (
                                  <Circle className="text-gray-400" size={20} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#000080]">{action.title}</h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-[#FFD700] text-white">{action.xp} XP</Badge>
                              {!completed && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteMicroAction(action.id, action.xp)}
                                  className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environmental Quests */}
          <TabsContent value="environmental">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="text-cyan-500" />
                  Varuna's Environmental Quests
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Connect Vedic ecology to real-world climate action
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environmentalQuests.map((quest) => {
                    const completed = completedQuests.includes(quest.id);
                    return (
                      <Card key={quest.id} className={completed ? 'bg-cyan-50 border-cyan-200' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-[#000080]">{quest.title}</h4>
                                <Badge variant="outline" className="text-cyan-600 border-cyan-600">
                                  {quest.deity}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                              {completed && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                  <CheckCircle size={16} />
                                  Completed!
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <Badge className="bg-[#FFD700] text-white">{quest.xp} XP</Badge>
                              {!completed && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteQuest(quest.id, quest.xp)}
                                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ethical Challenges */}
          <TabsContent value="ethical">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#000080]">Ethical Dilemmas</CardTitle>
                <p className="text-sm text-gray-600">
                  Test your Rita-aligned decision making
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ethicalChallenges.map((challenge) => (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-[#000080]">{challenge.title}</h4>
                            <Badge className="bg-[#FFD700] text-white">{challenge.xp} XP</Badge>
                          </div>
                          <p className="text-gray-700">{challenge.description}</p>
                        </div>
                        
                        {selectedChallenge?.id === challenge.id ? (
                          <div className="space-y-2">
                            {challenge.options.map((option) => (
                              <Button
                                key={option.id}
                                variant="outline"
                                className="w-full justify-start text-left h-auto py-3"
                                onClick={() => handleEthicalChoice(challenge, option.id)}
                              >
                                {option.text}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <Button
                            onClick={() => setSelectedChallenge(challenge)}
                            className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] hover:from-[#FF9933]/90 hover:to-[#FFD700]/90 text-white"
                          >
                            Take Challenge
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestsPage;