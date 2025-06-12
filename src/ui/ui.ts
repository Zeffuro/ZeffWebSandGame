import { ParticleTypes, type ParticleType, COLORS } from "../core/particle";

type ScaleChangeCallback = (scale: number) => void;
type BrushSizeChangeCallback = (size: number) => void;
type ParticleTypeChangeCallback = (type: ParticleType) => void;

export function setupUI(
  onScaleChange: ScaleChangeCallback,
  onBrushSizeChange: BrushSizeChangeCallback,
  onParticleTypeChange: ParticleTypeChangeCallback
){
  let currentParticleType: ParticleType = ParticleTypes.Sand;
  let currentBrushSize: number = 1;

  function setActiveButton(buttonIdPrefix: string, activeValue: number | ParticleType) {
    const buttons = document.querySelectorAll<HTMLButtonElement>(`[data-button-group="${buttonIdPrefix}"]`);

    buttons.forEach(button => {
      button.classList.remove('active');

      button.style.backgroundColor = '';
      button.style.borderColor = '';
      button.style.color = '';

      let shouldBeActive = false;
      if (buttonIdPrefix === 'particle') {
        if (Number(button.getAttribute('data-particle-type')) === activeValue) {
          shouldBeActive = true;
        }
      } else {
        const valueInId = parseInt(button.id.replace(buttonIdPrefix, ''), 10);
        if (valueInId === activeValue) {
          shouldBeActive = true;
        }
      }

      if (shouldBeActive) {
        button.classList.add('active');

        if (buttonIdPrefix === 'particle') {
          const materialColor = COLORS[activeValue as ParticleType];
          const rgbColor = `rgb(${materialColor[0]}, ${materialColor[1]}, ${materialColor[2]})`;
          button.style.backgroundColor = rgbColor;
          button.style.borderColor = rgbColor;

          const luminance = (materialColor[0] * 0.299 + materialColor[1] * 0.587 + materialColor[2] * 0.114);
          button.style.color = luminance > 186 ? '#000' : '#fff';
        }
      }
    });
  }

  const scaleButtonsConfig = [
    { id: 'scale1', value: 1 },
    { id: 'scale2', value: 2 },
    { id: 'scale4', value: 4 },
  ];

  scaleButtonsConfig.forEach(({ id, value }) => {
    const button = document.getElementById(id) as HTMLButtonElement | null;
    if (button) {
      button.setAttribute('data-button-group', 'scale');
      button.addEventListener('click', () => {
        onScaleChange(value);
        setActiveButton('scale', value);
      });
    }
  });

  const brushButtonsConfig = [
    { id: 'brush1', value: 1 },
    { id: 'brush3', value: 3 },
    { id: 'brush5', value: 5 },
  ];

  brushButtonsConfig.forEach(({ id, value }) => {
    const button = document.getElementById(id) as HTMLButtonElement | null;
    if (button) {
      button.setAttribute('data-button-group', 'brush');
      button.addEventListener('click', () => {
        currentBrushSize = value;
        onBrushSizeChange(value);
        setActiveButton('brush', value);
      });
    }
  });

  const materialButtonsContainer = document.getElementById('materialButtons');

  if (materialButtonsContainer) {
    materialButtonsContainer.innerHTML = '';

    const particleTypeNames = Object.keys(ParticleTypes).filter(key =>
      isNaN(Number(key)) && key !== 'Empty'
    );

    particleTypeNames.forEach(typeName => {
      const typeValue = ParticleTypes[typeName as keyof typeof ParticleTypes];
      const color = COLORS[typeValue];

      const button = document.createElement('button') as HTMLButtonElement;
      button.textContent = typeName;

      button.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      button.style.padding = '8px 10px';
      button.style.fontSize = '1em';

      button.setAttribute('data-button-group', 'particle');
      button.setAttribute('data-particle-type', String(typeValue));

      button.addEventListener('click', () => {
        currentParticleType = typeValue;
        onParticleTypeChange(typeValue);
        setActiveButton('particle', typeValue);

        setActiveButton('brush', currentBrushSize);
        const activeScaleElement = document.querySelector<HTMLButtonElement>('#scaleButtons [data-button-group="scale"].active');
        if (activeScaleElement) {
            const activeScaleValue = parseInt(activeScaleElement.id.replace('scale',''), 10);
            setActiveButton('scale', activeScaleValue);
        } else {
            setActiveButton('scale', 1);
        }
      });

      materialButtonsContainer.appendChild(button);
    });

    const eraserButton = document.createElement('button') as HTMLButtonElement;
    eraserButton.textContent = 'Eraser';
    eraserButton.style.color = '#fff';
    eraserButton.setAttribute('data-button-group', 'particle');
    eraserButton.setAttribute('data-particle-type', String(ParticleTypes.Empty));
    eraserButton.addEventListener('click', () => {
      currentParticleType = ParticleTypes.Empty;
      onParticleTypeChange(ParticleTypes.Empty);
      setActiveButton('particle', ParticleTypes.Empty);
      setActiveButton('brush', currentBrushSize);
      const activeScaleElement = document.querySelector<HTMLButtonElement>('#scaleButtons [data-button-group="scale"].active');
      if (activeScaleElement) {
          const activeScaleValue = parseInt(activeScaleElement.id.replace('scale',''), 10);
          setActiveButton('scale', activeScaleValue);
      } else {
          setActiveButton('scale', 1);
      }
    });
    materialButtonsContainer.appendChild(eraserButton);

    setActiveButton('particle', currentParticleType);
    setActiveButton('brush', currentBrushSize);
    setActiveButton('scale', 1);
    onParticleTypeChange(currentParticleType);
  }
}