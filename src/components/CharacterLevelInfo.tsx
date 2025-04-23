import React from 'react';
import Image from 'next/image';
import { getLevelFromXp } from '@/utils/character_util';
import { GiFishingPole, GiAxeInStump, GiCookingPot, GiMineralPearls, GiFarmer, GiAnvil } from 'react-icons/gi';

interface SkillXP {
  name: 'Fishing' | 'Woodcutting' | 'Cooking' | 'Mining' | 'Farming' | 'Blacksmithing';

  xp: number;
}

interface CharacterLevelInfoProps {
  characterName: string;
  avatarUrl: string;
  skills: SkillXP[];
}

const skillIconMap = {
  Fishing: <GiFishingPole className="w-6 h-6 text-blue-400" />,
  Woodcutting: <GiAxeInStump className="w-6 h-6 text-green-500" />,
  Cooking: <GiCookingPot className="w-6 h-6 text-yellow-500" />,
  Mining: <GiMineralPearls className="w-6 h-6 text-purple-400" />,
  Farming: <GiFarmer className="w-6 h-6 text-rose-400" />,
  Blacksmithing: <GiAnvil className="w-6 h-6 text-gray-400" />,
};

const CharacterLevelInfo: React.FC<CharacterLevelInfoProps> = ({ characterName, avatarUrl, skills }) => {
  return (
    <div className="w-72 bg-[#18130e]/90 rounded-2xl shadow-xl border border-amber-900/40 p-5 flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-700 mb-2">
        <Image src={avatarUrl || '/fallback-character.jpg'} alt={characterName} width={80} height={80} className="object-cover" />
      </div>
      <div className="text-xl font-bold text-amber-200 mb-2 text-center">{characterName}</div>
      <div className="w-full flex flex-col gap-3">
        {skills.map((skill) => {
          const { level, currentXp, maxXp, progressPercent } = getLevelFromXp(skill.xp);
          return (
            <div key={skill.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {skillIconMap[skill.name]}
                  <span className="text-amber-100 font-semibold text-base">{skill.name}</span>
                </div>
                <span className="text-amber-300 font-bold text-sm">Lvl {level}</span>
              </div>
              <div className="w-full h-3 bg-amber-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-amber-200/80">
                <span>{currentXp} XP</span>
                <span>{maxXp > 0 ? `${maxXp} XP` : 'Max'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterLevelInfo;
