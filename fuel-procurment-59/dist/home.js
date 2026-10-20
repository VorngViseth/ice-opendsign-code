(() => {
'use strict';

/* ------------------------------------------------------------------ *
 * Sok Heng role home pages (#246)
 * Owns the home-page experience only. Role/permission design is #242.
 * Links into existing screens; does not duplicate their forms/reports.
 * ------------------------------------------------------------------ */

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const STORE = 'ice-factory.home-preview.v1';
const ROLES = ['ga', 'production', 'admin-op', 'cashier', 'finance', 'owner', 'it'];
const STATES = ['default', 'notstarted', 'continue', 'done', 'empty', 'loading', 'error', 'denied'];

let role = ROLES.includes(params.get('role')) ? params.get('role') : (localStorage.getItem(STORE + '.role') || 'ga');
let state = STATES.includes(params.get('state')) ? params.get('state') : 'default';
let lang = params.get('lang') === 'km' ? 'km' : 'en';
let loading = state === 'loading';

const L = (en, km) => lang === 'km' ? km : en;
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const q = (extra = {}) => {
  const u = new URLSearchParams({ lang, ...extra });
  return u.toString();
};
const localDate = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'); };
const DAY = localDate();
const dayLabel = () => new Intl.DateTimeFormat(lang === 'km' ? 'km-KH' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(DAY + 'T12:00:00'));

const ROLE_META = {
  ga: { name: ['General Admin', 'រដ្ឋបាលទូទៅ'], scope: ['Daily operations', 'ប្រតិបត្តិការប្រចាំថ្ងៃ'] },
  production: { name: ['Production Operator', 'បុគ្គលិកផលិតកម្ម'], scope: ['Production recording', 'ការកត់ត្រាផលិតកម្ម'] },
  'admin-op': { name: ['Admin Operator', 'បុគ្គលិករដ្ឋបាលប្រតិបត្តិការ'], scope: ['Verification', 'ការផ្ទៀងផ្ទាត់'] },
  cashier: { name: ['Cashier', 'អ្នកគិតលុយ'], scope: ['Sales & collections', 'ការលក់ និងប្រមូលប្រាក់'] },
  finance: { name: ['Accountant / Finance Admin', 'គណនេយ្យករ / រដ្ឋបាលហិរញ្ញវត្ថុ'], scope: ['Finance', 'ហិរញ្ញវត្ថុ'] },
  owner: { name: ['Owner / Executive Director', 'ម្ចាស់ / នាយកប្រតិបត្តិ'], scope: ['Oversight', 'ការត្រួតពិនិត្យ'] },
  it: { name: ['IT Admin', 'អ្នកគ្រប់គ្រងព័ត៌មានវិទ្យា'], scope: ['Accounts & roles', 'គណនី និងតួនាទី'] }
};

/* Destination builders — existing screens only. Context (lang/date) is preserved. */
const dest = {
  walkin: () => `index.html?lang=${lang}`,
  driver: (dispatch) => `driver-sales.html?lang=${lang}${dispatch ? '#dispatch=' + encodeURIComponent(dispatch) : ''}`,
  collection: (dispatch) => `debt-collection.html?lang=${lang}${dispatch ? '#dispatch=' + encodeURIComponent(dispatch) : ''}`,
  dispatchPlan: () => `dispatch-planning.html?lang=${lang}`,
  dispatchVerify: (id) => `dispatch.html?lang=${lang}${id ? '#' + encodeURIComponent(id) : ''}`,
  dispatchReturns: (id) => `dispatch-returns.html?lang=${lang}${id ? '#' + encodeURIComponent(id) : ''}`,
  iceReturns: (id) => `dispatch-ice-return-3.html?lang=${lang}${id ? '#' + encodeURIComponent(id) : ''}`,
  fuel: () => `fuel-procurement.html?lang=${lang}&role=ga`,
  fuelEntry: () => `fuel-procurement.html?lang=${lang}&role=entry`,
  fuelHistory: () => `fuel-procurement.html?lang=${lang}&role=ga&tab=history`,
  finance: (date, tab) => `daily-finance.html?lang=${lang}${date ? '&date=' + date : ''}${tab ? '&tab=' + tab : ''}`,
  production: (date) => `production-sales.html?lang=${lang}${date ? '&from=' + date + '&to=' + date : ''}`,
  customers: () => `executive-overview.html?lang=${lang}&view=new`,
  debt: () => `executive-overview.html?lang=${lang}&view=debt`,
  exec: (view) => `executive-overview.html?lang=${lang}${view ? '&view=' + view : ''}`
};

/* Reference sample IDs are taken from the shared sample dispatch set (shared-dispatches.js). */
const SAMPLE = {
  verify: 'DSP-2026-0923-019',
  returns: 'DSP-2026-0923-020',
  ice: 'DSP-2026-0922-018'
};

/* ---------- building blocks ---------- */

function badge(text, tone) {
  return `<span class="badge${tone ? ' ' + tone : ''}">${esc(text)}</span>`;
}

function cta(label, href, { primary = true, disabled = false, note = '' } = {}) {
  if (disabled) {
    return `<span class="hm-link secondary" aria-disabled="true">${esc(label)}</span>${note ? `<span class="hm-action-context">${esc(note)}</span>` : ''}`;
  }
  return `<a class="hm-link${primary ? '' : ' secondary'}" href="${esc(href)}">${esc(label)}</a>${note ? `<span class="hm-action-context">${esc(note)}</span>` : ''}`;
}

function cardInfo(c) {
  const title = L(...c.title);
  const desc = L(...c.desc);
  if (!desc) return '';
  return `<button type="button" class="info hm-card-info" data-hm="info" data-info-title="${esc(title)}" data-info-text="${esc(desc)}" aria-label="${esc(L('About ', 'អំពី ') + title)}" aria-haspopup="dialog"><span aria-hidden="true">i</span></button>`;
}

function actionCard(c) {
  const status = c.status ? badge(L(...c.status.text), c.status.tone) : '';
  return `<article class="hm-action">
    <div class="hm-action-top">
      <h3>${esc(L(...c.title))}${cardInfo(c)}${status}</h3>
      ${c.context ? `<span class="hm-action-context">${esc(L(...c.context))}</span>` : ''}
    </div>
    <div class="hm-action-cta">${c.cta.map(x => cta(L(...x.label), x.href, x)).join('')}</div>
  </article>`;
}

function attentionItem(item) {
  return `<li>
    <span class="hm-dot${item.tone ? ' ' + item.tone : ''}" aria-hidden="true"></span>
    <div class="od-field">
      <strong>${esc(L(...item.title))}</strong>
      <span>${esc(L(...item.detail))}</span>
    </div>
    ${item.href ? `<a href="${esc(item.href)}">${esc(L(...(item.action || ['Open', 'បើក'])))}</a>` : ''}
  </li>`;
}

function shortcut(tile) {
  if (!tile.href) {
    return `<span class="hm-shortcut" aria-disabled="true">
      <strong>${esc(L(...tile.title))}</strong>
      <span class="hm-unavailable">${esc(L('Not yet available', 'មិនទាន់មាន'))}</span>
      ${tile.note ? `<span>${esc(L(...tile.note))}</span>` : ''}
    </span>`;
  }
  return `<a class="hm-shortcut" href="${esc(tile.href)}">
    <strong>${esc(L(...tile.title))}</strong>
    <span>${esc(L(...tile.detail))}</span>
  </a>`;
}

function section(title, subtitle, body) {
  return `<section class="hm-section">
    <header><h2>${esc(L(...title))}</h2><p class="caption">${esc(L(...subtitle))}</p></header>
    ${body}
  </section>`;
}

/* ---------- role content ---------- */

function gaContent(f) {
  const allowanceState = f === 'default' ? 'notstarted' : f;
  const fuelState = f === 'default' ? 'continue' : f;
  const actions = [
    {
      title: ['Food allowance list', 'បញ្ជីប្រាក់អាហារ'],
      desc: ['Prepare the daily allowance list. Preparing a list is not the same as paying allowances.', 'រៀបចំបញ្ជីប្រាក់អាហារប្រចាំថ្ងៃ។ ការរៀបចំបញ្ជីមិនមែនជាការបើកប្រាក់អាហារនោះទេ។'],
      status: allowanceState === 'done' ? { tone: 'success', text: ['List prepared', 'បញ្ជីបានរៀបចំ'] } : { tone: 'warning', text: ['Not prepared', 'មិនទាន់រៀបចំ'] },
      context: ['Allowance payout is recorded in Daily Finance', 'ការបើកប្រាក់អាហារកត់ត្រាក្នុងហិរញ្ញវត្ថុប្រចាំថ្ងៃ'],
      cta: [{ label: allowanceState === 'done' ? ['View list', 'មើលបញ្ជី'] : ['Prepare today’s list', 'រៀបចំបញ្ជីថ្ងៃនេះ'], href: dest.finance() }]
    },
    {
      title: ['Dispatch preparation', 'ការរៀបចំដំណើរ'],
      desc: ['Create today’s dispatches and track loads that still need verification.', 'បង្កើតដំណើរថ្ងៃនេះ និងតាមដានការផ្ទុកដែលនៅត្រូវផ្ទៀងផ្ទាត់។'],
      status: { tone: '', text: ['Work waiting', 'មានការងាររង់ចាំ'] },
      context: ['Sample: 1 load awaiting verification', 'គំរូ៖ ការផ្ទុក ១ រង់ចាំផ្ទៀងផ្ទាត់'],
      cta: [
        { label: ['Open dispatch preparation', 'បើកការរៀបចំដំណើរ'], href: dest.dispatchPlan() },
        { label: ['Verify a load', 'ផ្ទៀងផ្ទាត់ការផ្ទុក'], href: dest.dispatchVerify(SAMPLE.verify), primary: false }
      ]
    },
    {
      title: ['Fuel procurement', 'ការទិញប្រេងឥន្ធនៈ'],
      desc: ['Prepare the usual daily fuel plan, then complete or view the recorded purchase.', 'រៀបចំផែនការប្រេងប្រចាំថ្ងៃ រួចបញ្ចប់ ឬមើលការទិញដែលបានកត់ត្រា។'],
      status: fuelState === 'done'
        ? { tone: 'success', text: ['Recorded', 'បានកត់ត្រា'] }
        : fuelState === 'notstarted'
          ? { tone: 'warning', text: ['Not prepared', 'មិនទាន់រៀបចំ'] }
          : { tone: '', text: ['Prepared', 'បានរៀបចំ'] },
      context: fuelState === 'done'
        ? ['A recorded purchase is not a payment record', 'ការទិញដែលបានកត់ត្រាមិនមែនជាកំណត់ត្រាទូទាត់ទេ']
        : ['Prepared fuel plan is not money paid out', 'ផែនការប្រេងដែលបានរៀបចំមិនមែនជាប្រាក់បានចំណាយទេ'],
      cta: fuelState === 'done'
        ? [{ label: ['View recorded purchase', 'មើលការទិញបានកត់ត្រា'], href: dest.fuelHistory() }]
        : [{ label: fuelState === 'notstarted' ? ['Prepare procurement', 'រៀបចំការទិញ'] : ['Continue procurement', 'បន្តការទិញ'], href: dest.fuel() }]
    },
    {
      title: ['Daily finance review', 'ការពិនិត្យហិរញ្ញវត្ថុប្រចាំថ្ងៃ'],
      desc: ['Review actual balances and close the financial day. Opening balances carry forward automatically.', 'ពិនិត្យសមតុល្យជាក់ស្តែង និងបិទថ្ងៃហិរញ្ញវត្ថុ។ សមតុល្យដើមថ្ងៃបន្តដោយស្វ័យប្រវត្តិ។'],
      status: f === 'done' ? { tone: 'success', text: ['Day closed', 'ថ្ងៃបានបិទ'] } : { tone: 'warning', text: ['Open', 'កំពុងបើក'] },
      context: ['Sample financial day · 28 Sep 2026', 'ថ្ងៃហិរញ្ញវត្ថុគំរូ · ២៨ កញ្ញា ២០២៦'],
      cta: [{ label: f === 'done' ? ['View closing summary', 'មើលសង្ខេបបិទថ្ងៃ'] : ['Review & close day', 'ពិនិត្យ និងបិទថ្ងៃ'], href: dest.finance('2026-09-28') }]
    }
  ];

  const attention = [
    { tone: '', title: ['Dispatch load not yet verified', 'ការផ្ទុកដំណើរមិនទាន់ផ្ទៀងផ្ទាត់'], detail: ['Sample dispatch ' + SAMPLE.verify + ' · 23 Sep 2026', 'ដំណើរគំរូ ' + SAMPLE.verify + ' · ២៣ កញ្ញា ២០២៦'], href: dest.dispatchVerify(SAMPLE.verify) },
    { tone: 'hm-info', title: ['Ice returns awaiting verification', 'ទឹកកកត្រឡប់រង់ចាំផ្ទៀងផ្ទាត់'], detail: ['Sample dispatch ' + SAMPLE.ice + ' · 22 Sep 2026', 'ដំណើរគំរូ ' + SAMPLE.ice + ' · ២២ កញ្ញា ២០២៦'], href: dest.iceReturns(SAMPLE.ice) },
    { tone: 'hm-danger', title: ['Customer debt over allowance', 'បំណុលអតិថិជនលើសកំណត់'], detail: ['Open the collection ledger to prepare tickets', 'បើកបញ្ជីប្រមូលដើម្បីរៀបចំប័ណ្ណ'], href: dest.collection() }
  ];

  const shortcuts = [
    { title: ['Customers', 'អតិថិជន'], detail: ['Customer records & new customers', 'កំណត់ត្រាអតិថិជន និងអតិថិជនថ្មី'], href: dest.customers() },
    { title: ['Customer debt', 'បំណុលអតិថិជន'], detail: ['Debt ledger and reports', 'បញ្ជីបំណុល និងរបាយការណ៍'], href: dest.debt() },
    { title: ['Expenses', 'ចំណាយ'], detail: ['Recorded expenses by day', 'ចំណាយបានកត់ត្រាតាមថ្ងៃ'], href: dest.finance(undefined, 'movements') },
    { title: ['Employee records', 'កំណត់ត្រាបុគ្គលិក'], detail: ['Basic employee details', 'ព័ត៌មានបុគ្គលិកមូលដ្ឋាន'] },
    { title: ['Standard selling prices', 'តម្លៃលក់ស្តង់ដារ'], detail: ['Factory selling prices', 'តម្លៃលក់របស់រោងចក្រ'] },
    { title: ['Fuel prices', 'តម្លៃប្រេង'], detail: ['Fuel price updates with evidence', 'ធ្វើបច្ចុប្បន្នភាពតម្លៃប្រេងជាមួយភស្តុតាង'] },
    { title: ['Exchange rate', 'អត្រាប្តូរប្រាក់'], detail: ['Factory exchange rate', 'អត្រាប្តូរប្រាក់របស់រោងចក្រ'] }
  ];

  return { actions, attention, shortcuts };
}

function productionContent(f) {
  const actions = [
    {
      title: ['Record ice production', 'កត់ត្រាផលិតកម្មទឹកកក'],
      desc: ['Enter today’s produced quantities. The recording screen is an open dependency.', 'បញ្ចូលបរិមាណផលិតថ្ងៃនេះ។ អេក្រង់កត់ត្រានៅជាប់រង់ចាំ។'],
      status: { tone: 'warning', text: ['Source screen pending', 'អេក្រង់ប្រភពរង់ចាំ'] },
      cta: [{ label: ['Record production', 'កត់ត្រាផលិតកម្ម'], disabled: true, note: L('No production-entry screen exists yet', 'មិនទាន់មានអេក្រង់បញ្ចូលផលិតកម្ម') }]
    },
    {
      title: ['Today’s recorded production', 'ផលិតកម្មបានកត់ត្រាថ្ងៃនេះ'],
      desc: ['Permitted summary of quantities recorded for today.', 'សង្ខេបដែលអនុញ្ញាតនៃបរិមាណបានកត់ត្រាថ្ងៃនេះ។'],
      status: { tone: '', text: ['Summary', 'សង្ខេប'] },
      cta: [{ label: ['Open production summary', 'បើកសង្ខេបផលិតកម្ម'], href: dest.production(DAY) }]
    }
  ];
  return { actions, attention: [], shortcuts: [
    { title: ['Production records', 'កំណត់ត្រាផលិតកម្ម'], detail: ['Subject to approved access', 'អាស្រ័យលើការអនុញ្ញាតដែលបានអនុម័ត'], href: dest.production(DAY) }
  ] };
}

function adminOpContent(f) {
  const actions = [
    {
      title: ['Ice picking awaiting verification', 'ការបេះទឹកកករង់ចាំផ្ទៀងផ្ទាត់'],
      desc: ['Verify ice loaded before departure.', 'ផ្ទៀងផ្ទាត់ទឹកកកដែលបានផ្ទុកមុនចេញដំណើរ។'],
      status: { tone: 'warning', text: ['Awaiting', 'រង់ចាំ'] },
      context: ['Sample dispatch ' + SAMPLE.verify, 'ដំណើរគំរូ ' + SAMPLE.verify],
      cta: [{ label: ['Open verification', 'បើកការផ្ទៀងផ្ទាត់'], href: dest.dispatchVerify(SAMPLE.verify) }]
    },
    {
      title: ['Returned ice awaiting verification', 'ទឹកកកត្រឡប់រង់ចាំផ្ទៀងផ្ទាត់'],
      desc: ['Record physical returned ice quantities.', 'កត់ត្រាបរិមាណទឹកកកត្រឡប់ពិត។'],
      status: { tone: '', text: ['Ready', 'រួចរាល់'] },
      context: ['Sample dispatch ' + SAMPLE.ice, 'ដំណើរគំរូ ' + SAMPLE.ice],
      cta: [{ label: ['Open ice returns', 'បើកទឹកកកត្រឡប់'], href: dest.iceReturns(SAMPLE.ice) }]
    },
    {
      title: ['Fuel-purchase work', 'ការងារទិញប្រេង'],
      desc: ['The exact ERP action for the physical duty to buy fuel is awaiting clarification.', 'សកម្មភាព ERP ពិតប្រាកដសម្រាប់កាតព្វកិច្ចទិញប្រេងនៅរង់ចាំការបញ្ជាក់។'],
      status: { tone: 'warning', text: ['Unconfirmed', 'មិនទាន់បញ្ជាក់'] },
      cta: [{ label: ['Open fuel preparation', 'បើកការរៀបចំប្រេង'], href: dest.fuelEntry() }]
    }
  ];
  return { actions, attention: [], shortcuts: [
    { title: ['Returns recording', 'ការកត់ត្រាត្រឡប់'], detail: ['Record sales & collections per dispatch', 'កត់ត្រាការលក់ និងប្រមូលតាមដំណើរ'], href: dest.dispatchReturns(SAMPLE.returns) }
  ] };
}

function cashierContent(f) {
  const actions = [
    {
      title: ['Record walk-in sale', 'កត់ត្រាការលក់ផ្ទាល់'],
      desc: ['Record a purchase, receive payment and issue a receipt.', 'កត់ត្រាការទិញ ទទួលប្រាក់ និងចេញបង្កាន់ដៃ។'],
      status: { tone: 'warning', text: ['Ready to record', 'រួចរាល់កត់ត្រា'] },
      cta: [{ label: ['New walk-in sale', 'ការលក់ផ្ទាល់ថ្មី'], href: dest.walkin() }]
    },
    {
      title: ['Issue tickets', 'ចេញប័ណ្ណ'],
      desc: ['Prepare ice-picking and debt-collection tickets for a dispatch.', 'រៀបចំប័ណ្ណបេះទឹកកក និងប័ណ្ណប្រមូលបំណុលសម្រាប់ដំណើរ។'],
      status: { tone: '', text: ['Tickets', 'ប័ណ្ណ'] },
      cta: [
        { label: ['Debt-collection tickets', 'ប័ណ្ណប្រមូលបំណុល'], href: dest.collection() },
        { label: ['Driver ticket preparation', 'ការរៀបចំប័ណ្ណអ្នកបើកបរ'], href: dest.driver(), primary: false }
      ]
    },
    {
      title: ['Record driver sales', 'កត់ត្រាការលក់តាមអ្នកបើកបរ'],
      desc: ['Enter completed paper receipts for a dispatch.', 'បញ្ចូលបង្កាន់ដៃក្រដាសដែលបានបញ្ចប់សម្រាប់ដំណើរ។'],
      status: { tone: '', text: ['Ready', 'រួចរាល់'] },
      cta: [{ label: ['Open driver sales', 'បើកការលក់តាមអ្នកបើកបរ'], href: dest.driver() }]
    },
    {
      title: ['Record debt collections', 'កត់ត្រាការប្រមូលបំណុល'],
      desc: ['Record each returned collection ticket outcome.', 'កត់ត្រាលទ្ធផលប័ណ្ណប្រមូលដែលបានត្រឡប់មកវិញ។'],
      status: { tone: '', text: ['Ready', 'រួចរាល់'] },
      cta: [{ label: ['Open debt collection', 'បើកការប្រមូលបំណុល'], href: dest.collection() }]
    }
  ];
  return { actions, attention: [
    { tone: 'hm-danger', title: ['Customer debt to collect', 'បំណុលអតិថិជនត្រូវប្រមូល'], detail: ['Prepare tickets from the collection ledger', 'រៀបចំប័ណ្ណពីបញ្ជីប្រមូល'], href: dest.collection() }
  ], shortcuts: [
    { title: ['Customer records', 'កំណត់ត្រាអតិថិជន'], detail: ['Supporting customer information', 'ព័ត៌មានអតិថិជនជំនួយ'], href: dest.customers() },
    { title: ['Pricing', 'តម្លៃ'], detail: ['Standard prices used at checkout', 'តម្លៃស្តង់ដារប្រើនៅកន្លែងលក់'] },
    { title: ['Customer debt', 'បំណុលអតិថិជន'], detail: ['Balances needed for collections', 'សមតុល្យសម្រាប់ការប្រមូល'], href: dest.debt() }
  ] };
}

function financeContent(f) {
  const actions = [
    {
      title: ['Record expenses', 'កត់ត្រាចំណាយ'],
      desc: ['Add a paid expense to the financial day.', 'បន្ថែមចំណាយបានទូទាត់ទៅថ្ងៃហិរញ្ញវត្ថុ។'],
      status: { tone: 'warning', text: ['Open', 'កំពុងបើក'] },
      cta: [{ label: ['Open daily finance', 'បើកហិរញ្ញវត្ថុប្រចាំថ្ងៃ'], href: dest.finance('2026-09-28') }]
    },
    {
      title: ['Verify daily cash flow', 'ផ្ទៀងផ្ទាត់លំហូរសាច់ប្រាក់ប្រចាំថ្ងៃ'],
      desc: ['Count cash and verify bank balances before closing.', 'រាប់សាច់ប្រាក់ និងផ្ទៀងផ្ទាត់សមតុល្យធនាគារមុនបិទថ្ងៃ។'],
      status: { tone: 'warning', text: ['Review', 'ពិនិត្យ'] },
      cta: [{ label: ['Open review', 'បើកការពិនិត្យ'], href: dest.finance('2026-09-28') }]
    },
    {
      title: ['Record transfer to owner', 'កត់ត្រាការផ្ទេរទៅម្ចាស់'],
      desc: ['Record a transfer of funds to the owner.', 'កត់ត្រាការផ្ទេរប្រាក់ទៅម្ចាស់។'],
      status: { tone: '', text: ['Available', 'អាចប្រើបាន'] },
      cta: [{ label: ['Record transfer', 'កត់ត្រាការផ្ទេរ'], href: dest.finance('2026-09-28') }]
    }
  ];
  return { actions, attention: [], shortcuts: [
    { title: ['Food / commission payouts', 'ប្រាក់អាហារ / កម្រៃជើងសារ'], detail: ['Role assignment unconfirmed', 'ការចាត់តាំងតួនាទីមិនទាន់បញ្ជាក់'] },
    { title: ['Driver handovers', 'ការប្រគល់ប្រាក់ពីអ្នកបើកបរ'], detail: ['Role assignment unconfirmed', 'ការចាត់តាំងតួនាទីមិនទាន់បញ្ជាក់'] },
    { title: ['Expense reports', 'របាយការណ៍ចំណាយ'], detail: ['Read-only reporting', 'របាយការណ៍មើលតែប៉ុណ្ណោះ'], href: dest.exec('expenses') }
  ] };
}

function itContent(f) {
  const actions = [
    {
      title: ['Manage user accounts', 'គ្រប់គ្រងគណនីអ្នកប្រើ'],
      desc: ['Create and maintain user accounts. The account-management screen is a dependency.', 'បង្កើត និងថែទាំគណនីអ្នកប្រើ។ អេក្រង់គ្រប់គ្រងគណនីជាប់រង់ចាំ។'],
      status: { tone: 'warning', text: ['Source screen pending', 'អេក្រង់ប្រភពរង់ចាំ'] },
      cta: [{ label: ['Manage accounts', 'គ្រប់គ្រងគណនី'], disabled: true, note: L('No account-management screen exists yet', 'មិនទាន់មានអេក្រង់គ្រប់គ្រងគណនី') }]
    },
    {
      title: ['Assign predefined roles', 'ចាត់តាំងតួនាទីកំណត់ជាមុន'],
      desc: ['Assign one of the predefined roles. No role creation or permission editor.', 'ចាត់តាំងតួនាទីកំណត់ជាមុនមួយ។ គ្មានការបង្កើតតួនាទី ឬកែសិទ្ធិ។'],
      status: { tone: 'warning', text: ['Source screen pending', 'អេក្រង់ប្រភពរង់ចាំ'] },
      cta: [{ label: ['Assign roles', 'ចាត់តាំងតួនាទី'], disabled: true, note: L('Role assignment is owned by #242', 'ការចាត់តាំងតួនាទីជារបស់ #242') }]
    }
  ];
  return { actions, attention: [], shortcuts: [
    { title: ['User accounts', 'គណនីអ្នកប្រើ'], detail: ['Existing user-management functions', 'មុខងារគ្រប់គ្រងអ្នកប្រើដែលមាន'] }
  ] };
}

function contentFor(r) {
  switch (r) {
    case 'ga': return gaContent(state);
    case 'production': return productionContent(state);
    case 'admin-op': return adminOpContent(state);
    case 'cashier': return cashierContent(state);
    case 'finance': return financeContent(state);
    case 'it': return itContent(state);
    default: return gaContent(state);
  }
}

/* ---------- role-filtered navigation (a shortcut must not exceed the role) ---------- */
const NAV_SETS = {
  ga: [
    ['walkin', ['Walk-in sales', 'ការលក់ផ្ទាល់'], () => dest.walkin()],
    ['driver', ['Driver sales', 'ការលក់តាមអ្នកបើកបរ'], () => dest.driver()],
    ['collection', ['Debt collection', 'ការប្រមូលបំណុល'], () => dest.collection()],
    ['dispatchPlan', ['Dispatch planning', 'រៀបចំដំណើរ'], () => dest.dispatchPlan()],
    ['dispatchVerify', ['Load & verify', 'ផ្ទុក និងផ្ទៀងផ្ទាត់'], () => dest.dispatchVerify()],
    ['iceReturns', ['Ice returns', 'ទឹកកកត្រឡប់'], () => dest.iceReturns()],
    ['fuel', ['Fuel procurement', 'ការទិញប្រេងឥន្ធនៈ'], () => dest.fuel()],
    ['finance', ['Daily finance', 'ហិរញ្ញវត្ថុប្រចាំថ្ងៃ'], () => dest.finance()],
    ['exec', ['Executive overview', 'ទិដ្ឋភាពទូទៅសម្រាប់ថ្នាក់ដឹកនាំ'], () => dest.exec()],
    ['production', ['Production vs sales', 'ផលិតកម្មធៀបនឹងការលក់'], () => dest.production()]
  ],
  production: [
    ['production', ['Production vs sales', 'ផលិតកម្មធៀបនឹងការលក់'], () => dest.production(DAY)]
  ],
  'admin-op': [
    ['iceReturns', ['Ice returns', 'ទឹកកកត្រឡប់'], () => dest.iceReturns()],
    ['dispatchVerify', ['Load & verify', 'ផ្ទុក និងផ្ទៀងផ្ទាត់'], () => dest.dispatchVerify()],
    ['dispatchReturns', ['Record returns', 'កត់ត្រាត្រឡប់'], () => dest.dispatchReturns()],
    ['fuelEntry', ['Fuel procurement', 'ការទិញប្រេងឥន្ធនៈ'], () => dest.fuelEntry()]
  ],
  cashier: [
    ['walkin', ['Walk-in sales', 'ការលក់ផ្ទាល់'], () => dest.walkin()],
    ['driver', ['Driver sales', 'ការលក់តាមអ្នកបើកបរ'], () => dest.driver()],
    ['collection', ['Debt collection', 'ការប្រមូលបំណុល'], () => dest.collection()]
  ],
  finance: [
    ['finance', ['Daily finance', 'ហិរញ្ញវត្ថុប្រចាំថ្ងៃ'], () => dest.finance()],
    ['exec', ['Executive overview', 'ទិដ្ឋភាពទូទៅសម្រាប់ថ្នាក់ដឹកនាំ'], () => dest.exec()]
  ],
  it: [],
  owner: []
};

function nav() {
  const links = (NAV_SETS[role] || []).map(([id, label, href]) =>
    `<a href="${esc(href())}" data-hm-nav="${id}">${esc(L(...label))}</a>`).join('');
  return `<nav aria-label="${esc(L('Navigation', 'ម៉ឺនុយ'))}">
    <p class="nav-caption">${esc(L('HOME', 'ទំព័រដើម'))}</p>
    <a href="home.html?${q({ role })}" aria-current="page">${esc(L('Home', 'ទំព័រដើម'))}</a>
    ${links ? `<p class="nav-caption">${esc(L('WORKSPACE', 'កន្លែងធ្វើការ'))}</p>${links}` : ''}
  </nav>`;
}

/* ---------- sections ---------- */

function loadingSection() {
  return `<section class="hm-section" aria-busy="true"><header><h2>${esc(L('Today’s work', 'ការងារថ្ងៃនេះ'))}</h2></header>
    <div class="hm-skeletons" aria-hidden="true"><div class="hm-skeleton"></div><div class="hm-skeleton"></div><div class="hm-skeleton"></div><div class="hm-skeleton"></div></div>
    <p role="status" class="caption">${esc(L('Loading your home page…', 'កំពុងផ្ទុកទំព័រដើមរបស់អ្នក…'))}</p></section>`;
}

function errorSection(retry) {
  return `<section class="hm-section" id="hm-attention"><header><h2>${esc(L('Needs attention', 'ត្រូវយកចិត្តទុកដាក់'))}</h2></header>
    <div class="hm-state" role="alert">
      <h2>${esc(L('Could not load your work', 'មិនអាចផ្ទុកការងាររបស់អ្នក'))}</h2>
      <p>${esc(L('Work status is unavailable. This is not zero pending work. Your other links still open normally.', 'ស្ថានភាពការងារមិនមានទិន្នន័យ។ នេះមិនមែនជាការងាររង់ចាំសូន្យទេ។ តំណផ្សេងទៀតនៅបើកជាធម្មតា។'))}</p>
      <div class="hm-state-actions">${retry ? `<button type="button" class="primary" data-hm="retry">${esc(L('Retry', 'សាកល្បងម្ដងទៀត'))}</button>` : ''}</div>
    </div></section>`;
}

function deniedSection() {
  return `<section class="hm-section"><header><h2>${esc(L('Access denied', 'មិនមានសិទ្ធិចូល'))}</h2></header>
    <div class="hm-state" role="alert">
      <h2>${esc(L('No permitted destination', 'គ្មានគោលដៅដែលអនុញ្ញាត'))}</h2>
      <p>${esc(L('Your role does not permit this work. Nothing is hidden by a shortcut, and no access is granted here.', 'តួនាទីរបស់អ្នកមិនអនុញ្ញាតការងារនេះទេ។ គ្មានអ្វីត្រូវបានលាក់ដោយតំណខ្លី ហើយគ្មានសិទ្ធិត្រូវបានផ្តល់នៅទីនេះ។'))}</p>
      <div class="hm-state-actions"><a class="hm-link secondary" href="home.html?${q({ role, state: 'default' })}">${esc(L('Back to my home', 'ត្រឡប់ទៅទំព័រដើមរបស់ខ្ញុំ'))}</a></div>
    </div></section>`;
}

function attentionSection(list, f) {
  if (f === 'empty') {
    return section(['Needs attention', 'ត្រូវយកចិត្តទុកដាក់'], ['Status from connected work', 'ស្ថានភាពពីការងារដែលបានភ្ជាប់'],
      `<p class="hm-empty">${esc(L('Nothing needs attention right now.', 'មិនមានអ្វីត្រូវយកចិត្តទុកដាក់ឥឡូវនេះ។'))}</p>`);
  }
  if (!list.length) {
    return section(['Needs attention', 'ត្រូវយកចិត្តទុកដាក់'], ['Status from connected work', 'ស្ថានភាពពីការងារដែលបានភ្ជាប់'],
      `<p class="hm-empty">${esc(L('No outstanding work is supplied for this role yet.', 'មិនទាន់មានការងារនៅសល់សម្រាប់តួនាទីនេះទេ។'))}</p>`);
  }
  const shown = list.slice(0, 3);
  const more = list.length > 3 ? `<li class="hm-more"><a href="executive-overview.html?${q({ view: 'attention' })}">${esc(L('Open all items needing attention', 'បើករាល់ចំណុចត្រូវយកចិត្តទុកដាក់'))}</a></li>` : '';
  return section(['Needs attention', 'ត្រូវយកចិត្តទុកដាក់'], ['Status from connected work', 'ស្ថានភាពពីការងារដែលបានភ្ជាប់'],
    `<ul class="hm-attention">${shown.map(attentionItem).join('')}${more}</ul>`);
}

/* ---------- page ---------- */

function render() {
  document.documentElement.lang = lang;
  document.title = L('Home · Sok Heng', 'ទំព័រដើម · សុខ ហេង');
  const meta = ROLE_META[role] || ROLE_META.ga;
  const c = contentFor(role);

  const header = `<header class="fn-header">
    <div class="od-row">
      <button data-hm="menu" class="menu" aria-label="${esc(L('Open navigation', 'បើកម៉ឺនុយ'))}">☰</button>
      <strong>${esc(L('SOK HENG', 'សុខ ហេង'))}</strong>
      <span class="header-divider">/</span><span>${esc(L('Home', 'ទំព័រដើម'))}</span>
    </div>
    <div class="od-cluster">
      <span class="sample">${esc(L('Sample data', 'ទិន្នន័យគំរូ'))}</span>
      <button data-hm="language" aria-label="${esc(L('Switch language', 'ប្ដូរភាសា'))}">${lang === 'en' ? 'ខ្មែរ' : 'English'}</button>
    </div>
  </header>`;

  const review = `<div class="hm-review" role="region" aria-label="${esc(L('Prototype review controls', 'ការគ្រប់គ្រងសម្រាប់ការពិនិត្យគំរូ'))}">
    <strong>${esc(L('Prototype review control', 'ការគ្រប់គ្រងគំរូ'))}</strong>
    <span>${esc(L('not part of the product', 'មិនមែនជាផ្នែកនៃផលិតផល'))}</span>
    <label>${esc(L('Role', 'តួនាទី'))}
      <select id="hm-role">${ROLES.filter(r => r !== 'owner').map(r => `<option value="${r}"${r === role ? ' selected' : ''}>${esc(L(...ROLE_META[r].name))}</option>`).join('')}<option value="owner">${esc(L(...ROLE_META.owner.name))}</option></select>
    </label>
    <label>${esc(L('State', 'ស្ថានភាព'))}
      <select id="hm-state">${STATES.map(s => `<option value="${s}"${s === state ? ' selected' : ''}>${esc(stateName(s))}</option>`).join('')}</select>
    </label>
    <span class="hm-review-note">${esc(L('Owner / ED opens the existing Executive Overview.', 'ម្ចាស់ / នាយកប្រតិបត្តិបើកទិដ្ឋភាពទូទៅសម្រាប់ថ្នាក់ដឹកនាំដែលមានស្រាប់។'))}</span>
  </div>`;

  let body;
  if (loading) {
    body = loadingSection();
  } else if (state === 'denied') {
    body = deniedSection();
  } else {
    body = `<div class="od-stack" style="--od-gap:24px">
      ${section(['Today’s work', 'ការងារថ្ងៃនេះ'], ['Frequent daily actions', 'សកម្មភាពប្រចាំថ្ងៃញឹកញាប់'], `<div class="hm-actions">${c.actions.map(actionCard).join('')}</div>`)}
      ${state === 'error' ? errorSection(true) : attentionSection(c.attention, state)}
      ${c.shortcuts.length ? section(['Management shortcuts', 'ផ្លូវកាត់គ្រប់គ្រង'], ['Less frequent tasks', 'ការងារតិចញឹកញាប់'], `<div class="hm-shortcuts">${c.shortcuts.map(shortcut).join('')}</div>`) : ''}
    </div>`;
  }

  const main = `<div class="fn-layout">
      <aside>${nav()}</aside>
      <main>
        <div class="hm-main">
          <div class="hm-title">
            <h1>${esc(L('Home', 'ទំព័រដើម'))}</h1>
            <span class="hm-role">${esc(L(...meta.name))}</span>
          </div>
          <p class="hm-op-date">${esc(L('Operating date', 'ថ្ងៃប្រតិបត្តិការ'))}: <strong>${esc(dayLabel())}</strong> · ${esc(L(...meta.scope))}</p>
          ${body}
        </div>
      </main>
    </div>`;

  $('home-app').innerHTML = review + header + main;

  const u = new URL(location.href);
  u.searchParams.set('role', role);
  u.searchParams.set('lang', lang);
  if (state !== 'default') u.searchParams.set('state', state); else u.searchParams.delete('state');
  history.replaceState(null, '', u);
}

function stateName(s) {
  return {
    default: L('Default mixed', 'លាយលំនាំដើម'),
    notstarted: L('Work not yet started', 'ការងារមិនទាន់ចាប់ផ្តើម'),
    continue: L('Work to continue', 'ការងារត្រូវបន្ត'),
    done: L('Completed · view', 'បានបញ្ចប់ · មើល'),
    empty: L('No work waiting', 'គ្មានការងាររង់ចាំ'),
    loading: L('Loading', 'កំពុងផ្ទុក'),
    error: L('Data unavailable', 'ទិន្នន័យមិនមាន'),
    denied: L('Access denied', 'មិនមានសិទ្ធិចូល')
  }[s] || s;
}

/* ---------- events ---------- */

document.addEventListener('click', e => {
  const b = e.target.closest('[data-hm]');
  if (!b) return;
  const a = b.dataset.hm;
  if (a === 'language') { lang = lang === 'en' ? 'km' : 'en'; render(); return; }
  if (a === 'retry') {
    state = 'default';
    render();
    $('home-announcer').textContent = L('Work status restored.', 'ស្ថានភាពការងារបានស្ដារឡើងវិញ។');
    return;
  }
  if (a === 'menu') {
    const d = $('home-note');
    d.innerHTML = `<header><h2 id="home-note-title">${esc(L('Navigation', 'ម៉ឺនុយ'))}</h2><button data-hm="closenote">${esc(L('Close', 'បិទ'))}</button></header><div class="hm-note-body">${nav()}</div>`;
    d.showModal();
    return;
  }
  if (a === 'closenote') { $('home-note').close(); return; }
  if (a === 'info') {
    const d = $('home-card-info');
    d.innerHTML = `<header><h2 id="home-card-info-title">${esc(b.dataset.infoTitle)}</h2><button data-hm="closeinfo">${esc(L('Close', 'បិទ'))}</button></header><div class="hm-note-body"><p>${esc(b.dataset.infoText)}</p></div>`;
    d.showModal();
    return;
  }
  if (a === 'closeinfo') { $('home-card-info').close(); return; }
});

document.addEventListener('change', e => {
  if (e.target.id === 'hm-role') {
    const next = e.target.value;
    localStorage.setItem(STORE + '.role', next);
    if (next === 'owner') { location.href = dest.exec(); return; }
    role = next; render(); return;
  }
  if (e.target.id === 'hm-state') {
    state = e.target.value;
    loading = state === 'loading';
    render();
    if (state === 'loading') setTimeout(() => { loading = false; state = 'default'; render(); }, 1400);
    return;
  }
});

/* ---------- boot ---------- */
if (role === 'owner') {
  location.replace(dest.exec());
} else {
  render();
}
})();
