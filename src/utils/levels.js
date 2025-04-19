
export const LEVELS = [
    { min:   0, key: "novice",    ru: "Новичок",  en: "Novice"    },
    { min:  20, key: "volunteer", ru: "Волонтёр", en: "Volunteer" },
    { min:  60, key: "activist",  ru: "Активист", en: "Activist"  },
    { min: 100, key: "leader",    ru: "Лидер",     en: "Leader"    },
  ];
  
  /**
   * Возвращает объект уровня по количеству баллов.
   * @param {number} points — количество баллов пользователя
   * @returns {{ key: string, ru: string, en: string, min: number }}
   */
  export function getLevelObject(points) {
    // Итерируем с конца, чтобы найти самый высокий порог не выше points
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].min) {
        return LEVELS[i];
      }
    }
    // На всякий случай, если points будет < 0
    return LEVELS[0];
  }
  
  /**
   * Возвращает название уровня на выбранном языке.
   * @param {number} points — очки пользователя
   * @param {"ru"|"en"} locale — язык ("ru" или "en")
   * @returns {string}
   */
  export function getLevelName(points, locale = "ru") {
    const level = getLevelObject(points);
    return locale === "en" ? level.en : level.ru;
  }
  
  /**
   * Возвращает ключ уровня (например "novice", "volunteer" и т.д.)
   * @param {number} points
   * @returns {string}
   */
  export function getLevelKey(points) {
    return getLevelObject(points).key;
  }
  