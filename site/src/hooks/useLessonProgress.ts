import {useCallback, useEffect, useState} from 'react';
import {playExtraLife} from '@site/src/lib/sound';

type LessonProgress = Record<string, boolean>;

function readProgress(key: string): LessonProgress {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(key: string, value: LessonProgress): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage no disponible (navegación privada, storage lleno, etc.) — se sigue sin persistir.
  }
}

/**
 * Progreso de una lección en localStorage. La lectura inicial va en un
 * useEffect (no en el render) porque Docusaurus pre-renderiza en Node,
 * donde no existe localStorage.
 */
export function useLessonProgress(lessonSlug: string, activityIds: string[]) {
  const storageKey = `akb:${lessonSlug}:v1`;
  const [done, setDone] = useState<LessonProgress>({});

  useEffect(() => {
    setDone(readProgress(storageKey));
  }, [storageKey]);

  const markDone = useCallback(
    (activityId: string) => {
      // Varias actividades de la misma lección montan su propia instancia de
      // este hook, cada una con su copia de `done` tomada al montar. Si se
      // mezclara contra esa copia vieja, la última en escribir pisaría lo que
      // hayan guardado las demás. Por eso la escritura siempre se mezcla
      // contra lo último en localStorage, no contra el estado en memoria.
      const latest = readProgress(storageKey);
      if (!latest[activityId]) {
        writeProgress(storageKey, {...latest, [activityId]: true});
        playExtraLife();
      }
      setDone((prev) => (prev[activityId] ? prev : {...prev, [activityId]: true}));
    },
    [storageKey]
  );

  const isDone = useCallback((activityId: string) => !!done[activityId], [done]);
  const completedCount = activityIds.filter((id) => done[id]).length;

  return {isDone, markDone, completedCount, total: activityIds.length};
}
