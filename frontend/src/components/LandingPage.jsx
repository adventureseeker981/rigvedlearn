import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Target, Zap, Award, Flame, Droplet, Heart, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Book,
      title: "Bite-Sized Learning",
      description: "5-7 minute lessons that fit your busy schedule. Learn ancient wisdom without the lengthy PDFs."
    },
    {
      icon: Target,
      title: "Gamified Journey",
      description: "Earn XP, unlock badges, and maintain streaks. Progress through 20 levels of Vedic mastery."
    },
    {
      icon: Flame,
      title: "Deity-Focused Themes",
      description: "Learn through Agni (rituals), Indra (challenges), Varuna (ethics), and Vishnu (integration)."
    },
    {
      icon: Zap,
      title: "Interactive Challenges",
      description: "Real-world ethical scenarios and leadership dilemmas mapped to Vedic principles."
    },
    {
      icon: Droplet,
      title: "Environmental Quests",
      description: "Weekly Varuna quests connecting Vedic ecology to measurable climate action."
    },
    {
      icon: Heart,
      title: "Daily Micro-Actions",
      description: "Build Rita-aligned habits: gratitude rituals, mindful breathing, and reflection practices."
    }
  ];

  const deities = [
    { name: "Agni", desc: "Fire & Initiation", color: "from-rose-400 to-orange-500" },
    { name: "Indra", desc: "Courage & Action", color: "from-violet-400 to-purple-500" },
    { name: "Varuna", desc: "Ethics & Nature", color: "from-emerald-400 to-teal-500" },
    { name: "Vishnu", desc: "Integration & Harmony", color: "from-amber-400 to-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8DC] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/10 to-[#000080]/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <Award className="text-[#FF9933]" size={20} />
              <span className="text-sm font-medium text-[#000080]">UNESCO Heritage • Modern Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6">
              Ancient Wisdom,
              <br />
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Modern Mastery
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Learn Rigveda Mandala 1 through gamified, bite-sized lessons. 
              Transform ancient Sanskrit hymns into daily wisdom and actionable habits.
            </p>
            
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Journey
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
              <div>
                <div className="text-3xl font-bold text-teal-600">10+</div>
                <div className="text-sm text-slate-600">Sacred Hymns</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-slate-600">Bite-Sized Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-600">20</div>
                <div className="text-sm text-slate-600">Mastery Levels</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deity Theme Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Learn Through Four Divine Themes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deities.map((deity, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className={`h-32 bg-gradient-to-br ${deity.color} flex items-center justify-center`}>
                    <h3 className="text-2xl font-bold text-white">{deity.name}</h3>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-medium">{deity.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-white to-[#FFF8DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Everything You Need to Master Rigveda
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#FFD700] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#000080] mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-300">
            Built with respect for UNESCO's Memory of the World heritage.
            <br />
            Preserving ancient wisdom through modern technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;