function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSigil(seed: string): string {
  const h = hashString(seed || "0");
  const rnd = seededRandom(h);

  const cx = 100;
  const cy = 100;

  const ringCount = 2 + Math.floor(rnd() * 3);
  const outerRadius = 96;
  const radiatingCount = 6 + Math.floor(rnd() * 7);
  const polygonSides = [3, 4, 5, 6, 8][Math.floor(rnd() * 5)];
  const innerShape = Math.floor(rnd() * 3);
  const outerRotation = Math.floor(rnd() * 360);
  const innerRotation = Math.floor(rnd() * 360);
  const pulseDuration = 8 + Math.floor(rnd() * 13);

  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" style="display:block">`
  );

  parts.push(`<defs>`);
  parts.push(
    `<filter id="sigilGlow-${h % 10000}" x="-50%" y="-50%" width="200%" height="200%">` +
      `<feGaussianBlur stdDeviation="2" result="blur"/>` +
      `<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>` +
      `</filter>`
  );
  parts.push(`</defs>`);

  parts.push(
    `<g transform="rotate(${outerRotation} ${cx} ${cy})">` +
      `<animateTransform attributeName="transform" type="rotate" from="${outerRotation} ${cx} ${cy}" to="${outerRotation + 360} ${cx} ${cy}" dur="${40 + Math.floor(rnd() * 40)}s" repeatCount="indefinite"/>`
  );

  for (let i = 0; i < ringCount; i++) {
    const r = outerRadius - i * 14;
    const color = i % 2 === 0 ? "#FF4D00" : "#007AFF";
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${1.2 - i * 0.15}" opacity="${0.85 - i * 0.1}"/>`
    );
  }

  const tickCount = 24;
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2;
    const r1 = 90;
    const r2 = i % 3 === 0 ? 82 : 86;
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2;
    const color = i % 2 === 0 ? "#FF4D00" : "#007AFF";
    parts.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.8"/>`
    );
  }
  parts.push(`</g>`);

  const rays: string[] = [];
  for (let i = 0; i < radiatingCount; i++) {
    const angle = (i / radiatingCount) * Math.PI * 2 + rnd() * 0.05;
    const r = 70 + Math.floor(rnd() * 10);
    const x2 = cx + Math.cos(angle) * r;
    const y2 = cy + Math.sin(angle) * r;
    const color = i % 2 === 0 ? "#FF4D00" : "#007AFF";
    const width = 1 + (i % 2);
    rays.push(
      `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${width}" opacity="0.75">` +
        `<animate attributeName="opacity" values="0.75;0.35;0.75" dur="${pulseDuration}s" repeatCount="indefinite" begin="${(i * 0.3).toFixed(1)}s"/>` +
        `</line>`
    );
  }
  parts.push(`<g>${rays.join("")}</g>`);

  const polygonRadius = 38 + Math.floor(rnd() * 8);
  const polyPoints: string[] = [];
  for (let i = 0; i < polygonSides; i++) {
    const angle = (i / polygonSides) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * polygonRadius;
    const py = cy + Math.sin(angle) * polygonRadius;
    polyPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  parts.push(
    `<g transform="rotate(${innerRotation} ${cx} ${cy})">` +
      `<animateTransform attributeName="transform" type="rotate" from="${innerRotation} ${cx} ${cy}" to="${innerRotation - 360} ${cx} ${cy}" dur="${30 + Math.floor(rnd() * 30)}s" repeatCount="indefinite"/>` +
      `<polygon points="${polyPoints.join(" ")}" fill="none" stroke="#007AFF" stroke-width="1.5">` +
      `<animate attributeName="stroke-opacity" values="0.9;0.4;0.9" dur="${pulseDuration + 4}s" repeatCount="indefinite"/>` +
      `</polygon>` +
      `</g>`
  );

  if (innerShape === 0) {
    parts.push(
      `<rect x="${cx - 22}" y="${cy - 22}" width="44" height="44" fill="none" stroke="#FF4D00" stroke-width="1" transform="rotate(${innerRotation + 45} ${cx} ${cy})">` +
        `<animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="${pulseDuration + 2}s" repeatCount="indefinite"/>` +
        `</rect>`
    );
  } else if (innerShape === 1) {
    const hexPoints: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 22;
      const py = cy + Math.sin(angle) * 22;
      hexPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    parts.push(
      `<polygon points="${hexPoints.join(" ")}" fill="none" stroke="#FF4D00" stroke-width="1">` +
        `<animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="${pulseDuration + 2}s" repeatCount="indefinite"/>` +
        `</polygon>`
    );
  } else {
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="#FF4D00" stroke-width="1">` +
        `<animate attributeName="r" values="18;20;18" dur="${pulseDuration}s" repeatCount="indefinite"/>` +
        `</circle>`
    );
  }

  const cardinalR = 55;
  const runes: string[] = [];
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const rx = cx + Math.cos(angle) * cardinalR;
    const ry = cy + Math.sin(angle) * cardinalR;
    const rot = (angle * 180) / Math.PI + 90;
    const color = i % 2 === 0 ? "#FF4D00" : "#007AFF";
    runes.push(
      `<g transform="rotate(${rot} ${rx.toFixed(1)} ${ry.toFixed(1)})">` +
        `<line x1="${rx - 5}" y1="${ry}" x2="${rx + 5}" y2="${ry}" stroke="${color}" stroke-width="1.5"/>` +
        `<line x1="${rx - 3}" y1="${ry - 4}" x2="${rx - 3}" y2="${ry + 4}" stroke="${color}" stroke-width="1"/>` +
        `<line x1="${rx + 3}" y1="${ry - 4}" x2="${rx + 3}" y2="${ry + 4}" stroke="${color}" stroke-width="1"/>` +
        `</g>`
    );
  }
  parts.push(`<g>${runes.join("")}</g>`);

  parts.push(
    `<circle cx="${cx}" cy="${cy}" r="4" fill="#007AFF">` +
      `<animate attributeName="opacity" values="1;0.4;1" dur="${pulseDuration - 2}s" repeatCount="indefinite"/>` +
      `</circle>` +
      `<circle cx="${cx}" cy="${cy}" r="1.5" fill="#FF4D00"/>`
  );

  const orbitCount = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < orbitCount; i++) {
    const r = 26 + i * 10;
    const color = i % 2 === 0 ? "#FF4D00" : "#007AFF";
    const dash = `${(2 + rnd() * 4).toFixed(1)} ${(2 + rnd() * 4).toFixed(1)}`;
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="0.75" stroke-dasharray="${dash}" opacity="0.5"/>`
    );
  }

  parts.push(`</svg>`);

  return parts.join("");
}
