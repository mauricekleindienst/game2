import React from 'react';
import Image from 'next/image';
import { getLevelFromXp } from '@/utils/character_util';
import { GiFishingPole, GiAxeInStump, GiCookingPot, GiMineralPearls, GiFarmer, GiAnvil } from 'react-icons/gi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SkillXP {
  name: 'Fishing' | 'Woodcutting' | 'Cooking' | 'Mining' | 'Farming' | 'Blacksmithing';
  xp: number;
}

interface CharacterLevelInfoProps {
  characterName: string;
  avatarUrl: string;
  skills: SkillXP[];
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

const skillIconMap = {
  Fishing: <GiFishingPole className="w-6 h-6 text-blue-400" />,
  Woodcutting: <GiAxeInStump className="w-6 h-6 text-green-500" />,
  Cooking: <GiCookingPot className="w-6 h-6 text-yellow-500" />,
  Mining: <GiMineralPearls className="w-6 h-6 text-purple-400" />,
  Farming: <GiFarmer className="w-6 h-6 text-rose-400" />,
  Blacksmithing: <GiAnvil className="w-6 h-6 text-gray-400" />,
};

const CharacterLevelInfo: React.FC<CharacterLevelInfoProps> = ({ 
  characterName, 
  avatarUrl, 
  skills, 
  collapsed = true, 
  onCollapseToggle 
}) => {
  const CircleProgress = ({ percent, size = 40, strokeWidth = 3, children }: { 
    percent: number; 
    size?: number;
    strokeWidth?: number;
    children: React.ReactNode 
  }) => {
    const radius = size / 2;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    
    return (
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            stroke="rgba(120, 90, 40, 0.3)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="rgba(251, 191, 36, 0.9)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              strokeDasharray: circumference + ' ' + circumference,
              strokeDashoffset
            }}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`backdrop-blur-md bg-[#18130e]/80 border border-amber-900/40 shadow-2xl rounded-2xl transition-all duration-300
        ${collapsed ? 'w-20 p-2' : 'w-80 p-6'} flex flex-col items-center relative`}
      style={{ height: 630 }}
    >
      <button
        className="absolute top-4 left-2 z-10 bg-amber-900/60 hover:bg-amber-800/80 rounded-full p-1 text-amber-200 transition-colors"
        onClick={onCollapseToggle}
        aria-label={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {collapsed ? (
        <div className="flex flex-col items-center justify-between h-full py-10">
          {skills.map((skill) => {
            const { level, progressPercent } = getLevelFromXp(skill.xp);
            return (
              <div key={skill.name} className="relative">
                <CircleProgress percent={progressPercent}>
                  <div className="w-7 h-7 flex items-center justify-center bg-amber-900/30 rounded-full shadow-inner">
                    {skillIconMap[skill.name]}
                  </div>
                </CircleProgress>
                <div className="absolute -top-1 -right-1 bg-amber-800 text-amber-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {level}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-lg overflow-hidden mb-2 bg-gradient-to-tr from-amber-700/40 to-amber-300/20">
              <Image src={avatarUrl || '/fallback-character.jpg'} alt={characterName} width={80} height={80} className="object-cover" />
            </div>
            <div className="text-xl font-bold text-amber-100 drop-shadow">{characterName}</div>
          </div>
          <div className="w-full flex flex-col gap-5">
            {skills.map((skill) => {
              const { level, currentXp, maxXp, progressPercent } = getLevelFromXp(skill.xp);
              return (
                <div key={skill.name} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-900/30 rounded-full shadow">
                    {skillIconMap[skill.name]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-100 font-semibold">{skill.name}</span>
                      <span className="text-amber-300 font-bold text-sm">Lvl {level}</span>
                    </div>
                    <div className="w-full h-2 bg-amber-900/30 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-amber-200/80 mt-1">
                      <span>{currentXp} XP</span>
                      <span>{maxXp > 0 ? `${maxXp} XP` : 'Max'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterLevelInfo;
