const THEME_KEY = 'theme';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function applyMeta(meta) {
  document.title = meta.title;
  document.getElementById('meta-description').setAttribute('content', meta.description);
  document.getElementById('meta-keywords').setAttribute('content', meta.keywords);
  document.getElementById('meta-author').setAttribute('content', meta.author);
}

function renderAbout(lines) {
  return lines.map((l) => `      - ${escapeHtml(l)}`).join('\n');
}

function renderSkills(skills) {
  const items = skills.map((s) => `        <span class="folder">${escapeHtml(s)}</span>`).join('\n');
  return `      <span class="folders">\n${items}\n      </span>`;
}

function renderStack(items) {
  return items.map((item) => {
    let line = `      - ${escapeHtml(item.label)}: `;
    if (item.link) {
      line += `${escapeHtml(item.value)} (<a href="${escapeHtml(item.link.url)}" target="_blank">${escapeHtml(item.link.text)}</a>)`;
    } else if (item.links) {
      line += item.links
        .map((l) => `<a href="${escapeHtml(l.url)}" target="_blank">${escapeHtml(l.text)}</a>`)
        .join(' / ');
    } else {
      line += escapeHtml(item.value);
    }
    return line;
  }).join('\n');
}

function renderContact(items) {
  return items
    .map((c) => `      - <a href="${escapeHtml(c.url)}" target="_blank">${escapeHtml(c.label)}</a>`)
    .join('\n');
}

function renderProjects(items) {
  const links = items
    .map((p) => `        <span class="folder"><a href="${escapeHtml(p.url)}" target="_blank">${escapeHtml(p.name)}</a></span>`)
    .join('\n');
  return `      <span class="folders">\n${links}\n      </span>`;
}

function renderTerminal(data) {
  const html = `
      <span class="prompt">❯</span> <span class="command">whoami</span>
      <span class="info">${escapeHtml(data.whoami.name)}</span> — ${escapeHtml(data.whoami.role)}

      <span class="prompt">❯</span> <span class="command">cat about.md</span>
${renderAbout(data.about)}

      <span class="prompt">❯</span> <span class="command">cat skills.md</span>
${renderSkills(data.skills)}

      <span class="prompt">❯</span> <span class="command">cat stack.md</span>
${renderStack(data.stack)}

      <span class="prompt">❯</span> <span class="command">cat contact.md</span>
${renderContact(data.contact)}

      <span class="prompt">❯</span> <span class="command">ls</span>
${renderProjects(data.projects)}

      <span class="prompt">❯</span> <a href="#" id="theme-toggle" class="command">toggle-theme</a>

      <span class="prompt">❯</span> <span class="cursor">▌</span>
    `;
  document.getElementById('terminal-content').innerHTML = html;
}

function applyStatusbar(sb) {
  document.getElementById('status-shell').textContent = `1 ❯ ${sb.shell}`;
  document.getElementById('status-branch').textContent = `2 ❯ ${sb.branch}`;
  document.getElementById('status-host').textContent = sb.host;
}

function updateStatusBar() {
  const now = new Date();
  const date = now.toLocaleDateString('it-IT').replace(/\//g, '-'); // DD-MM-YYYY
  const time = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('status-date').textContent = date;
  document.getElementById('status-time').textContent = time;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
  updateStatusBar();
  setInterval(updateStatusBar, 60000);

  const savedTheme = localStorage.getItem(THEME_KEY) || 'night';
  applyTheme(savedTheme);

  fetch('data.json')
    .then((res) => res.json())
    .then((data) => {
      applyMeta(data.meta);
      renderTerminal(data);
      applyStatusbar(data.statusbar);
    })
    .catch((err) => {
      console.error('Failed to load data.json', err);
    });
});

// Theme toggle is created dynamically once data.json loads, so use delegation.
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'theme-toggle') {
    e.preventDefault();
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'day' ? 'night' : 'day';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }
});
