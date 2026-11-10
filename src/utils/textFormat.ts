export interface TextEdit {
  value: string;
  start: number;
  end: number;
}

const BULLET = '• ';

/**
 * Wrap the selection in ** markers, or strip them when it is already bold.
 * The selection follows the text, so the caret never lands at the end of the field.
 */
export function toggleBold(value: string, start: number, end: number): TextEdit {
  const head = value.slice(0, start);
  const selected = value.slice(start, end);
  const tail = value.slice(end);

  if (!selected) {
    // Empty selection: insert a marker pair and park the caret between them
    return { value: `${head}****${tail}`, start: start + 2, end: start + 2 };
  }
  if (selected.length >= 4 && selected.startsWith('**') && selected.endsWith('**')) {
    return { value: head + selected.slice(2, -2) + tail, start, end: end - 4 };
  }
  // The markers may sit just outside the selection (the usual case after a first
  // click on B): unwrap instead of stacking a second pair around it
  if (value.slice(start - 2, start) === '**' && value.slice(end, end + 2) === '**') {
    return {
      value: value.slice(0, start - 2) + selected + value.slice(end + 2),
      start: start - 2,
      end: end - 2,
    };
  }
  return { value: `${head}**${selected}**${tail}`, start: start + 2, end: end + 2 };
}

/**
 * Add or remove the bullet marker on every line the selection touches, keeping the
 * selection on the same characters so the view stays where the user was working.
 */
export function toggleBullets(value: string, start: number, end: number): TextEdit {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = value.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = value.length;

  const lines = value.slice(lineStart, lineEnd).split('\n');
  // Toggle off only when every touched line already carries a bullet
  const allBulleted = lines.every(l => l.startsWith(BULLET));
  const newLines = lines.map(l => (allBulleted ? l.slice(BULLET.length) : BULLET + l));
  const next = value.slice(0, lineStart) + newLines.join('\n') + value.slice(lineEnd);

  // The text before lineStart is untouched, so the block always starts at lineStart.
  // A collapsed caret sitting on a line start ends up behind the marker it just got,
  // while the selection end never swallows a marker of the line it merely touches.
  const shift = (pos: number, countTouchedLine: boolean) => {
    let delta = 0;
    let offset = lineStart;
    for (let i = 0; i < lines.length; i++) {
      if (offset > pos || (offset === pos && !countTouchedLine)) break;
      delta += newLines[i].length - lines[i].length;
      offset += lines[i].length + 1;
    }
    return Math.max(lineStart, pos + delta);
  };

  const newStart = shift(start, true);
  return { value: next, start: newStart, end: Math.max(newStart, shift(end, false)) };
}
