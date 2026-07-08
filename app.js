const DATA_PATH = 'data/certificates.json';

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getStatus(cert) {
  const expiry = parseDate(cert.expiry_date);
  if (!expiry) return 'Geen vervaldatum';

  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((expiry - today) / msPerDay);

  if (diffDays < 0) return 'Verlopen';
  if (diffDays <= 90) return 'Verloopt binnenkort';
  return 'Actief';
}

function badgeClass(status) {
  switch (status) {
    case 'Actief': return 'badge-success';
    case 'Verloopt binnenkort': return 'badge-warning';
    case 'Verlopen': return 'badge-danger';
    default: return 'badge-neutral';
  }
}

function nlDate(value) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString('nl-NL') : '—';
}

function uniqueValues(items, key) {
  return [...new Set(items.flatMap(item => {
    const value = item[key];
    return Array.isArray(value) ? value : [value];
  }).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'nl'));
}

function populateSelect(selectId, values) {
  const select = document.getElementById(selectId);
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function renderKpis(items) {
  const statuses = items.map(getStatus);
  const domains = new Set(items.flatMap(i => i.domains || []));
  document.getElementById('kpi-total').textContent = items.length;
  document.getElementById('kpi-active').textContent = statuses.filter(s => s === 'Actief' || s === 'Geen vervaldatum').length;
  document.getElementById('kpi-expiring').textContent = statuses.filter(s => s === 'Verloopt binnenkort').length;
  document.getElementById('kpi-domains').textContent = domains.size;
}

function createCard(cert) {
  const template = document.getElementById('card-template');
  const node = template.content.cloneNode(true);
  const status = getStatus(cert);

  node.querySelector('.provider').textContent = cert.provider;
  node.querySelector('.title').textContent = cert.title;

  const statusEl = node.querySelector('.status');
  statusEl.textContent = status;
  statusEl.classList.add(badgeClass(status));

  const meta = node.querySelector('.meta');
  const metaItems = [
    `Type: ${cert.type || '—'}`,
    `Niveau: ${cert.level || '—'}`,
    `Uitgegeven: ${nlDate(cert.issue_date)}`,
    `Vervalt: ${nlDate(cert.expiry_date)}`
  ];
  metaItems.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item;
    meta.appendChild(span);
  });

  node.querySelector('.description').textContent = cert.description || '';

  const tagContainer = node.querySelector('.tags');
  [...(cert.domains || []), ...(cert.tags || [])].forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagContainer.appendChild(span);
  });

  const actions = node.querySelector('.card-actions');
  if (cert.credential_url) {
    const a = document.createElement('a');
    a.href = cert.credential_url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'action-link';
    a.textContent = 'Verificatielink';
    actions.appendChild(a);
  }
  if (cert.learning_path) {
    const span = document.createElement('span');
    span.className = 'action-link';
    span.textContent = `Leerpad: ${cert.learning_path}`;
    actions.appendChild(span);
  }

  return node;
}

function matches(cert, filters) {
  const status = getStatus(cert);
  const haystack = [
    cert.title,
    cert.provider,
    cert.type,
    cert.level,
    cert.learning_path,
    ...(cert.domains || []),
    ...(cert.tags || [])
  ].join(' ').toLowerCase();

  if (filters.provider && cert.provider !== filters.provider) return false;
  if (filters.domain && !(cert.domains || []).includes(filters.domain)) return false;
  if (filters.level && cert.level !== filters.level) return false;
  if (filters.status && status !== filters.status) return false;
  if (filters.search && !haystack.includes(filters.search.toLowerCase())) return false;
  return true;
}

function renderCards(items, filters = {}) {
  const container = document.getElementById('cards');
  container.innerHTML = '';
  const filtered = items.filter(item => matches(item, filters));
  filtered.forEach(cert => container.appendChild(createCard(cert)));
  document.getElementById('result-count').textContent = `${filtered.length} resultaat${filtered.length === 1 ? '' : 'en'}`;
}

async function init() {
  const response = await fetch(DATA_PATH);
  const items = await response.json();

  populateSelect('filter-provider', uniqueValues(items, 'provider'));
  populateSelect('filter-domain', uniqueValues(items, 'domains'));
  populateSelect('filter-level', uniqueValues(items, 'level'));

  renderKpis(items);
  renderCards(items);

  const controls = {
    provider: document.getElementById('filter-provider'),
    domain: document.getElementById('filter-domain'),
    level: document.getElementById('filter-level'),
    status: document.getElementById('filter-status'),
    search: document.getElementById('filter-search')
  };

  function currentFilters() {
    return Object.fromEntries(Object.entries(controls).map(([key, el]) => [key, el.value.trim()]));
  }

  Object.values(controls).forEach(el => el.addEventListener('input', () => renderCards(items, currentFilters())));
  document.getElementById('clear-filters').addEventListener('click', () => {
    Object.values(controls).forEach(el => el.value = '');
    renderCards(items, {});
  });
}

init().catch(err => {
  console.error(err);
  const container = document.getElementById('cards');
  container.innerHTML = '<article class="card"><h3>Fout bij laden</h3><p>Controleer of <code>data/certificates.json</code> aanwezig is en geldig JSON bevat.</p></article>';
});
