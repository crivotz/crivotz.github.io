document.addEventListener("DOMContentLoaded", () => {
  const pre = document.getElementById('terminal-content');
  let showCursor = true;
  setInterval(() => {
    let lines = pre.innerHTML.split('\n');
    let lastLine = lines[lines.length-1];
    if (showCursor) {
      if (!lastLine.endsWith('_')) lines[lines.length-1] += '_';
    } else {
      if (lastLine.endsWith('_')) lines[lines.length-1] = lastLine.slice(0, -1);
    }
    pre.innerHTML = lines.join('\n');
    showCursor = !showCursor;
  }, 500);
});