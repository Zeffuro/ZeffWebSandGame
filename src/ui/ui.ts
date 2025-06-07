import { ParticleTypes, type ParticleType } from "../core/particle";

type ScaleChangeCallback = (scale: number) => void;
type BrushSizeChangeCallback = (size: number) => void;
type ParticleTypeChangeCallback = (type: ParticleType) => void;

export function setupUI(
  onScaleChange: ScaleChangeCallback,
  onBrushSizeChange: BrushSizeChangeCallback,
  onParticleTypeChange: ParticleTypeChangeCallback
){
  function setActiveButton(buttonIdPrefix: string, activeValue: number | ParticleType) {
    const buttons = document.querySelectorAll(`[id^="${buttonIdPrefix}"]`);
    buttons.forEach(button => {
      button.classList.remove('active');
      let value: number | ParticleType;
      if (buttonIdPrefix === 'particle') {
        const typeName = button.id.replace(buttonIdPrefix, '').toLowerCase();
        value = ParticleTypes[typeName.charAt(0).toUpperCase() + typeName.slice(1) as keyof typeof ParticleTypes];
      } else {
        value = parseInt(button.id.replace(buttonIdPrefix, ''), 10);
      }

      if (value === activeValue) {
        button.classList.add('active');
      }
    });
  }

  const scaleButtons = [
    { id: 'scale1', value: 1 },
    { id: 'scale2', value: 2 },
    { id: 'scale4', value: 4 },
  ];

  scaleButtons.forEach(({ id, value }) => {
    document.getElementById(id)?.addEventListener('click', () => {
      onScaleChange(value);
      setActiveButton('scale', value);
    });
  });

  setActiveButton('scale', 2); 

  const brushButtons = [
    { id: 'brush1', value: 1 },
    { id: 'brush3', value: 3 },
    { id: 'brush5', value: 5 },
  ];

  brushButtons.forEach(({ id, value }) => {
    document.getElementById(id)?.addEventListener('click', () => {
      onBrushSizeChange(value);
      setActiveButton('brush', value);
    });
  });

  setActiveButton('brush', 1);

  const particleButtons = [
    { id: 'particleSand', type: ParticleTypes.Sand },
    { id: 'particleWater', type: ParticleTypes.Water },
    { id: 'particleStone', type: ParticleTypes.Stone },
    { id: 'particleEmpty', type: ParticleTypes.Empty },
  ];

  particleButtons.forEach(({ id, type }) => {
    document.getElementById(id)?.addEventListener('click', () => {
      onParticleTypeChange(type);
      setActiveButton('particle', type);
    });
  });
  setActiveButton('particle', ParticleTypes.Sand);
}