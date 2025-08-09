import { monster1Images } from './monsters/monster1/images';
import { monster2Images } from './monsters/monster2/images';
import { monster3Images } from './monsters/monster3/images';
import { monster4Images } from './monsters/monster4/images';
import { monster5Images } from './monsters/monster5/images';
import { monster6Images } from './monsters/monster6/images';

export function getMonsterImageByLevel(monsterId, level) {
  switch (monsterId) {
    case 'monster1':
      if (level === 1) return monster1Images[1];
      if (level >= 2 && level <= 3) return monster1Images[2];
      if (level >= 4 && level <= 6) return monster1Images[4];
      if (level >= 7 && level <= 14) return monster1Images[7];
      if (level >= 15) return monster1Images[15];
      return monster1Images[1];
    case 'monster2':
      if (level === 1) return monster2Images[1];
      if (level >= 2 && level <= 3) return monster2Images[2];
      if (level >= 4 && level <= 6) return monster2Images[4];
      if (level >= 7 && level <= 14) return monster2Images[7];
      if (level >= 15) return monster2Images[15];
      return monster2Images[2];
    case 'monster3':
      if (level === 1) return monster3Images[1];
      if (level >= 2 && level <= 3) return monster3Images[2];
      if (level >= 4 && level <= 6) return monster3Images[4];
      if (level >= 7 && level <= 14) return monster3Images[7];
      if (level >= 15) return monster3Images[15];
      return monster3Images[3];
    case 'monster4':
      if (level === 1) return monster4Images[1];
      if (level >= 2 && level <= 3) return monster4Images[2];
      if (level >= 4 && level <= 6) return monster4Images[4];
      if (level >= 7 && level <= 14) return monster4Images[7];
      if (level >= 15) return monster4Images[15];
      return monster4Images[4];
    case 'monster5':
      if (level === 1) return monster5Images[1];
      if (level >= 2 && level <= 3) return monster5Images[2];
      if (level >= 4 && level <= 6) return monster5Images[4];
      if (level >= 7 && level <= 14) return monster5Images[7];
      if (level >= 15) return monster5Images[15];
      return monster5Images[5];
    case 'monster6':
      if (level === 1) return monster6Images[1];
      if (level >= 2 && level <= 3) return monster6Images[2];
      if (level >= 4 && level <= 6) return monster6Images[4];
      if (level >= 7 && level <= 14) return monster6Images[7];
      if (level >= 15) return monster6Images[15];
      return monster6Images[6];

    default:
      return null;
  }
}
