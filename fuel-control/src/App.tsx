import { useMemo, useRef, useState } from "react";

type Lang = "en" | "km";
type FuelKey = "petroleum" | "super" | "diesel";
type IconName =
  | "chevron"
  | "clock"
  | "document"
  | "drop"
  | "gear"
  | "history"
  | "home"
  | "info"
  | "menu"
  | "paperclip"
  | "search"
  | "truck"
  | "users";

const copy = {
  en: {
    admin: "ADMINISTRATION",
    allSettings: "All settings",
    apply: "Apply new price",
    approved: "Approved quantity today",
    audit: "Audit history",
    auditHint: "Price-specific changes, newest first",
    changed: "Price changed",
    close: "Close",
    current: "Current price",
    dailyImpact: "TODAY’S APPROVED COST IMPACT",
    dashboard: "Dashboard",
    date: "3 October 2026",
    diesel: "Diesel",
    document: "Evidence",
    emptyHistory: "No price changes have been recorded for this fuel type.",
    error: "We couldn’t load the latest price history.",
    evidence: "Price evidence",
    evidenceHint: "Required before this price can be applied",
    exchange: "Exchange rate",
    fileReady: "Attachment ready",
    formatPending: "Accepted formats and limits pending confirmation",
    fuel: "Fuel prices",
    fuelHint: "Manage separate KHR-per-litre prices and supporting evidence.",
    fuelType: "Fuel type",
    generalAdmin: "General Admin",
    history: "View history",
    independent: "Independent prices",
    independentHint:
      "Changing one fuel price does not affect the other types or the exchange rate.",
    invalidPrice: "Enter a price greater than 0 KHR.",
    lang: "ខ្មែរ",
    litre: "KHR / L",
    loading: "Loading fuel prices…",
    navManage: "MANAGEMENT",
    navOverview: "OVERVIEW",
    newPrice: "New price",
    noEvidence: "Attach evidence to apply this change.",
    petroleum: "Petroleum",
    priceSettings: "Fuel price settings",
    readOnly: "Read-only access",
    readOnlyHint:
      "Owner and Executive Director can review prices and evidence, but cannot make changes.",
    recentActivity: "Recent activity",
    retry: "Retry",
    saved: "Price applied successfully",
    savedHint:
      "The other fuel prices, exchange rate, and recorded purchase snapshots were not changed.",
    search: "Search",
    settings: "Settings",
    snapshot: "Purchase snapshots stay unchanged",
    snapshotHint:
      "Recorded purchases retain their applied fuel type, litres, unit price, and subtotal.",
    super: "Super petroleum",
    temporary: "Today’s temporary changes",
    temporaryHint:
      "GA applies temporary adjustments directly. The usual plan is not changed.",
    trucks: "Trucks",
    unit: "All values are KHR per litre",
    upload: "Attach evidence",
    users: "Users",
    usual: "Usual plan unchanged",
    view: "Review",
  },
  km: {
    admin: "រដ្ឋបាល",
    allSettings: "ការកំណត់ទាំងអស់",
    apply: "អនុវត្តតម្លៃថ្មី",
    approved: "បរិមាណបានអនុម័តថ្ងៃនេះ",
    audit: "ប្រវត្តិការកែប្រែ",
    auditHint: "ការផ្លាស់ប្តូរតាមប្រភេទឥន្ធនៈ ថ្មីបំផុតមុន",
    changed: "បានប្តូរតម្លៃ",
    close: "បិទ",
    current: "តម្លៃបច្ចុប្បន្ន",
    dailyImpact: "ផលប៉ះពាល់លើថ្លៃដែលបានអនុម័តថ្ងៃនេះ",
    dashboard: "ទំព័រដើម",
    date: "៣ តុលា ២០២៦",
    diesel: "ម៉ាស៊ូត",
    document: "ភស្តុតាង",
    emptyHistory: "មិនទាន់មានការផ្លាស់ប្តូរតម្លៃសម្រាប់ឥន្ធនៈនេះទេ។",
    error: "មិនអាចទាញយកប្រវត្តិតម្លៃថ្មីបំផុតបានទេ។",
    evidence: "ភស្តុតាងតម្លៃ",
    evidenceHint: "តម្រូវឱ្យមានមុនពេលអនុវត្តតម្លៃនេះ",
    exchange: "អត្រាប្តូរប្រាក់",
    fileReady: "ភស្តុតាងរួចរាល់",
    formatPending: "ប្រភេទ និងទំហំឯកសារកំពុងរង់ចាំការបញ្ជាក់",
    fuel: "តម្លៃឥន្ធនៈ",
    fuelHint: "គ្រប់គ្រងតម្លៃរៀលក្នុងមួយលីត្រ និងភស្តុតាងដាច់ដោយឡែក។",
    fuelType: "ប្រភេទឥន្ធនៈ",
    generalAdmin: "រដ្ឋបាលទូទៅ",
    history: "មើលប្រវត្តិ",
    independent: "តម្លៃដាច់ដោយឡែក",
    independentHint:
      "ការប្តូរតម្លៃមួយមិនប៉ះពាល់ដល់ឥន្ធនៈផ្សេង ឬអត្រាប្តូរប្រាក់ទេ។",
    invalidPrice: "បញ្ចូលតម្លៃធំជាង ០ រៀល។",
    lang: "EN",
    litre: "រៀល / លីត្រ",
    loading: "កំពុងទាញយកតម្លៃឥន្ធនៈ…",
    navManage: "ការគ្រប់គ្រង",
    navOverview: "ទិដ្ឋភាពទូទៅ",
    newPrice: "តម្លៃថ្មី",
    noEvidence: "សូមភ្ជាប់ភស្តុតាងដើម្បីអនុវត្តការផ្លាស់ប្តូរ។",
    petroleum: "ប្រេងសាំង",
    priceSettings: "ការកំណត់តម្លៃឥន្ធនៈ",
    readOnly: "សិទ្ធិបានត្រឹមមើល",
    readOnlyHint:
      "ម្ចាស់ និងនាយកប្រតិបត្តិអាចមើលតម្លៃ និងភស្តុតាង ប៉ុន្តែមិនអាចកែប្រែបានទេ។",
    recentActivity: "សកម្មភាពថ្មីៗ",
    retry: "ព្យាយាមម្តងទៀត",
    saved: "បានអនុវត្តតម្លៃដោយជោគជ័យ",
    savedHint:
      "តម្លៃឥន្ធនៈផ្សេង អត្រាប្តូរប្រាក់ និងទិន្នន័យទិញដែលបានកត់ត្រា មិនបានផ្លាស់ប្តូរ។",
    search: "ស្វែងរក",
    settings: "ការកំណត់",
    snapshot: "ទិន្នន័យទិញរក្សាដដែល",
    snapshotHint:
      "ការទិញដែលបានកត់ត្រារក្សាប្រភេទឥន្ធនៈ លីត្រ តម្លៃ និងសរុបដើម។",
    super: "ប្រេងសាំងស៊ុបពែរ",
    temporary: "ការផ្លាស់ប្តូរបណ្ដោះអាសន្នថ្ងៃនេះ",
    temporaryHint:
      "GA អនុវត្តការកែតម្រូវបណ្ដោះអាសន្នដោយផ្ទាល់។ ផែនការធម្មតាមិនផ្លាស់ប្តូរ។",
    trucks: "រថយន្ត",
    unit: "តម្លៃទាំងអស់គិតជារៀលក្នុងមួយលីត្រ",
    upload: "ភ្ជាប់ភស្តុតាង",
    users: "អ្នកប្រើប្រាស់",
    usual: "ផែនការធម្មតាមិនផ្លាស់ប្តូរ",
    view: "ពិនិត្យ",
  },
} as const;

