import confetti from 'canvas-confetti';

export const triggerSaleCelebration = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#3B82F6'],
    });
  } catch (e) {
    // Ignore in non-browser
  }
};

export const triggerLevelUpCelebration = () => {
  try {
    const end = Date.now() + 1000;
    const colors = ['#F59E0B', '#10B981', '#6366F1'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // Ignore in non-browser
  }
};
