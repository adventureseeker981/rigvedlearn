import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { speakSanskrit, stopSpeech } from '../utils/speechSynthesis';

const MantraVisualizer = ({ sanskrit, transliteration, isPlaying, onTogglePlay, audioLevel = 0 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2);
      gradient.addColorStop(0, 'rgba(255, 153, 51, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 128, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        setPhase(p => p + 0.02);
      }

      // Audio reactivity - scale based on audio level
      const reactiveScale = 1 + (audioLevel * 0.5);
      const reactiveIntensity = audioLevel * 2;

      // Draw Sri Yantra inspired sacred geometry
      drawSriYantra(ctx, centerX, centerY, 150 * reactiveScale, phase, reactiveIntensity);
      
      // Draw mandala patterns
      drawMandala(ctx, centerX, centerY, 200, phase, reactiveIntensity);
      
      // Draw lotus petals
      drawLotus(ctx, centerX, centerY, 180 * reactiveScale, phase, reactiveIntensity);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, phase]);

  // Sri Yantra triangles
  const drawSriYantra = (ctx, x, y, size, phase, audioIntensity = 0) => {
    const triangles = 9;
    
    for (let i = 0; i < triangles; i++) {
      const rotation = (i * Math.PI * 2 / triangles) + phase;
      const scale = 1 + Math.sin(phase * 2 + i) * 0.1 + (audioIntensity * 0.3);
      const alpha = 0.3 + Math.sin(phase + i) * 0.2 + (audioIntensity * 0.3);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      gradient.addColorStop(0, `rgba(255, 153, 51, ${alpha})`);
      gradient.addColorStop(1, `rgba(255, 215, 0, ${alpha})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    }
  };

  // Mandala patterns
  const drawMandala = (ctx, x, y, radius, phase, audioIntensity = 0) => {
    const petals = 12;
    
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = (radius - (layer * 30)) * (1 + audioIntensity * 0.2);
      
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2 / petals) + phase + (layer * 0.5);
        const petalX = x + Math.cos(angle) * layerRadius;
        const petalY = y + Math.sin(angle) * layerRadius;
        const petalSize = (20 - (layer * 5)) * (1 + audioIntensity * 0.5);
        const alpha = 0.2 + Math.sin(phase * 2 + i + layer) * 0.15 + (audioIntensity * 0.4);
        
        ctx.beginPath();
        ctx.arc(petalX, petalY, petalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 128, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 1.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  // Lotus petals
  const drawLotus = (ctx, x, y, radius, phase) => {
    const petals = 8;
    
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2 / petals) + phase * 0.5;
      const scale = 1 + Math.sin(phase * 3 + i) * 0.15;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -30 * scale, -radius * 0.6,
        -20 * scale, -radius * scale,
        0, -radius * scale
      );
      ctx.bezierCurveTo(
        20 * scale, -radius * scale,
        30 * scale, -radius * 0.6,
        0, 0
      );
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, -radius * scale);
      gradient.addColorStop(0, 'rgba(255, 153, 51, 0.3)');
      gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 153, 51, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Center Om symbol circle
    const centerSize = 30 + Math.sin(phase * 2) * 5;
    ctx.beginPath();
    ctx.arc(x, y, centerSize, 0, Math.PI * 2);
    const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, centerSize);
    centerGradient.addColorStop(0, 'rgba(255, 153, 51, 0.8)');
    centerGradient.addColorStop(1, 'rgba(255, 215, 0, 0.4)');
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Om symbol
    ctx.font = 'bold 24px serif';
    ctx.fillStyle = 'rgba(0, 0, 128, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', x, y);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-auto rounded-xl"
      />
      
      {/* Sanskrit text overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-8">
          <div 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ 
              fontFamily: 'Noto Sans Devanagari, sans-serif',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 153, 51, 0.5)',
              color: 'rgba(0, 0, 128, 0.9)'
            }}
          >
            {sanskrit}
          </div>
          <div 
            className="text-sm md:text-base italic"
            style={{ 
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              color: 'rgba(0, 0, 128, 0.7)'
            }}
          >
            {transliteration}
          </div>
        </div>
      </div>
    </div>
  );
};

const MantraVisualizerPage = ({ verse, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
    return () => {
      stopSpeech();
      setIsPlaying(false);
    };
  }, []);

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakSanskrit(verse.sanskrit, {
        rate: 0.6,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const handleToggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-[#FFF8DC] to-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#000080]">Mantra Visualizer</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <MantraVisualizer
            sanskrit={verse.sanskrit}
            transliteration={verse.transliteration}
            isPlaying={isPlaying}
            onTogglePlay={handleToggleAnimation}
          />

          <div className="mt-6 p-4 bg-gradient-to-br from-white to-[#FFF8DC]/50 rounded-lg">
            <p className="text-gray-800 text-center mb-4">{verse.meaning}</p>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleToggleAudio}
                className={`${
                  isSpeaking
                    ? 'bg-gradient-to-r from-orange-500 to-red-600'
                    : 'bg-gradient-to-r from-[#FF9933] to-[#FFD700]'
                } hover:opacity-90 text-white`}
              >
                {isSpeaking ? <VolumeX className="mr-2" size={18} /> : <Volume2 className="mr-2" size={18} />}
                {isSpeaking ? 'Stop Audio' : 'Play Audio'}
              </Button>

              <Button
                onClick={handleToggleAnimation}
                variant="outline"
                className="border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
              >
                {isPlaying ? <Pause className="mr-2" size={18} /> : <Play className="mr-2" size={18} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Sacred geometry visualization based on Sri Yantra and Mandala patterns
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MantraVisualizerPage;