const fuelMeta: Record<
  FuelKey,
  { name: "petroleum" | "super" | "diesel"; price: number; litres: number; tone: string }
> = {
  petroleum: { name: "petroleum", price: 4500, litres: 30, tone: "amber" },
  super: { name: "super", price: 5000, litres: 10, tone: "violet" },
  diesel: { name: "diesel", price: 4000, litres: 60, tone: "sky" },
};

const history = {
  petroleum: [
    { from: 4400, to: 4500, dateEn: "28 Sep 2026, 9:42 AM", dateKm: "២៨ កញ្ញា ២០២៦, ៩:៤២ ព្រឹក" },
    { from: 4300, to: 4400, dateEn: "12 Sep 2026, 3:18 PM", dateKm: "១២ កញ្ញា ២០២៦, ៣:១៨ រសៀល" },
  ],
  super: [
    { from: 4800, to: 5000, dateEn: "28 Sep 2026, 9:47 AM", dateKm: "២៨ កញ្ញា ២០២៦, ៩:៤៧ ព្រឹក" },
  ],
  diesel: [
    { from: 3900, to: 4000, dateEn: "30 Sep 2026, 11:06 AM", dateKm: "៣០ កញ្ញា ២០២៦, ១១:០៦ ព្រឹក" },
    { from: 3850, to: 3900, dateEn: "19 Sep 2026, 8:31 AM", dateKm: "១៩ កញ្ញា ២០២៦, ៨:៣១ ព្រឹក" },
  ],
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
    drop: <path d="M12 3s6 6.1 6 11a6 6 0 0 1-12 0c0-4.9 6-11 6-11Z" />,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    paperclip: <path d="m9 12 5-5a3 3 0 0 1 4 4l-7 7a5 5 0 0 1-7-7l7-7" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M16 4a3 3 0 0 1 0 6M17 13a5 5 0 0 1 4 5v2" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "secondary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button className={`button button--${variant}`} {...props}>
      {children}
    </button>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const reviewState = params.get("state");
  const readOnly = params.get("access") === "readonly";
  const [lang, setLang] = useState<Lang>(params.get("lang") === "km" ? "km" : "en");
  const [activeFuel, setActiveFuel] = useState<FuelKey>("diesel");
  const [prices, setPrices] = useState<Record<FuelKey, number>>({
    petroleum: 4500,
    super: 5000,
    diesel: 4000,
  });
  const [draft, setDraft] = useState("4200");
  const [fileName, setFileName] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "saving" | "success">("idle");
  const fileRef = useRef<HTMLInputElement>(null);
  const t = copy[lang];
  const draftNumber = Number(draft.replaceAll(",", ""));
  const priceError = draft.length > 0 && (!Number.isFinite(draftNumber) || draftNumber <= 0);
  const costDelta = useMemo(
    () => (Number.isFinite(draftNumber) ? (draftNumber - prices[activeFuel]) * fuelMeta[activeFuel].litres : 0),
    [activeFuel, draftNumber, prices],
  );

  function chooseFuel(key: FuelKey) {
    setActiveFuel(key);
    setDraft(String(prices[key]));
    setFileName("");
    setFeedback("idle");
  }

  function savePrice() {
    if (!fileName || priceError || !draft) return;
    setFeedback("saving");
    window.setTimeout(() => {
      setPrices((current) => ({ ...current, [activeFuel]: draftNumber }));
      setFeedback("success");
    }, 650);
  }

  return (
    <div className="app-shell" lang={lang}>
      <header className="topbar">
        <div className="brand">
          <div className="brand__mark"><span>SH</span></div>
          <div className="brand__name"><strong>Sok Heng</strong><span>Ice Factory</span></div>
        </div>
        <div className="topbar__tools">
          <div className="searchbox"><Icon name="search" /><span>{t.search}</span><kbd>⌘ K</kbd></div>
          <Button variant="ghost" className="language" onClick={() => setLang(lang === "en" ? "km" : "en")}>{t.lang}</Button>
          <div className="avatar">SR</div>
          <div className="user-meta"><strong>Sreypov R.</strong><span>{t.generalAdmin}</span></div>
        </div>
      </header>

      <aside className="sidebar">
        <NavGroup label={t.navOverview} items={[{ icon: "home", label: t.dashboard }]} />
        <NavGroup label={t.navManage} items={[
          { icon: "truck", label: t.trucks },
          { icon: "users", label: t.users },
        ]} />
        <NavGroup label={t.admin} items={[
          { icon: "gear", label: t.settings, active: true },
        ]} />
        <div className="sidebar__bottom">
          <div className="support-card">
            <Icon name="info" />
            <div><strong>{t.independent}</strong><span>{t.independentHint}</span></div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="mobile-bar">
          <Icon name="menu" />
          <strong>{t.priceSettings}</strong>
          <Button variant="ghost" className="language" onClick={() => setLang(lang === "en" ? "km" : "en")}>{t.lang}</Button>
        </div>

        <div className="breadcrumbs">
          <span>{t.settings}</span><Icon name="chevron" size={14} /><strong>{t.fuel}</strong>
        </div>

        <section className="page-header">
          <div>
            <p className="eyebrow">{t.admin}</p>
            <h1>{t.priceSettings}</h1>
            <p>{t.fuelHint}</p>
          </div>
          <div className="date-chip"><span className="status-dot" />{t.date}</div>
        </section>

        {readOnly && (
          <div className="notice notice--warning">
            <Icon name="info" />
            <div><strong>{t.readOnly}</strong><span>{t.readOnlyHint}</span></div>
          </div>
        )}

        {reviewState === "loading" ? (
          <LoadingState label={t.loading} />
        ) : reviewState === "error" ? (
          <div className="state-card">
            <div className="state-icon state-icon--error">!</div>
            <strong>{t.error}</strong>
            <Button onClick={() => window.history.replaceState({}, "", window.location.pathname)}>{t.retry}</Button>
          </div>
        ) : (
          <>
            <section className="price-grid" aria-label={t.fuel}>
              {(Object.keys(fuelMeta) as FuelKey[]).map((key) => {
                const item = fuelMeta[key];
                const active = activeFuel === key;
                return (
                  <button className={`price-card ${active ? "price-card--active" : ""}`} onClick={() => chooseFuel(key)} key={key}>
                    <div className="price-card__top">
                      <span className={`fuel-icon fuel-icon--${item.tone}`}><Icon name="drop" /></span>
                      {active && <span className="selected-pill">{t.view}</span>}
                    </div>
                    <span className="price-card__label">{t[item.name]}</span>
                    <strong className="price-card__price">{formatNumber(prices[key])}</strong>
                    <span className="price-card__unit">{t.litre}</span>
                  </button>
                );
              })}
            </section>

            <div className="unit-line"><Icon name="info" size={15} />{t.unit}</div>

            <section className="workspace">
              <div className="edit-card">
                <div className="card-heading">
                  <div>
                    <p className="eyebrow">{t.fuelType}</p>
                    <h2>{t[fuelMeta[activeFuel].name]}</h2>
                  </div>
                  <span className="current-pill">{t.current}: <b>{formatNumber(prices[activeFuel])}</b> {t.litre}</span>
                </div>

                {feedback === "success" && (
                  <div className="notice notice--success">
                    <span className="checkmark">✓</span>
                    <div><strong>{t.saved}</strong><span>{t.savedHint}</span></div>
                    <Button variant="ghost" onClick={() => setFeedback("idle")}>{t.close}</Button>
                  </div>
                )}

                <div className="form-section">
                  <label htmlFor="price">{t.newPrice}</label>
                  <div className={`price-input ${priceError ? "price-input--error" : ""}`}>
                    <input id="price" inputMode="numeric" value={draft} disabled={readOnly} onChange={(event) => {
                      setDraft(event.target.value.replace(/[^\d]/g, ""));
                      setFeedback("idle");
                    }} />
                    <span>{t.litre}</span>
                  </div>
                  {priceError && <p className="field-error">{t.invalidPrice}</p>}
                </div>

                <div className="impact-panel">
                  <div>
                    <span>{t.approved}</span>
                    <strong>{fuelMeta[activeFuel].litres} L</strong>
                  </div>
                  <div>
                    <span>{t.dailyImpact}</span>
                    <strong className={costDelta > 0 ? "impact-up" : costDelta < 0 ? "impact-down" : ""}>
                      {costDelta > 0 ? "+" : ""}{formatNumber(costDelta)} KHR
                    </strong>
                  </div>
                  <span className="usual-pill">{t.usual}</span>
                </div>

                <div className="form-section">
                  <div className="label-row">
                    <label>{t.evidence}<span className="required">*</span></label>
                    <span>{t.evidenceHint}</span>
                  </div>
                  <input ref={fileRef} className="file-input" type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
                  <button className={`upload-box ${fileName ? "upload-box--filled" : ""}`} disabled={readOnly} onClick={() => fileRef.current?.click()}>
                    <span className="upload-icon"><Icon name={fileName ? "document" : "paperclip"} /></span>
                    <span><strong>{fileName || t.upload}</strong><small>{fileName ? t.fileReady : t.formatPending}</small></span>
                  </button>
                  {!fileName && draftNumber !== prices[activeFuel] && <p className="field-hint">{t.noEvidence}</p>}
                </div>

                {!readOnly && (
                  <div className="form-actions">
                    <Button
                      variant="primary"
                      disabled={!fileName || priceError || !draft || draftNumber === prices[activeFuel] || feedback === "saving"}
                      onClick={savePrice}
                    >
                      {feedback === "saving" && <span className="spinner" />}
                      {t.apply}
                    </Button>
                  </div>
                )}
              </div>

              <aside className="history-card">
                <div className="card-heading">
                  <div><p className="eyebrow">{t.recentActivity}</p><h2>{t.audit}</h2><p>{t.auditHint}</p></div>
                  <span className="history-icon"><Icon name="history" /></span>
                </div>
                <div className="timeline">
                  {reviewState === "empty" ? (
                    <div className="empty-history"><Icon name="clock" /><span>{t.emptyHistory}</span></div>
                  ) : history[activeFuel].map((item, index) => (
                    <div className="timeline__item" key={item.dateEn}>
                      <span className="timeline__dot" />
                      <div className="timeline__content">
                        <div className="timeline__title"><strong>{t.changed}</strong><span>{index === 0 ? "Latest" : ""}</span></div>
                        <div className="price-change"><span>{formatNumber(item.from)}</span><span>→</span><strong>{formatNumber(item.to)} KHR/L</strong></div>
                        <div className="timeline__meta"><span>Sreypov R. · {t.generalAdmin}</span><span>{lang === "en" ? item.dateEn : item.dateKm}</span></div>
                        <button className="evidence-link"><Icon name="document" size={15} />{t.document}<Icon name="chevron" size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </section>

            <section className="assurance-grid">
              <Assurance icon="document" title={t.snapshot} text={t.snapshotHint} />
              <Assurance icon="clock" title={t.temporary} text={t.temporaryHint} />
            </section>
          </>
        )}
      </main>

      <nav className="mobile-nav">
        <MobileNav icon="home" label={t.dashboard} />
        <MobileNav icon="truck" label={t.trucks} />
        <MobileNav icon="gear" label={t.settings} active />
      </nav>
    </div>
  );
}

function NavGroup({ label, items }: { label: string; items: { icon: IconName; label: string; active?: boolean }[] }) {
  return (
    <div className="nav-group">
      <span className="nav-group__label">{label}</span>
      {items.map((item) => (
        <button className={`nav-item ${item.active ? "nav-item--active" : ""}`} key={item.label}>
          <Icon name={item.icon} /><span>{item.label}</span>{item.active && <Icon name="chevron" size={14} />}
        </button>
      ))}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="loading-state">
      <div className="loading-title"><span className="skeleton skeleton--icon" /><div><span className="skeleton skeleton--short" /><span className="skeleton skeleton--long" /></div></div>
      <div className="loading-cards">{[1, 2, 3].map((item) => <span className="skeleton skeleton--card" key={item} />)}</div>
      <span>{label}</span>
    </div>
  );
}

function Assurance({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="assurance"><span><Icon name={icon} /></span><div><strong>{title}</strong><p>{text}</p></div></div>
  );
}

function MobileNav({ icon, label, active }: { icon: IconName; label: string; active?: boolean }) {
  return <button className={active ? "active" : ""}><Icon name={icon} /><span>{label}</span></button>;
}
