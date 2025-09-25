import { useEffect, useState } from "react";
import { Star, Heart, Trophy, Sparkles } from "lucide-react";

const rewardEmojis = ["⭐", "❤️", "🎉", "🎊", "✨", "🌟", "💫", "🦄", "🎈"];
const rewardIcons = [Star, Heart, Trophy, Sparkles];

interface RewardItem {
  id: number;
  type: 'emoji' | 'icon';
  content: string | typeof Star;
  x: number;
  y: number;
  delay: number;
}

export const RewardAnimation = () => {
  const [rewards, setRewards] = useState<RewardItem[]>([]);

  useEffect(() => {
    const newRewards: RewardItem[] = [];
    
    // Gerar 8-12 elementos de recompensa
    const count = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < count; i++) {
      const isEmoji = Math.random() > 0.5;
      newRewards.push({
        id: i,
        type: isEmoji ? 'emoji' : 'icon',
        content: isEmoji 
          ? rewardEmojis[Math.floor(Math.random() * rewardEmojis.length)]
          : rewardIcons[Math.floor(Math.random() * rewardIcons.length)],
        x: Math.random() * 80 + 10, // 10% a 90% da largura
        y: Math.random() * 60 + 20, // 20% a 80% da altura
        delay: Math.random() * 1000, // Delay até 1 segundo
      });
    }
    
    setRewards(newRewards);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="absolute animate-float-reward"
          style={{
            left: `${reward.x}%`,
            top: `${reward.y}%`,
            animationDelay: `${reward.delay}ms`,
          }}
        >
          {reward.type === 'emoji' ? (
            <span className="text-3xl animate-bounce-star">
              {reward.content as string}
            </span>
          ) : (
            (() => {
              const IconComponent = reward.content as typeof Star;
              return (
                <IconComponent className="w-8 h-8 text-yellow-400 animate-heart-pulse" />
              );
            })()
          )}
        </div>
      ))}
    </div>
  );
};