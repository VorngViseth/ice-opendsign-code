(() => {
'use strict';
function operationLinks(language){const km=language==='km';return [['dispatch-planning.html','Dispatch Planning','រៀបចំដំណើរ'],['dispatch.html','Load & Verify','ផ្ទុក និងផ្ទៀងផ្ទាត់'],['dispatch-returns.html','Record returns','កត់ត្រាត្រឡប់'],['dispatch-ice-return-3.html','Ice returns','ទឹកកកត្រឡប់'],['fuel-procurement.html','Fuel procurement','ការទិញប្រេងឥន្ធនៈ']].map(p=>`<a class="nav-item" href="${p[0]}?lang=${language}">${km?p[2]:p[1]}</a>`).join('');}

let lang=new URLSearchParams(location.search).get('lang')==='km'?'km':'en', active=null, busy=false, submitted=false, failure='', search='', filter='all';
const $=id=>document.getElementById(id), L=(en,km)=>lang==='km'?km:en;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const products=[['Block ice','ទឹកកកដុំ','per block','ក្នុងមួយដុំ'],['Tube ice','ទឹកកកបំពង់','per bag','ក្នុងមួយបាវ'],['Crushed ice','ទឹកកកកិន','per bag','ក្នុងមួយបាវ']];
const customers=window.IceDispatchData.customers;
const standardPrices=[5200,3200,2600];
let records=[];
const trips=JSON.parse(JSON.stringify(window.IceDispatchData.trips));
const localToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const TRIP_BATCH=6;
let trip=null,tripSearch='',tripScroll=0,tripDate=localToday(),tripLimit=TRIP_BATCH,tripLoading=false,tripObserver=null,tripLoadTimer=null,tripGeneration=0;
function cancelTripLoad(){tripObserver?.disconnect();clearTimeout(tripLoadTimer);tripLoading=false;tripGeneration++;}
function filteredTrips(){return trips.filter(t=>(!tripDate||t.dateKey===tripDate)&&[t.id,t.date,t.truck,...t.route,...t.driver,...t.salesperson].join(' ').toLowerCase().includes(tripSearch.toLowerCase().trim())).sort((a,b)=>b.dateKey.localeCompare(a.dateKey)||a.id.localeCompare(b.id));}
function resetTripFilters(){cancelTripLoad();tripLimit=TRIP_BATCH;tripScroll=0;tripRows();}
function loadMoreTrips(){
 if(trip||tripLoading||tripLimit>=filteredTrips().length)return;
 tripObserver?.disconnect();tripLoading=true;const generation=tripGeneration;tripRows();
 tripLoadTimer=setTimeout(()=>{if(generation!==tripGeneration||trip)return;tripLoading=false;tripLimit+=TRIP_BATCH;tripRows();},650);
}

// Historical sample configuration is owned outside the cashier workflow.
const RECEIPT_RATES=Object.freeze(Object.fromEntries(trips.map(t=>[t.id,4000])));
const receiptEntry=new URLSearchParams(location.search).get('tab')==='receipts'||new URLSearchParams(location.search).get('view')==='issue';
const STORAGE_KEY='ice-factory.driver-sales.v1'+(['three','recorded','empty','failure'].includes(new URLSearchParams(location.search).get('receipts'))?'.receipts-demo.'+new URLSearchParams(location.search).get('receipts'):'');
let storageIssue=false;
const FACTORY_RECIPIENT=Object.freeze({id:'factory-sample',name:['Factory bank account · sample configuration','គណនីធនាគាររោងចក្រ · ការកំណត់គំរូ']});
const PHOTO_LIMIT=600000;
function validTransfer(t){return t&&t.recipientId===FACTORY_RECIPIENT.id&&Array.isArray(t.recipientName)&&t.recipientName.length===2&&t.recipientName.every(v=>typeof v==='string')&&typeof t.amount==='number'&&Number.isFinite(t.amount)&&t.amount>0&&['KHR','USD'].includes(t.currency)&&t.status==='pending'&&typeof t.capturedAt==='string'&&t.photo&&typeof t.photo.url==='string'&&t.photo.url.length<=PHOTO_LIMIT&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(t.photo.url)&&Number.isInteger(t.photo.width)&&t.photo.width>0&&t.photo.width<=1280&&Number.isInteger(t.photo.height)&&t.photo.height>0&&t.photo.height<=1280;}
function transferMatches(t,d){return validTransfer(t)&&d.method==='khqr'&&t.amount===Number(d.amount)&&t.currency===d.currency;}
function transferMoney(amount,currency){return currency==='USD'?Number(amount).toFixed(2)+' USD':money(amount);}

const receiptKey=value=>value.normalize('NFKC').trim().toLowerCase();
function readSales(){
 const raw=localStorage.getItem(STORAGE_KEY);
 if(raw===null)return {version:1,sales:[]};
 const data=JSON.parse(raw);
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 const valid=r=>r&&typeof r.dispatchId==='string'&&typeof r.id==='string'&&r.id.trim()&&r.status==='recorded'&&['registered','occasional'].includes(r.buyerType)&&Array.isArray(r.name)&&r.name.length===2&&r.name.every(n=>typeof n==='string')&&(r.customer===null||typeof r.customer==='string')&&Array.isArray(r.prices)&&r.prices.length===3&&r.prices.every(n=>n===null||finite(n)&&n>=0)&&r.saved&&Array.isArray(r.saved.q)&&r.saved.q.length===3&&r.saved.q.every(n=>finite(n)&&n>=0)&&['cash','khqr'].includes(r.saved.method)&&['KHR','USD'].includes(r.saved.currency)&&['amount','rate','total','received','applied','balance','change','adjustment','targetCents'].every(k=>finite(r.saved[k]))&&typeof r.saved.fullUsd==='boolean'&&(r.transfer==null||(validTransfer(r.transfer)&&r.saved.method==='khqr'&&r.transfer.amount===r.saved.amount&&r.transfer.currency===r.saved.currency));
 if(!data||data.version!==1||!Array.isArray(data.sales)||!data.sales.every(valid))throw new Error('storage-format');
 const keys=new Set();for(const r of data.sales){const key=JSON.stringify([r.dispatchId,receiptKey(r.id)]);if(keys.has(key))throw new Error('storage-duplicate');keys.add(key);}
 return data;
}
function loadSales(data){
 for(const t of trips)t.sales=data.sales.filter(r=>r.dispatchId===t.id);
 if(trip)records=trip.sales;
 storageIssue=false;
}
function storageNotice(){
 document.getElementById('storage-notice')?.remove();
 if(!storageIssue)return;
 const box=document.createElement('p');box.id='storage-notice';box.className='dr-error-box';box.setAttribute('role','alert');
 box.textContent=L('Saved sales could not be read. Existing storage has not been changed. Restore browser storage access and retry; new sales cannot be saved until it is readable.','មិនអាចអានការលក់ដែលបានរក្សាទុក។ ទិន្នន័យចាស់មិនបានផ្លាស់ប្តូរ។ សូមស្ដារការចូលប្រើកន្លែងរក្សាទុក ហើយសាកម្ដងទៀត។');
 document.querySelector('.dr-main')?.prepend(box);
}
function shell(){renderShell();storageNotice();}

const receiptViews=new Map();
const navIcon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 4h14v16l-3-2-4 2-4-2-3 2V4Z"/><path d="M8 8h8M8 12h6"/></svg>';
function moduleUrl(file){return file+'?lang='+lang;}
function hasDraft(){return [...drafts.values()].some(d=>d.receipt.trim()||d.customerId||d.buyerName.trim()||d.q.some(q=>Number(q)!==0)||Number(d.amount)!==0);}
function navigateDispatch(id){
 if(busy)return;
 const hash=id?'#dispatch='+encodeURIComponent(id):'';
 try{history.pushState(null,'',location.pathname+location.search+hash);}catch(_){/* Embedded previews may restrict history; the screen still opens. */}
 route(id);
}
function route(dispatchId){
 if(busy){history.replaceState(null,'','#dispatch='+trip.id);return;}
 if(trip)receiptViews.set(trip.id,{search,filter,scroll:window.scrollY});
 if($('sale-panel').open)$('sale-panel').close();active=null;
 const id=typeof dispatchId==='string'?dispatchId:new URLSearchParams(location.hash.slice(1)).get('dispatch');
 trip=trips.find(t=>t.id===id)||null;records=trip?trip.sales:[];
 const view=trip?receiptViews.get(trip.id):null;search=view?.search||'';filter=view?.filter||'all';shell();
 if(id&&!trip){document.querySelector('.dr-main').innerHTML=`<h1>${L('Dispatch not found','រកមិនឃើញការចែកចាយ')}</h1><p>${L('Choose an existing trip from the dispatch list.','ជ្រើសដំណើរដែលមានក្នុងបញ្ជី។')}</p><a class="dr-back" href="#" data-action="dispatches">${L('Back to dispatches','ត្រឡប់ទៅបញ្ជីចែកចាយ')}</a>`;}
 requestAnimationFrame(()=>window.scrollTo(0,trip?(view?.scroll||0):tripScroll));
}
function tripRows(){
 if(trip||!$('trip-list'))return;tripObserver?.disconnect();
 const matches=filteredTrips();
 $('trip-list').innerHTML=matches.length?matches.slice(0,tripLimit).map(t=>`<article class="dr-trip-card"><div class="dr-trip-card-top"><strong>${t.id}</strong><span class="dr-trip">${L('Dispatch','ដំណើរចែកចាយ')}</span></div><dl class="dr-context"><div><dt>${L('Date','កាលបរិច្ឆេទ')}</dt><dd>${t.date}</dd></div><div><dt>${L('Truck','រថយន្ត')}</dt><dd>${t.truck}</dd></div><div><dt>${L('Route','ផ្លូវ')}</dt><dd>${L(...t.route)}</dd></div><div><dt>${L('Driver','អ្នកបើកបរ')}</dt><dd>${L(...t.driver)}</dd></div><div><dt>${L('Salesperson','អ្នកលក់')}</dt><dd>${L(...t.salesperson)}</dd></div><div><dt>${L('Registered customers','អតិថិជនចុះឈ្មោះ')}</dt><dd>${fmt(t.customerIds.length)}</dd></div></dl><div class="dr-trip-card-bottom"><button type="button" class="dr-open-trip" data-trip="${t.id}">${L('Open dispatch','បើកដំណើរ')}</button></div></article>`).join(''):`<div class="dr-empty"><h2>${L('No matching dispatches','គ្មានការចែកចាយត្រូវគ្នា')}</h2><p>${L('Choose another date or clear the filters.','ជ្រើសកាលបរិច្ឆេទផ្សេង ឬសម្អាតតម្រង។')}</p><button data-action="clear-trips">${L('Clear filters','សម្អាតតម្រង')}</button></div>`;
 const shown=Math.min(tripLimit,matches.length),more=shown<matches.length;
 $('trip-count').textContent=L('Showing '+shown+' of '+matches.length+' dispatches','បង្ហាញ '+shown+' ក្នុងចំណោម '+matches.length+' ដំណើរ');
 $('trip-list').setAttribute('aria-busy',String(tripLoading));
 $('trip-loader').innerHTML=tripLoading?`<div class="dr-trip-skeleton" aria-hidden="true"><span></span><span></span><span></span></div><p role="status">${L('Loading more dispatches…','កំពុងផ្ទុកដំណើរបន្ថែម…')}</p>`:more?`<button type="button" data-action="more-trips">${L('Load more','ផ្ទុកបន្ថែម')}</button>`:matches.length?`<p>${L('All matching dispatches loaded','បានផ្ទុកដំណើរត្រូវគ្នាទាំងអស់')}</p>`:'';
 if(more&&!tripLoading&&'IntersectionObserver' in window){tripObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadMoreTrips();},{rootMargin:'0px 0px 160px 0px'});tripObserver.observe($('trip-loader'));}
 const today=$('trips-today');if(today)today.setAttribute('aria-pressed',String(tripDate===localToday()));

}
function renderShell(){
 if(trip){cancelTripLoad();receiptShell();return;}
 document.documentElement.lang=lang;
 $('driver-app').innerHTML=`<header class="dr-header"><div class="od-row"><button class="dr-menu" data-action="menu" aria-label="${L('Open navigation','បើកម៉ឺនុយ')}">${navIcon}</button><a class="dr-brand" href="${moduleUrl('index.html')}"><span class="dr-mark">S</span><strong>${L('Sok Heng','សុខ ហេង')}</strong></a></div><button data-action="language">${lang==='en'?'ខ្មែរ':'English'}</button></header><div class="dr-layout"><aside class="dr-sidebar">${navigation()}</aside><main class="dr-main"><div class="dr-breadcrumb">${L('Sales / Driver sales','ការលក់ / ការលក់តាមអ្នកបើកបរ')}<span class="dr-sample">${L('Sample data · simulated sales','ទិន្នន័យគំរូ · ការលក់សាកល្បង')}</span></div><div class="dr-title"><div><p class="dr-eyebrow">${L('DRIVER SALES','ការលក់តាមអ្នកបើកបរ')}</p><h1>${L('Select a dispatch','ជ្រើសរើសការចែកចាយ')}</h1></div></div><div class="dr-dispatch-filters"><label class="od-field dr-trip-search">${L('Find a sale trip','ស្វែងរកដំណើរលក់')}<input id="trip-search" type="search" value="${esc(tripSearch)}" placeholder="${L('Reference, truck, route or staff','លេខយោង រថយន្ត ផ្លូវ ឬបុគ្គលិក')}"></label><div class="dr-date-tools"><label class="od-field">${L('Dispatch date','កាលបរិច្ឆេទចែកចាយ')}<input id="trip-date" type="date" value="${esc(tripDate)}"></label><button type="button" id="trips-today" data-action="trips-today">${L('Today','ថ្ងៃនេះ')}</button><button type="button" data-action="all-trip-dates">${L('All dates','គ្រប់កាលបរិច្ឆេទ')}</button></div></div><p id="trip-count" class="dr-trip-count" role="status"></p><div id="trip-list" class="od-stack"></div><div id="trip-loader" class="dr-trip-loader"></div></main></div>`;tripRows();
}
const drafts=new Map();
const fmt=n=>new Intl.NumberFormat(lang==='km'?'km-KH':'en-US',{maximumFractionDigits:2}).format(n);
const money=n=>`${fmt(n)} KHR`;
const status=s=>({pending:L('Not yet accounted for','មិនទាន់បានដោះស្រាយ'),blank:L('Returned without purchase','បានត្រឡប់ដោយគ្មានការទិញ'),recorded:L('Sale recorded','បានកត់ត្រាការលក់')})[s];
const coverage=(total,received)=>received===0?L('Unpaid','មិនទាន់ទូទាត់'):received<total?L('Partially paid','ទូទាត់មួយផ្នែក'):L('Fully paid','ទូទាត់ពេញ');
const info=(key,label)=>`<button type="button" class="dr-info" data-help="${key}" aria-label="${esc(label)}"><span aria-hidden="true">i</span></button>`;
const badge=s=>`<span class="dr-badge ${s}">${status(s)}</span>`;
const help={
receipts:()=>L('Receipt preparation and return outcomes belong to #157. An unaccounted-for receipt is not a no-purchase receipt. Only entering a completed receipt creates a simulated sale. Blank returns create no sale, payment or debt.','ការរៀបចំបង្កាន់ដៃ និងលទ្ធផលត្រឡប់ ស្ថិតក្នុង #157។ បង្កាន់ដៃមិនទាន់ដោះស្រាយ មិនមែនគ្មានការទិញទេ។ មានតែការកត់ត្រាបង្កាន់ដៃលក់ពេញលេញប៉ុណ្ណោះ ដែលបង្កើតការលក់គំរូ។'),
actual:()=>L('Enter quantities actually sold on the paper receipt. Split-bag quantity, pricing and conversion rules are unresolved; fractional entries are retained but cannot be finalized in this prototype.','បញ្ចូលបរិមាណដែលបានលក់ពិតប្រាកដលើបង្កាន់ដៃក្រដាស។ ច្បាប់លក់បំបែកបាវ តម្លៃ និងការបម្លែង មិនទាន់កំណត់។'),
pricing:()=>L('These are labelled historical sample prices effective on the sample sale date, not current prices or a confirmed backend selection policy. Registered customers use assigned prices; occasional buyers use standard prices. Missing prices and paper-price differences need review outside this form.','នេះជាតម្លៃគំរូប្រវត្តិសាស្ត្រតាមថ្ងៃលក់ មិនមែនតម្លៃបច្ចុប្បន្ន ឬគោលការណ៍ប្រព័ន្ធដែលបានអនុម័តទេ។ អតិថិជនចុះឈ្មោះប្រើតម្លៃកំណត់ និងអ្នកទិញមិនចុះឈ្មោះប្រើតម្លៃស្តង់ដារ។'),
payment:()=>L('Both buyer types may pay fully, partially or leave debt. Zero received means unpaid. Cash is KHR with change; KHQR is KHR or USD into the driver account. The USD full-payment target is rounded to the nearest cent, with the exchange adjustment recorded. KHQR above that target is blocked. The original payment exchange rate is configured outside this form and cannot be changed by the cashier. Factory settlement is separate.','អ្នកទិញទាំងពីរប្រភេទអាចទូទាត់ពេញ មួយផ្នែក ឬជំពាក់។ សូន្យមានន័យថាមិនទាន់ទូទាត់។ សាច់ប្រាក់ជា KHR ជាមួយប្រាក់អាប់។ KHQR ជា KHR ឬ USD ចូលគណនីអ្នកបើកបរ។ ប្រាក់ពេញជា USD បង្គត់ទៅសេនជិតបំផុត និងកត់ត្រាការកែតម្រូវ។ មិនអនុញ្ញាត KHQR លើសចំនួននេះ។ ប្រើអត្រាពេលទូទាត់ដើម។ ការប្រគល់ទៅរោងចក្រដាច់ដោយឡែក។'),
evidence:()=>L('Photograph the driver’s completed transfer to the factory for this sale. The transfer matches the customer payment amount and currency. A photo leaves bank reconciliation pending and never pays customer debt a second time.','ថតរូបការផ្ទេររបស់អ្នកបើកបរទៅរោងចក្រសម្រាប់ការលក់នេះ។ ចំនួន និងរូបិយប័ណ្ណដូចប្រាក់ទទួលពីអតិថិជន។ រូបថតនៅតែរង់ចាំផ្ទៀងផ្ទាត់ធនាគារ និងមិនកាត់បំណុលម្ដងទៀត។'),
settlement:()=>L('Customer payment is money held by the driver until a separate settlement. Cash handover and driver-to-factory transfers must not create another sale or reduce customer debt again. Unsold ice belongs to the physical return flow, never a negative sale here.','ប្រាក់អតិថិជនស្ថិតនៅអ្នកបើកបរ រហូតដល់ការប្រគល់ប្រាក់ដាច់ដោយឡែក។ ការប្រគល់សាច់ប្រាក់ និងផ្ទេរមករោងចក្រ មិនបង្កើតការលក់ថ្មី ឬកាត់បំណុលម្ដងទៀតទេ។ ទឹកកកសល់ស្ថិតក្នុងលំហូរត្រឡប់ទំនិញ។')
};
// Local presentation change: retain sale/receipt logic and per-dispatch tab selection.
const dispatchTabs=new Map();
function selectDispatchTab(value,focus=false){
 if(!trip)return;
 const selected=value==='receipts'?'receipts':'sales';
 dispatchTabs.set(trip.id,selected);
 document.querySelectorAll('[data-dispatch-tab]').forEach(button=>{
  const current=button.dataset.dispatchTab===selected;
  button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;
  if(current&&focus)button.focus();
 });
 $('issued-receipts').hidden=selected!=='receipts';
 $('recorded-sales').hidden=selected!=='sales';
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-dispatch-tab]');
 if(button)selectDispatchTab(button.dataset.dispatchTab);
});
document.addEventListener('keydown',event=>{
 const button=event.target.closest('[data-dispatch-tab]');
 if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 event.preventDefault();
 const value=event.key==='Home'?'receipts':event.key==='End'?'sales':button.dataset.dispatchTab==='receipts'?'sales':'receipts';
 selectDispatchTab(value,true);
});
function receiptShell(){
 document.documentElement.lang=lang==='km'?'km':'en';
 $('driver-app').innerHTML=`<header class="dr-header"><div class="od-row"><button class="dr-menu" data-action="menu" aria-label="${L('Open navigation','បើកម៉ឺនុយ')}">${navIcon}</button><a class="dr-brand" href="${moduleUrl('index.html')}"><span class="dr-mark">S</span><span class="od-field"><strong>${L('Sok Heng','សុខ ហេង')}</strong><small>${L('FACTORY WORKSPACE','ប្រព័ន្ធរោងចក្រ')}</small></span></a></div><div class="od-row"><span class="dr-staff">${L('Factory staff','បុគ្គលិករោងចក្រ')}</span><button data-action="language" aria-label="${L('Switch to Khmer','ប្ដូរទៅភាសាអង់គ្លេស')}">${lang==='en'?'ខ្មែរ':'English'}</button></div></header>
 <div class="dr-layout"><aside class="dr-sidebar">${navigation()}</aside><main class="dr-main"><a class="dr-back" href="#" data-action="dispatches">${L('Back to dispatches','ត្រឡប់ទៅបញ្ជីចែកចាយ')}</a><div class="dr-breadcrumb">${L('Sales / Driver returns','ការលក់ / បង្កាន់ដៃអ្នកបើកបរ')} <span class="dr-sample">${L('Sample data · simulated sales','ទិន្នន័យគំរូ · ការលក់សាកល្បង')}</span></div><div class="dr-title"><div><p class="dr-eyebrow">${L('DISPATCH SALES','ការលក់តាមដំណើរ')}</p><h1>${L('Driver sales','ការលក់តាមអ្នកបើកបរ')}</h1></div><span class="dr-trip">${L('Dispatch','ដំណើរចែកចាយ')}</span></div>
 <section class="dr-dispatch" aria-label="${L('Dispatch context','ព័ត៌មានចែកចាយ')}"><div class="dr-dispatch-top"><strong>${trip.id}</strong><span>${L('Existing dispatch','ការចែកចាយដែលមានស្រាប់')}</span></div><dl class="dr-context"><div><dt>${L('Sale / trip date','ថ្ងៃលក់ / ដំណើរ')}</dt><dd>${trip.date}</dd></div><div><dt>${L('Truck','រថយន្ត')}</dt><dd>${internalTruck(trip)} · ${L('sample ID','លេខគំរូ')}<br>${trip.truck}</dd></div><div><dt>${L('Route','ផ្លូវចែកចាយ')}</dt><dd>${L(...trip.route)}</dd></div><div><dt>${L('Driver','អ្នកបើកបរ')}</dt><dd>${L(...trip.driver)}</dd></div><div><dt>${L('Salesperson','អ្នកលក់')}</dt><dd>${L(...trip.salesperson)}</dd></div></dl></section>
 <div class="dr-dispatch-tabs" role="tablist" aria-label="${L('Dispatch workspace','ផ្នែកការងារចែកចាយ')}"><button type="button" role="tab" id="tab-receipts" data-dispatch-tab="receipts" aria-controls="issued-receipts" aria-selected="false" tabindex="-1">${L('Dispatch receipts','បង្កាន់ដៃចែកចាយ')}</button><button type="button" role="tab" id="tab-sales" data-dispatch-tab="sales" aria-controls="recorded-sales" aria-selected="true">${L('Record sales','កត់ត្រាការលក់')}</button></div><section id="issued-receipts" class="dr-receipts rx-section" role="tabpanel" aria-labelledby="tab-receipts" tabindex="0" aria-label="${L('Dispatch receipts','បង្កាន់ដៃចែកចាយ')}"></section><section id="recorded-sales" class="dr-receipts" role="tabpanel" aria-labelledby="tab-sales" tabindex="0"><div class="dr-section-title"><h2>${L('Recorded sales','ការលក់បានកត់ត្រា')}</h2></div><div id="receipt-list"></div><div class="dr-add-sale"><button class="dr-primary" data-action="add-sale">${L('Add sale','បន្ថែមការលក់')}</button></div></section><div class="dr-separate"><span>${L('Driver settlement & physical returns are separate','ការប្រគល់ប្រាក់ និងត្រឡប់ទំនិញដាច់ដោយឡែក')}</span>${info('settlement',L('Settlement boundaries','ព្រំដែនការប្រគល់ប្រាក់'))}</div></main></div>`;
 list();issuedRows();selectDispatchTab(dispatchTabs.get(trip.id)||(receiptEntry?'receipts':'sales'));
 const back=document.createElement('a');back.className='wf-action';back.href=(window.DispatchStore.get(trip.id)?.status==='created'?'dispatch.html':'dispatch-returns.html')+'?lang='+lang+'#'+encodeURIComponent(trip.id);back.textContent=window.DispatchStore.get(trip.id)?.status==='created'?L('Back to Load & Verify','ត្រឡប់ទៅផ្ទុក និងផ្ទៀងផ្ទាត់'):L('Back to Record returns','ត្រឡប់ទៅកត់ត្រាត្រឡប់');document.querySelector('.dr-main').prepend(back);
}
function navigation(){return `${operationLinks(lang)}<nav aria-label="${L('Sales navigation','ម៉ឺនុយការលក់')}"><p class="dr-eyebrow">${L('SALES','ការលក់')}</p><a href="${moduleUrl('index.html')}">${navIcon}${L('Walk-in sales','ការលក់ផ្ទាល់')}</a><a href="${moduleUrl('driver-sales.html')}" data-action="dispatches" aria-current="page">${navIcon}${L('Driver sales','ការលក់តាមអ្នកបើកបរ')}</a><a href="${moduleUrl('debt-collection.html')}">${navIcon}${L('Debt collection','ការប្រមូលបំណុល')}</a></nav><nav aria-label="${lang==='km'?'ហិរញ្ញវត្ថុ':'Finance'}"><p class="dr-eyebrow">${lang==='km'?'ហិរញ្ញវត្ថុ':'FINANCE'}</p><a class="nav-item" href="daily-finance.html?lang=${lang}">${lang==='km'?'ហិរញ្ញវត្ថុប្រចាំថ្ងៃ':'Daily Finance'}</a></nav>`;}
function list(){
 const matches=records;
 $('receipt-list').innerHTML=matches.length?matches.map(r=>`<article class="dr-receipt dr-sale-tile"><h3>${esc(L(...r.name))}</h3><button data-open="${esc(r.id)}">${L('View details','មើលព័ត៌មាន')}</button><div class="dr-sale-meta"><span>${coverage(r.saved.total,r.saved.applied)} · ${money(r.saved.total)}</span><span>${L('Unpaid','មិនទាន់ទូទាត់')}: ${money(r.saved.balance)}</span></div><span class="dr-sale-receipt">${esc(r.id)}</span></article>`).join(''):`<div class="dr-empty"><h3>${records.length?L('No matching sales','គ្មានការលក់ត្រូវគ្នា'):L('No sales recorded yet','មិនទាន់មានការលក់បានកត់ត្រា')}</h3><p>${records.length?L('Search by receipt number or customer.','ស្វែងរកតាមលេខបង្កាន់ដៃ ឬអតិថិជន។'):L('Select Add sale to choose a prepared receipt.','ចុចបន្ថែមការលក់ ដើម្បីជ្រើសបង្កាន់ដៃដែលបានរៀបចំ។')}</p></div>`;
}
function addSale(){
 if(busy||!trip)return;
 recordingReceiptFilter='open';selectReceiptForSale();
}
let customerSearch='',customerPage=0;
function customerRows(){
 const matches=customers.filter(c=>[c.id,...c.name].join(' ').toLowerCase().includes(customerSearch.trim().toLowerCase()));
 const pages=Math.max(1,Math.ceil(matches.length/8));customerPage=Math.min(customerPage,pages-1);
 $('customer-results').innerHTML=matches.slice(customerPage*8,customerPage*8+8).map(c=>`<button class="dr-customer-option od-field" data-customer="${c.id}"><strong>${esc(L(...c.name))}</strong><span>${c.id}${trip.customerIds.includes(c.id)?' · '+L('On this trip','ក្នុងដំណើរនេះ'):''}</span></button>`).join('')||`<p>${L('No matching customers','គ្មានអតិថិជនត្រូវគ្នា')}</p>`;
 $('customer-pages').innerHTML=`<button data-action="customer-prev" ${customerPage===0?'disabled':''}>${L('Previous','មុន')}</button><span>${customerPage+1} / ${pages}</span><button data-action="customer-next" ${customerPage+1>=pages?'disabled':''}>${L('Next','បន្ទាប់')}</button>`;
}
function chooseCustomer(){customerSearch='';customerPage=0;$('driver-customers').innerHTML=`<div class="dr-help-head"><h2 id="customer-title">${L('Select customer','ជ្រើសអតិថិជន')}</h2><button data-action="customer-close">${L('Close','បិទ')}</button></div><label class="od-field">${L('Search name or ID','ស្វែងរកឈ្មោះ ឬលេខសម្គាល់')}<input id="customer-search" type="search"></label><div id="customer-results" class="od-stack"></div><div id="customer-pages" class="od-row"></div>`;customerRows();$('driver-customers').showModal();$('customer-search').focus();}
function applyBuyer(){const d=draft(active),c=customers.find(c=>c.id===d.customerId);active.customer=d.type==='registered'?(c?.id||null):null;active.prices=d.type==='registered'?(c?[...c.prices]:[null,null,null]):[...standardPrices];active.name=d.type==='registered'?(c?[...c.name]:['','']):[d.buyerName.trim()||'Occasional buyer',d.buyerName.trim()||'អ្នកទិញមិនចុះឈ្មោះ'];}
function draft(r){if(!drafts.has(trip.id+':'+r.id))drafts.set(trip.id+':'+r.id,{q:['0','0','0'],method:'cash',currency:'KHR',amount:'0',rate:RECEIPT_RATES[trip.id],type:'registered',receipt:'',customerId:'',buyerName:'',touched:new Set()});return drafts.get(trip.id+':'+r.id);}
function openReceipt(id){active=records.find(r=>r.id===id);submitted=false;failure='';panel();$('sale-panel').showModal();}
function heading(){return `<header class="dr-panel-head"><div><p class="dr-eyebrow">${active.status==='pending'?'':esc(active.id)+' · '}${trip.id}</p><h2 id="sale-title">${active.status==='pending'?L('Add sale','បន្ថែមការលក់'):L('Receipt details','ព័ត៌មានបង្កាន់ដៃ')}</h2></div><button data-action="language" ${busy?'disabled':''}>${lang==='en'?'ខ្មែរ':'English'}</button><button data-action="close" ${busy?'disabled':''}>${L('Close','បិទ')}</button></header>`;}
function panel(){
 const r=active;
 if(r.status!=='pending'){details();return;}
 const d=draft(r);
 $('sale-panel').innerHTML=heading()+`<form id="sale-form" novalidate><fieldset class="dr-form-body" ${busy?'disabled':''}><legend class="dr-sr">${L('Actual receipt information','ព័ត៌មានបង្កាន់ដៃពិត')}</legend><div id="error-summary"></div><section><div class="dr-step"><span>01</span><h3>${L('Receipt & customer','បង្កាន់ដៃ និងអតិថិជន')}</h3></div><div class="od-stack dr-identity"><label class="od-field">${L('Sale type','ប្រភេទការលក់')}<select id="buyer-type" ${r.issuedId?'disabled':''}><option value="registered" ${d.type==='registered'?'selected':''}>${L('Registered customer','អតិថិជនចុះឈ្មោះ')}</option><option value="occasional" ${d.type==='occasional'?'selected':''}>${L('Occasional buyer','អ្នកទិញមិនចុះឈ្មោះ')}</option></select></label><label class="od-field">${L('Receipt number','លេខបង្កាន់ដៃ')} *<input id="receipt-number" ${r.issuedId?'readonly':''} value="${esc(d.receipt)}" maxlength="80" required aria-describedby="error-receipt-number"></label><p id="error-receipt-number" class="dr-error"></p>${d.type==='registered'?`<div class="od-field"><label for="customer">${L('Customer','អតិថិជន')} *</label><button type="button" id="customer" ${r.issuedId?'disabled':''} data-action="choose-customer" aria-describedby="error-customer">${r.customer?esc(L(...r.name)):L('Select customer','ជ្រើសអតិថិជន')}</button><p id="error-customer" class="dr-error"></p></div>`:`<label class="od-field">${L('Buyer name · optional','ឈ្មោះអ្នកទិញ · មិនចាំបាច់')}<input id="buyer-name" value="${esc(d.buyerName)}" maxlength="120"></label>`}</div></section>
 <section><div class="dr-step"><span>02</span><h3>${L('Actual products sold','ផលិតផលដែលលក់ពិត')}</h3>${info('actual',L('Quantity information','ព័ត៌មានបរិមាណ'))}</div><div class="dr-price-source"><span>${r.customer?L('Historical assigned prices','តម្លៃកំណត់ប្រវត្តិសាស្ត្រ'):L('Historical standard prices','តម្លៃស្តង់ដារប្រវត្តិសាស្ត្រ')} · ${L('Sample','គំរូ')}<br>${trip.date}</span>${info('pricing',L('Historical price source','ប្រភពតម្លៃប្រវត្តិសាស្ត្រ'))}</div>
 ${products.map((p,i)=>`<div class="dr-product"><div class="od-field"><strong>${L(p[0],p[1])}</strong><span class="${r.prices[i]===null?'dr-error':''}">${r.prices[i]===null?L('Assigned price missing','ខ្វះតម្លៃកំណត់'):money(r.prices[i])+' / '+L(p[2],p[3])}</span></div><label class="od-field dr-qty">${L('Actual qty','បរិមាណពិត')}<span class="dr-required">*</span><input id="qty-${i}" ${d.type==='registered'&&!r.customer?'disabled':''} type="number" inputmode="decimal" min="0" step="any" value="${esc(d.q[i])}" aria-describedby="error-qty-${i}"></label><div class="od-field dr-line"><span>${L('Line amount','ប្រាក់តាមមុខ')}</span><strong id="line-${i}"></strong></div><p class="dr-error dr-full" id="error-qty-${i}"></p></div>`).join('')}
 </section>
 <section><div class="dr-step"><span>03</span><h3>${L('Payment received by driver','ប្រាក់អ្នកបើកបរទទួល')}</h3>${info('payment',L('Driver payment rules','ច្បាប់ទូទាត់អ្នកបើកបរ'))}</div><div class="choice-group" role="group" aria-label="${L('Payment method','វិធីទូទាត់')}">${['cash','khqr'].map(v=>`<button type="button" data-payment="${v}" aria-pressed="${d.method===v}" class="${d.method===v?'selected':''}">${v==='cash'?L('Cash','សាច់ប្រាក់'):'KHQR'}</button>`).join('')}</div>
 ${d.method!=='none'?`<label class="od-field dr-amount-label">${L('Amount actually received','ចំនួនប្រាក់ទទួលពិត')} <span class="dr-required">*</span><span class="dr-amount"><input id="amount" type="number" min="0" step="${d.currency==='USD'?'.01':'1'}" inputmode="decimal" value="${esc(d.amount)}" aria-describedby="error-amount">${d.method==='khqr'?`<select id="currency" aria-label="${L('Payment currency','រូបិយប័ណ្ណទូទាត់')}"><option ${d.currency==='KHR'?'selected':''}>KHR</option><option ${d.currency==='USD'?'selected':''}>USD</option></select>`:'<span>KHR</span>'}</span></label><p class="dr-error" id="error-amount"></p>`:''}
 ${d.method==='khqr'?`${d.currency==='USD'?`<div class="od-field dr-rate"><span>${L('Receipt exchange rate','អត្រាបង្កាន់ដៃ')}</span><strong id="rate">1 USD = ${money(RECEIPT_RATES[trip.id])}</strong><small>${L('Configured historical sample · read-only','អត្រាគំរូប្រវត្តិសាស្ត្រ · មិនអាចកែប្រែ')} · ${trip.date}</small></div><p class="dr-error" id="error-rate"></p><div id="usd-prompt" class="od-cluster dr-rate"></div>`:''}<div id="transfer-zone"></div>`:''}
 </section>
 <section class="dr-summary"><div class="dr-step"><span>04</span><h3>${L('Sale summary','សង្ខេបការលក់')}</h3></div><div id="summary-values" aria-live="polite"></div><div id="submit-feedback" role="status"></div></section><button class="dr-primary dr-submit" id="submit-sale" type="submit">${busy?L('Recording sale…','កំពុងកត់ត្រាលក់…'):L('Record sale','កត់ត្រាលក់')}</button></fieldset></form>`;
 update();
}
function calculate(){const r=active,d=draft(r),q=d.q.map(Number),errors={};let total=0,unknown=false;
 if(!d.receipt.trim())errors['receipt-number']=L('Enter the paper receipt number.','បញ្ចូលលេខបង្កាន់ដៃក្រដាស។');
 else if(records.some(x=>x.id.normalize('NFKC').trim().toLowerCase()===d.receipt.normalize('NFKC').trim().toLowerCase()))errors['receipt-number']=L('This receipt is already recorded for this dispatch.','បង្កាន់ដៃនេះបានកត់ត្រារួចសម្រាប់ដំណើរនេះ។');
 if(d.type==='registered'&&!r.customer){errors.customer=L('Select a registered customer.','ជ្រើសអតិថិជនចុះឈ្មោះ។');unknown=true;}
 q.forEach((n,i)=>{if(d.q[i].trim()===''||!Number.isFinite(n)||n<0){errors[`qty-${i}`]=L('Enter zero or a positive quantity.','បញ្ចូលសូន្យ ឬបរិមាណវិជ្ជមាន។');unknown=true;}else if(!Number.isInteger(n)){errors[`qty-${i}`]=L('Quantity / split-unit rules need review before recording.','ត្រូវពិនិត្យច្បាប់បរិមាណ / បំបែកឯកតាមុនកត់ត្រា។');unknown=true;}else if(n>0&&r.prices[i]===null){errors[`qty-${i}`]=L('Assigned price missing. Resolve pricing before recording.','ខ្វះតម្លៃកំណត់។ ដោះស្រាយតម្លៃមុនកត់ត្រា។');unknown=true;}else total+=n*(r.prices[i]||0);});
 if(!unknown&&!q.some(n=>n>0))errors['qty-0']=L('Enter at least one sold product.','បញ្ចូលយ៉ាងហោចណាស់ផលិតផលមួយ។');
 const amount=Number(d.amount),rate=RECEIPT_RATES[trip.id],usd=d.method==='khqr'&&d.currency==='USD';
 const precision=usd?100:1;
 if(d.amount.trim()===''||!Number.isFinite(amount)||amount<0||amount>1000000000||Math.abs(amount*precision-Math.round(amount*precision))>1e-7)errors.amount=L('Enter a non-negative amount: whole KHR or up to two USD decimals.','បញ្ចូលចំនួនវិជ្ជមាន ឬសូន្យ៖ KHR គត់ ឬ USD ពីរខ្ទង់ទសភាគ។');
 if(usd&&(!Number.isFinite(rate)||rate<=0))errors.rate=L('Enter the applicable receipt exchange rate.','បញ្ចូលអត្រាប្ដូរប្រាក់តាមបង្កាន់ដៃ។');
 const cents=Math.round(amount*100),targetCents=usd&&!errors.rate?Math.round(total*100/rate):0;
 const received=usd?cents*rate/100:amount;
 const fullUsd=usd&&!unknown&&!errors.amount&&!errors.rate&&amount>0&&total>0&&cents===targetCents;
 const adjustment=fullUsd?total-received:0;
 const overpayment=d.method==='khqr'&&!unknown&&!errors.amount&&!errors.rate&&(usd?cents>targetCents:received>total);
 if(overpayment)errors.amount=L('Maximum KHQR amount: ','ចំនួន KHQR អតិបរមា៖ ')+(usd?(targetCents/100).toFixed(2)+' USD':money(total));
 if(usd&&!errors.amount&&!errors.rate&&!fullUsd&&Math.abs(received-Math.round(received))>1e-7)errors.amount=L('This partial payment converts to fractional KHR. Partial-payment rounding needs review.','ការទូទាត់មួយផ្នែកនេះបម្លែងជា KHR ទសភាគ។ ត្រូវពិនិត្យគោលការណ៍បង្គត់។');
 const applied=fullUsd?total:Math.min(received,total),balance=Math.max(total-applied,0),change=d.method==='cash'?Math.max(received-total,0):0;
 if(d.transfer&&!transferMatches(d.transfer,d))d.transfer=null;
 if(d.method==='khqr'&&amount>0&&!errors.amount&&!errors.rate&&!d.transfer)errors['capture-transfer']=L('Capture and attach the driver’s transfer to the factory for this amount.','ថត និងភ្ជាប់រូបការផ្ទេររបស់អ្នកបើកបរទៅរោងចក្រសម្រាប់ចំនួននេះ។');
 return{q,total,amount,received,applied,balance,change,adjustment,targetCents,fullUsd,overpayment,unknown,errors};}
function paymentTotals(c,d,valid=true){
 const usd=d.method==='khqr'&&d.currency==='USD',rate=Number(d.rate);
 const equivalent=(n,settled=false)=>usd&&rate>0&&Number.isFinite(rate)?`<small class="dr-usd">${!settled&&Math.abs(n*100/rate-Math.round(n*100/rate))>1e-7?'≈ ':''}${(settled?c.targetCents/100:n/rate).toFixed(2)} USD</small>`:'';
 const row=(label,value,cls='')=>`<div class="${cls}"><dt>${label}</dt><dd>${value}</dd></div>`;
 return `<dl class="dr-totals">${row(L('Subtotal','សរុបរង'),c.unknown?'—':money(c.total)+equivalent(c.total))}${row(L('Sale total','តម្លៃលក់សរុប'),c.unknown?'—':money(c.total)+equivalent(c.total,true),'dr-grand')}${row(L('Received by driver','អ្នកបើកបរទទួល'),Number.isFinite(c.amount)?(usd?Number(c.amount).toFixed(2)+' USD':money(c.amount)):'—')}${usd?row(L('KHR equivalent','សមមូល KHR'),valid?money(c.received):'—'):''}${usd&&valid&&c.adjustment?row(L('Exchange adjustment','ការកែតម្រូវអត្រាប្ដូរ'),(c.adjustment>0?'+':'')+money(c.adjustment)):''}${row(L('Payment applied','ប្រាក់បានទូទាត់'),valid&&!c.unknown?money(c.applied)+equivalent(c.applied,c.fullUsd):'—')}${row(L('Unpaid remainder','ប្រាក់នៅមិនទាន់ទូទាត់'),valid&&!c.unknown?money(c.balance)+equivalent(c.balance):'—')}${d.method==='cash'?row(L('Cash change','ប្រាក់អាប់'),valid&&!c.unknown?money(c.change):'—'):''}</dl>`;
}

function update(){if(!active||active.status!=='pending')return;const d=draft(active),c=calculate();
 products.forEach((p,i)=>{$(`line-${i}`).textContent=c.errors[`qty-${i}`]&&Number(d.q[i])!==0?'—':money(Number(d.q[i])*(active.prices[i]||0));});
 ['receipt-number','customer','qty-0','qty-1','qty-2','amount','rate'].forEach(k=>{const visible=submitted||d.touched.has(k)||(k==='amount'&&c.overpayment),el=$(`error-${k}`);if(el)el.textContent=visible?(c.errors[k]||''):'';const input=$(k);if(input)input.setAttribute('aria-invalid',String(Boolean(visible&&c.errors[k])));});
 renderTransfer(d,c);
 const knownPayment=Number.isFinite(c.received)&&!c.errors.rate&&!c.errors.amount;
 const prompt=$('usd-prompt');if(prompt){const available=!c.unknown&&c.total>0&&!c.errors.rate&&c.targetCents>0;prompt.innerHTML=available?`<strong>${L('Full amount','ចំនួនពេញ')}: ${(c.targetCents/100).toFixed(2)} USD</strong><button type="button" data-action="full-usd" ${busy?'disabled':''}>${L('Use full amount','ប្រើចំនួនពេញ')}</button>`:'';}
 $('summary-values').innerHTML=paymentTotals(c,d,knownPayment)+`<div class="dr-summary-state">${c.total<=0||c.unknown||!knownPayment?L('Requires review','ត្រូវពិនិត្យ'):coverage(c.total,c.applied)}</div><p class="dr-holding">${d.method==='khqr'&&c.amount>0?L('Factory transfer · reconciliation pending','ការផ្ទេរទៅរោងចក្រ · រង់ចាំផ្ទៀងផ្ទាត់'):L('Cash handover is separate','ការប្រគល់សាច់ប្រាក់ដាច់ដោយឡែក')}</p>`;
 $('error-summary').innerHTML=submitted&&Object.keys(c.errors).length?`<div class="dr-error-box" role="alert" tabindex="-1"><strong>${L('Resolve these items before recording','ដោះស្រាយចំណុចទាំងនេះមុនកត់ត្រា')}</strong><ul>${Object.entries(c.errors).map(([k,v])=>`<li><a href="#${k}" data-error-target="${k}">${v}</a></li>`).join('')}</ul></div>`:'';
 $('submit-feedback').innerHTML=failure?`<p class="dr-error" role="alert">${failure}</p>`:busy?`<p>${L('Saving receipt… Please wait.','កំពុងរក្សាទុកបង្កាន់ដៃ… សូមរង់ចាំ។')}</p>`:'';
 $('submit-sale').disabled=busy||c.overpayment;
}

function renderTransfer(d,c){
 const zone=$('transfer-zone');if(!zone)return;
 if(!(c.amount>0)){zone.innerHTML='';return;}
 const ready=!busy&&!c.errors.amount&&!c.errors.rate;
 zone.innerHTML=`<section class="dr-transfer od-stack"><div class="od-row"><h3>${L('Transfer to factory','ផ្ទេរទៅរោងចក្រ')}</h3>${info('evidence',L('Transfer evidence','ភស្តុតាងផ្ទេរ'))}</div><div class="od-field"><span>${L('Recipient','អ្នកទទួល')}</span><strong>${esc(L(...FACTORY_RECIPIENT.name))}</strong></div><div class="od-field"><span>${L('Transfer amount','ចំនួនផ្ទេរ')}</span><strong>${transferMoney(c.amount,d.currency)}</strong></div>${d.transfer?`<img class="dr-transfer-photo" src="${d.transfer.photo.url}" width="${d.transfer.photo.width}" height="${d.transfer.photo.height}" alt="${L('Attached driver-to-factory transfer','រូបការផ្ទេរទៅរោងចក្រដែលបានភ្ជាប់')}"><span>${L('Photo attached · reconciliation pending','បានភ្ជាប់រូប · រង់ចាំផ្ទៀងផ្ទាត់')}</span>`:''}<button type="button" id="capture-transfer" data-action="capture-transfer" aria-describedby="error-capture-transfer" ${ready?'':'disabled'}>${d.transfer?L('Replace transfer photo','ប្តូររូបការផ្ទេរ'):L('Capture transfer','ថតការផ្ទេរ')}</button><p class="dr-error" id="error-capture-transfer">${submitted?(c.errors['capture-transfer']||''):''}</p></section>`;
}
function transferDetails(r){
 if(r.saved.method!=='khqr'||r.saved.amount<=0)return '';
 const t=r.transfer;
 if(!t)return `<section class="dr-transfer"><h3>${L('Transfer to factory','ផ្ទេរទៅរោងចក្រ')}</h3><p>${L('Transfer not recorded','មិនទាន់កត់ត្រាការផ្ទេរ')}</p></section>`;
 return `<section class="dr-transfer od-stack"><h3>${L('Transfer to factory','ផ្ទេរទៅរោងចក្រ')}</h3><div class="od-field"><span>${L('Recipient','អ្នកទទួល')}</span><strong>${esc(L(...t.recipientName))}</strong></div><strong>${transferMoney(t.amount,t.currency)}</strong><p>${L('Reconciliation pending · not bank-verified','រង់ចាំផ្ទៀងផ្ទាត់ · មិនទាន់ផ្ទៀងផ្ទាត់ធនាគារ')}</p><img class="dr-transfer-photo" src="${t.photo.url}" width="${t.photo.width}" height="${t.photo.height}" alt="${L('Saved driver-to-factory transfer evidence','ភស្តុតាងការផ្ទេរទៅរោងចក្រដែលបានរក្សាទុក')}"></section>`;
}
let transferStream=null,transferCandidate=null,transferContext=null,cameraRequest=0;
function stopTransferCamera(){cameraRequest++;if(transferStream)transferStream.getTracks().forEach(t=>t.stop());transferStream=null;}
async function startTransferCamera(){
 stopTransferCamera();const request=cameraRequest;
 $('transfer-take').disabled=true;$('transfer-camera-status').textContent=L('Starting camera…','កំពុងបើកកាមេរ៉ា…');
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('unavailable');
  const stream=await navigator.mediaDevices.getUserMedia({video:matchMedia('(max-width:767px)').matches?{facingMode:{ideal:'environment'}}:true,audio:false});
  if(request!==cameraRequest||!$('transfer-camera').open){stream.getTracks().forEach(t=>t.stop());return;}
  transferStream=stream;const video=$('transfer-video');video.srcObject=stream;await video.play();
  if(request!==cameraRequest)return;
  $('transfer-take').disabled=false;$('transfer-camera-status').textContent=L('Frame the completed transfer, including recipient and amount.','ថតឱ្យឃើញការផ្ទេរបានបញ្ចប់ រួមទាំងអ្នកទទួល និងចំនួនប្រាក់។');
 }catch(_){if(request!==cameraRequest)return;stopTransferCamera();$('transfer-camera-status').textContent=L('Camera unavailable. Allow camera access in your browser, then retry. Your sale is preserved.','មិនអាចប្រើកាមេរ៉ា។ អនុញ្ញាតកាមេរ៉ាក្នុងកម្មវិធីរុករក ហើយសាកម្ដងទៀត។ ទិន្នន័យលក់នៅរក្សា។');$('transfer-retry').hidden=false;}
}
function openTransferCamera(){
 if(busy||active?.status!=='pending')return;
 const d=draft(active),c=calculate();if(d.method!=='khqr'||!(c.amount>0)||c.errors.amount||c.errors.rate)return;
 transferContext={draft:d,amount:c.amount,currency:d.currency};transferCandidate=null;
 const dialog=$('transfer-camera');dialog.innerHTML=`<div class="dr-help-head"><h2 id="transfer-camera-title">${L('Capture transfer','ថតការផ្ទេរ')}</h2><button type="button" id="transfer-camera-close">${L('Close','បិទ')}</button></div><p>${esc(L(...FACTORY_RECIPIENT.name))}</p><strong>${transferMoney(c.amount,d.currency)}</strong><video id="transfer-video" autoplay playsinline muted></video><img id="transfer-preview" hidden alt="${L('Transfer photo preview','មើលរូបការផ្ទេរជាមុន')}"><p id="transfer-camera-status" role="status"></p><div class="od-cluster"><button type="button" id="transfer-retry" hidden>${L('Retry camera','សាកកាមេរ៉ាម្ដងទៀត')}</button><button type="button" id="transfer-retake" hidden>${L('Retake','ថតម្ដងទៀត')}</button><button type="button" id="transfer-take" disabled>${L('Take photo','ថតរូប')}</button><button type="button" id="transfer-attach" class="dr-primary" hidden>${L('Attach photo','ភ្ជាប់រូប')}</button></div>`;
 dialog.onclose=()=>{stopTransferCamera();transferCandidate=null;transferContext=null;$('capture-transfer')?.focus();};
 $('transfer-camera-close').onclick=()=>dialog.close();
 $('transfer-retry').onclick=()=>{$('transfer-retry').hidden=true;startTransferCamera();};
 $('transfer-retake').onclick=()=>{transferCandidate=null;$('transfer-preview').hidden=true;$('transfer-video').hidden=false;$('transfer-retake').hidden=true;$('transfer-attach').hidden=true;$('transfer-take').hidden=false;startTransferCamera();};
 $('transfer-take').onclick=()=>{
  const video=$('transfer-video');if(!video.videoWidth||!video.videoHeight)return;
  try{
   const scale=Math.min(1,1280/Math.max(video.videoWidth,video.videoHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(video.videoWidth*scale));canvas.height=Math.max(1,Math.round(video.videoHeight*scale));canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
   let url=canvas.toDataURL('image/jpeg',.72);if(url.length>PHOTO_LIMIT)url=canvas.toDataURL('image/jpeg',.5);
   if(url.length>PHOTO_LIMIT)throw new Error('size');
   transferCandidate={url,width:canvas.width,height:canvas.height};const preview=$('transfer-preview');preview.src=url;preview.width=canvas.width;preview.height=canvas.height;preview.hidden=false;video.hidden=true;$('transfer-take').hidden=true;$('transfer-retake').hidden=false;$('transfer-attach').hidden=false;$('transfer-camera-status').textContent=L('Check that recipient and amount are readable before attaching.','ពិនិត្យថាអ្នកទទួល និងចំនួនប្រាក់អាចអានបាន មុនភ្ជាប់។');stopTransferCamera();$('transfer-attach').focus();
  }catch(_){$('transfer-camera-status').textContent=L('Photo could not be prepared. Reframe the transfer and try again.','មិនអាចរៀបចំរូបថត។ សូមតម្រង់កាមេរ៉ា ហើយសាកម្ដងទៀត។');}
 };
 $('transfer-attach').onclick=()=>{
  if(!transferCandidate||!transferContext)return;const context=transferContext;
  if(context.draft.method!=='khqr'||Number(context.draft.amount)!==context.amount||context.draft.currency!==context.currency){dialog.close();return;}
  context.draft.transfer={recipientId:FACTORY_RECIPIENT.id,recipientName:[...FACTORY_RECIPIENT.name],amount:context.amount,currency:context.currency,status:'pending',capturedAt:new Date().toISOString(),photo:transferCandidate};failure='';dialog.close();update();$('capture-transfer')?.focus();
 };
 dialog.showModal();startTransferCamera();
}
window.addEventListener('pagehide',stopTransferCamera);

function details(){const r=active,s=r.saved; $('sale-panel').innerHTML=heading()+`<div class="dr-detail"><div class="dr-detail-status">${badge(r.status)}</div><h2>${esc(L(...r.name))}</h2><p class="dr-muted">${esc(r.customer||L('Occasional buyer','អ្នកទិញមិនចុះឈ្មោះ'))} · ${trip.id}</p>${s?`<p class="dr-success">${L('Saved in this browser · protected against repeat entry','បានរក្សាទុកក្នុងកម្មវិធីរុករកនេះ · ការពារការបញ្ចូលម្ដងទៀត')}</p><div class="dr-detail-products">${products.map((p,i)=>s.q[i]>0?`<div class="dr-detail-line"><span>${L(p[0],p[1])}<small>${s.q[i]} × ${money(r.prices[i])}</small></span><strong>${money(s.q[i]*r.prices[i])}</strong></div>`:'').join('')}</div>${paymentTotals(s,s)}${s.currency==='USD'?`<p class="dr-muted">${L('Receipt exchange rate','អត្រាបង្កាន់ដៃ')}: ${fmt(Number(s.rate))} KHR / USD</p>`:''}<strong class="dr-summary-state">${coverage(s.total,s.applied)}</strong><div class="dr-bank"><strong>${s.method==='khqr'?'KHQR':s.method==='none'?L('No payment received','មិនទទួលប្រាក់'):L('Cash · KHR','សាច់ប្រាក់ · KHR')}</strong><span>${s.received>0?(s.method==='khqr'?L('Driver account · reconciliation pending','គណនីអ្នកបើកបរ · រង់ចាំផ្ទៀងផ្ទាត់'):L('Cash held by driver','សាច់ប្រាក់នៅអ្នកបើកបរ')):L('No payment or evidence recorded','មិនមានប្រាក់ ឬភស្តុតាងទូទាត់')}</span></div>${transferDetails(r)}`:`<div class="dr-no-sale"><h3>${L('No financial effect','មិនប៉ះពាល់ហិរញ្ញវត្ថុ')}</h3><p>${L('No sale, no payment and no new customer debt. Return outcome supplied by #157.','គ្មានការលក់ គ្មានការទូទាត់ និងគ្មានបំណុលថ្មី។ លទ្ធផលត្រឡប់ពី #157។')}</p></div>${r.collection?`<section class="dr-collection"><h3>${L('Separate old-debt collection','ការប្រមូលបំណុលចាស់ដាច់ដោយឡែក')}</h3><strong>CT-014 · ${money(20000)}</strong><p>${L('Sample collection record: driver received cash against earlier debt. This is not payment for a new sale and is excluded from this receipt.','កំណត់ត្រាគំរូ៖ អ្នកបើកបរទទួលសាច់ប្រាក់សម្រាប់បំណុលចាស់។ នេះមិនមែនការទូទាត់ការលក់ថ្មី និងមិនរាប់ក្នុងបង្កាន់ដៃនេះ។')}</p></section>`:''}`}</div><footer class="dr-detail-footer"><button data-action="close" class="dr-primary">${L('Back to sales','ត្រឡប់ទៅការលក់')}</button></footer>`;}
function showHelp(key){$('driver-help').innerHTML=`<div class="dr-help-head"><h2 id="help-title">${L('Good to know','ព័ត៌មានជំនួយ')}</h2><button data-action="help-close">${L('Close','បិទ')}</button></div><p>${help[key]()}</p>`;$('driver-help').showModal();}
async function submit(e){e.preventDefault();if(busy||active.status!=='pending')return;submitted=true;const c=calculate();update();if(Object.keys(c.errors).length){$('error-summary').querySelector('[tabindex]').focus();return;}busy=true;failure='';panel();const r=active,d=draft(r);await new Promise(resolve=>setTimeout(resolve,850));if(new URLSearchParams(location.search).get('submit')==='fail'&&!window.driverFailureShown){window.driverFailureShown=true;busy=false;failure=L('Sale was not recorded. Your entries are preserved; select Record sale to retry.','មិនបានកត់ត្រាលក់។ ទិន្នន័យនៅរក្សា សូមចុចកត់ត្រាលក់ដើម្បីសាកម្ដងទៀត។');panel();return;}

 const savedRecord={transfer:d.method==='khqr'&&c.amount>0?JSON.parse(JSON.stringify(d.transfer)):null,id:d.receipt.trim(),dispatchId:trip.id,buyerType:d.type,customer:r.customer||null,name:[...r.name],prices:[...r.prices],status:'recorded',recordedAt:new Date().toISOString(),saved:{q:[...c.q],method:d.method,currency:d.currency,amount:c.amount,rate:RECEIPT_RATES[trip.id],total:c.total,received:c.received,applied:c.applied,balance:c.balance,change:c.change,adjustment:c.adjustment,targetCents:c.targetCents,fullUsd:c.fullUsd}};
 try{
  // Read the latest records before writing; retain sales from other tabs/dispatches.
  const data=readSales();
  validateIssuedSale(r,d,data.sales);
  if(data.sales.some(x=>x.dispatchId===trip.id&&receiptKey(x.id)===receiptKey(savedRecord.id))){loadSales(data);throw new Error('duplicate-receipt');}
  const next={version:1,sales:[...data.sales,savedRecord]};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  loadSales(next);
 }catch(error){
  busy=false;
  failure=error.message==='issued-conflict'?L('This issued receipt changed or does not match the selected customer. Close this form and reopen it from Dispatch receipts. Nothing was saved.','បង្កាន់ដៃបានផ្លាស់ប្ដូរ ឬអតិថិជនមិនត្រូវគ្នា។ បិទហើយបើកពីបញ្ជីបង្កាន់ដៃម្ដងទៀត។ មិនបានរក្សាទុក។'):error.message==='duplicate-receipt'?L('This receipt is already saved for this dispatch. Your entries are preserved; check the receipt number.','បង្កាន់ដៃនេះបានរក្សាទុករួចសម្រាប់ដំណើរនេះ។ ទិន្នន័យនៅរក្សា សូមពិនិត្យលេខបង្កាន់ដៃ។'):L('Sale not saved. Browser storage is unavailable, full or unreadable. Your entries are preserved. Restore storage access or space, then select Record sale to retry.','មិនបានរក្សាទុកការលក់។ កន្លែងរក្សាទុកមិនអាចប្រើ ពេញ ឬមិនអាចអាន។ ទិន្នន័យនៅរក្សា។ សូមស្ដារការចូលប្រើ ឬទំហំ រួចចុចកត់ត្រាលក់ម្ដងទៀត។');
  panel();$('submit-feedback').scrollIntoView({block:'nearest'});return;
 }
 drafts.delete(trip.id+':'+r.id);trip.entry=null;active=savedRecord;busy=false;search='';shell();details();$('sale-title').setAttribute('tabindex','-1');$('sale-title').focus();$('driver-announcer').textContent=L('Sale saved in this browser.','បានរក្សាទុកការលក់ក្នុងកម្មវិធីរុករកនេះ។');}

document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(!b)return;
 if(b.matches('a[href*="index.html"]')){if(busy||(hasDraft()&&!confirm(L('Leave Driver Sales? Unsaved entries will be discarded.','ចាកចេញពីការលក់អ្នកបើកបរ? ទិន្នន័យមិនទាន់រក្សាទុកនឹងបាត់។')))){e.preventDefault();return;}}
 if(b.dataset.trip){e.preventDefault();tripScroll=window.scrollY;navigateDispatch(b.dataset.trip);return;}
 if(b.dataset.action==='dispatches'){e.preventDefault();if(busy)return;if($('driver-nav').open)$('driver-nav').close();navigateDispatch('');return;}
 if(b.dataset.action==='more-trips'){loadMoreTrips();return;}
 if(['trips-today','all-trip-dates','clear-trips'].includes(b.dataset.action)){tripDate=b.dataset.action==='trips-today'?localToday():'';if(b.dataset.action==='clear-trips'){tripSearch='';$('trip-search').value='';}$('trip-date').value=tripDate;resetTripFilters();return;}
 if(b.dataset.customer){const d=draft(active);d.customerId=b.dataset.customer;d.touched.add('customer');applyBuyer();$('driver-customers').close();panel();$('customer').focus();return;}
 if(b.dataset.payment&&active?.status==='pending'&&!busy){const d=draft(active);d.method=b.dataset.payment;if(d.method==='cash')d.currency='KHR';d.amount='0';failure='';panel();return;}
 if(b.dataset.action==='full-usd'&&active?.status==='pending'&&!busy){const c=calculate(),d=draft(active);if(d.method==='khqr'&&d.currency==='USD'&&!c.unknown&&!c.errors.rate&&c.targetCents>0){d.amount=(c.targetCents/100).toFixed(2);d.touched.add('amount');failure='';$('amount').value=d.amount;update();}return;}
 if(b.dataset.open)openReceipt(b.dataset.open);if(b.dataset.help)showHelp(b.dataset.help);if(b.dataset.errorTarget){e.preventDefault();($(b.dataset.errorTarget)||$('method'))?.focus();}switch(b.dataset.action){case'capture-transfer':openTransferCamera();break;case'add-sale':addSale();break;case'choose-customer':chooseCustomer();break;case'customer-close':$('driver-customers').close();break;case'customer-prev':customerPage--;customerRows();break;case'customer-next':customerPage++;customerRows();break;case'language':lang=lang==='en'?'km':'en';shell();if(active&&$('sale-panel').open)panel();break;case'close':if(!busy){$('sale-panel').close();active=null;}break;case'help-close':$('driver-help').close();break;case'menu':$('driver-nav').innerHTML=`<button data-action="nav-close">${L('Close','បិទ')}</button>${navigation()}`;$('driver-nav').showModal();break;case'nav-close':$('driver-nav').close();break;}});
document.addEventListener('input',e=>{if(e.target.id==='customer-search'){customerSearch=e.target.value;customerPage=0;customerRows();return;}if(e.target.id==='trip-search'){tripSearch=e.target.value;resetTripFilters();return;}if(!active||active.status!=='pending')return;const d=draft(active),id=e.target.id;if(id.startsWith('qty-'))d.q[Number(id.slice(4))]=e.target.value;else if(id==='receipt-number')d.receipt=e.target.value;else if(id==='buyer-name'){d.buyerName=e.target.value;applyBuyer();}else if(id==='amount')d.amount=e.target.value;else return;failure='';update();});
document.addEventListener('change',e=>{const id=e.target.id;if(id==='trip-date'){tripDate=e.target.value;resetTripFilters();return;}if(id==='receipt-filter'){filter=e.target.value;list();return;}if(!active||active.status!=='pending')return;const d=draft(active);if(id==='buyer-type'){d.type=e.target.value;applyBuyer();panel();}else if(id==='method'){d.method=e.target.value;if(d.method!=='khqr')d.currency='KHR';d.amount='0';panel();}else if(id==='currency'){d.currency=e.target.value;d.amount='0';panel();}});
document.addEventListener('focusout',e=>{if(active&&active.status==='pending'&&e.target.matches('input')){draft(active).touched.add(e.target.id);update();}});
document.addEventListener('submit',e=>{if(e.target.id==='sale-form')submit(e);});
$('sale-panel').addEventListener('cancel',e=>{if(busy)e.preventDefault();else active=null;});
window.addEventListener('hashchange',route);
window.addEventListener('popstate',route);
window.addEventListener('beforeunload',e=>{if(busy||hasDraft()){e.preventDefault();e.returnValue='';}});
// #157: issued paper receipts have no financial side effects.
function canIssue(){const t=window.DispatchStore.get(trip.id);return !!t?.verifiedAt&&t.status==='created';}
const receiptScenario=new URLSearchParams(location.search).get('receipts');
const demoReceipts=['three','recorded','empty','failure'].includes(receiptScenario);
const ISSUED_KEY='ice-factory.issued-receipts.v1'+(demoReceipts?'.demo.'+receiptScenario:'');
let issueSelected=new Set(),issueQuery='',issueError='',issueWorking=false,issueFailed=false,receiptDialogView=null;
const internalTruck=t=>'TRK-'+String([...new Set(trips.map(x=>x.truck))].indexOf(t.truck)+1).padStart(3,'0');
function receiptSnapshot(t,c,id){return {id,dispatchId:t.id,customerId:c.id,name:[...c.name],contact:c.phone||'',date:t.date,truck:t.truck,truckId:internalTruck(t),driver:[...t.driver],salesperson:[...t.salesperson],route:[...t.route],preparedAt:new Date().toISOString(),outcome:'pending'};}
function issuedStore(){
 const raw=localStorage.getItem(ISSUED_KEY);
 if(raw===null){const receipts=demoReceipts&&receiptScenario!=='empty'?customers.filter(c=>trips[0].customerIds.slice(0,3).includes(c.id)).map((c,i)=>receiptSnapshot(trips[0],c,'SAMPLE-157-'+String(i+1).padStart(3,'0'))):[];return {version:1,receipts};}
 const value=JSON.parse(raw);
 if(value?.version!==1||!Array.isArray(value.receipts)||!value.receipts.every(r=>r&&typeof r.id==='string'&&typeof r.dispatchId==='string'&&typeof r.customerId==='string'&&Array.isArray(r.name)&&Array.isArray(r.driver)&&Array.isArray(r.salesperson)&&Array.isArray(r.route)&&['pending','blank'].includes(r.outcome)))throw Error('receipt-storage');
 return value;
}
function linkedSale(r,sales){return sales.find(s=>s.dispatchId===r.dispatchId&&receiptKey(s.id)===receiptKey(r.id));}
const receiptFilters=new Map();
function receiptOutcome(r,sales){return linkedSale(r,sales)?'recorded':r.outcome==='blank'?'blank':null;}
function receiptStatus(r,sales){return receiptOutcome(r,sales)?'closed':'open';}
function receiptStatusLabel(status){return status==='closed'?L('Closed','បានបិទ'):L('Open','បើក');}
function outcomeLabel(outcome){return outcome==='recorded'?L('Sale recorded','បានកត់ត្រាការលក់'):outcome==='blank'?L('Returned without purchase','បានប្រគល់វិញដោយមិនទិញ'):'—';}
function receiptFacts(r,sales){return `<dl class="rx-facts"><div class="od-field"><dt>${L('Status','ស្ថានភាព')}</dt><dd class="rx-status">${receiptStatusLabel(receiptStatus(r,sales))}</dd></div><div class="od-field"><dt>${L('Outcome','លទ្ធផល')}</dt><dd>${outcomeLabel(receiptOutcome(r,sales))}</dd></div></dl>`;}
function receiptActions(r,sales){const outcome=receiptOutcome(r,sales);return outcome==='recorded'?`<button data-rx="sale" data-rid="${esc(r.id)}">${L('View sale','មើលការលក់')}</button>`:!outcome?`<button data-rx="sale" data-rid="${esc(r.id)}">${L('Record sale','កត់ត្រាលក់')}</button><button data-rx="blank" data-rid="${esc(r.id)}">${L('Close without sale','បិទដោយគ្មានការលក់')}</button>`:'';}
function issuedRows(){
 const zone=$('issued-receipts');if(!zone||!trip)return;
 try{
 const receipts=issuedStore().receipts.filter(r=>r.dispatchId===trip.id),sales=readSales().sales;
 const filter=receiptFilters.get(trip.id)||'all',open=receipts.filter(r=>receiptStatus(r,sales)==='open').length;
 const visible=receipts.filter(r=>filter==='all'||receiptStatus(r,sales)===filter);
 zone.innerHTML=`<div class="dr-section-title"><h2>${L('Dispatch receipts','បង្កាន់ដៃចែកចាយ')}</h2><button class="dr-primary" data-rx="prepare" ${canIssue()?'':'disabled'}>${L('Prepare receipts','រៀបចំបង្កាន់ដៃ')}</button></div>${canIssue()?'':`<p class="rx-muted">${L('New receipts require a verified dispatch that has not departed.','បង្កាន់ដៃថ្មីតម្រូវឱ្យផ្ទៀងផ្ទាត់ដំណើរ និងមិនទាន់ចេញដំណើរ។')}</p>`}
 <div class="rx-counts">${[[receipts.length,L('Total receipts','បង្កាន់ដៃសរុប')],[open,receiptStatusLabel('open')],[receipts.length-open,receiptStatusLabel('closed')]].map(([n,label])=>`<div class="od-stat"><strong>${n}</strong><span>${label}</span></div>`).join('')}</div>
 <div class="rx-outcomes od-cluster" aria-label="${L('Closed receipt outcomes','លទ្ធផលបង្កាន់ដៃបានបិទ')}">${['recorded','blank'].map(outcome=>`<span>${outcomeLabel(outcome)}: <strong>${receipts.filter(r=>receiptOutcome(r,sales)===outcome).length}</strong></span>`).join('')}</div>
 <div class="rx-filters od-cluster" role="group" aria-label="${L('Receipt status','ស្ថានភាពបង្កាន់ដៃ')}">${['all','open','closed'].map(value=>`<button type="button" data-rx="filter" data-filter="${value}" aria-pressed="${filter===value}">${value==='all'?L('All','ទាំងអស់'):receiptStatusLabel(value)}</button>`).join('')}</div>
 <div class="rx-list">${visible.length?visible.map(r=>`<article class="rx-row"><div class="od-field"><h3>${esc(L(...r.name))}</h3><span>${esc(r.customerId)} · ${esc(r.id)}</span>${receiptFacts(r,sales)}</div><div class="od-cluster rx-actions"><button data-rx="preview" data-rid="${esc(r.id)}">${L('View receipt / print','មើលបង្កាន់ដៃ / បោះពុម្ព')}</button></div></article>`).join(''):receipts.length?`<div class="dr-empty"><h3>${filter==='open'?L('No open receipts','គ្មានបង្កាន់ដៃបើក'):L('No closed receipts','គ្មានបង្កាន់ដៃបានបិទ')}</h3><button data-rx="filter" data-filter="all">${L('Show all receipts','បង្ហាញបង្កាន់ដៃទាំងអស់')}</button></div>`:`<div class="dr-empty"><h3>${L('No receipts prepared','មិនទាន់រៀបចំបង្កាន់ដៃ')}</h3><p>${canIssue()?L('Select customers to prepare receipts.','ជ្រើសអតិថិជនដើម្បីរៀបចំបង្កាន់ដៃ។'):L('No prepared receipts are available for this dispatch.','មិនមានបង្កាន់ដៃដែលបានរៀបចំសម្រាប់ដំណើរនេះ។')}</p></div>`}</div>
 <details class="rx-guidance"><summary>${L('Receipt handling information','ព័ត៌មានគ្រប់គ្រងបង្កាន់ដៃ')}</summary><p>${L('Open means no outcome has been recorded: the paper may be with the driver, awaiting processing or missing. Closed means a sale was saved or a return without purchase was confirmed. Closed does not mean paid; a sale can be fully paid, partly paid or unpaid. Printing does not close a receipt or create a sale. Debt collection stays separate. Open receipts do not automatically block dispatch completion.','បើកមានន័យថាមិនទាន់កត់ត្រាលទ្ធផល៖ ក្រដាសអាចនៅជាមួយអ្នកបើកបរ រង់ចាំដំណើរការ ឬបាត់។ បានបិទមានន័យថាបានរក្សាទុកការលក់ ឬបញ្ជាក់ប្រគល់វិញដោយមិនទិញ។ បានបិទមិនមានន័យថាបានទូទាត់ទេ៖ ការលក់អាចទូទាត់ពេញ មួយផ្នែក ឬមិនទាន់ទូទាត់។ បោះពុម្ពមិនបិទបង្កាន់ដៃ ឬបង្កើតការលក់ទេ។ ការប្រមូលបំណុលនៅដាច់ដោយឡែក។ បង្កាន់ដៃបើកមិនរារាំងការបញ្ចប់ដំណើរដោយស្វ័យប្រវត្តិទេ។')}</p></details>`;
 }catch(_){zone.innerHTML=`<div class="dr-empty"><p role="alert">${L('Receipts could not be loaded. Restore browser storage access and retry.','មិនអាចផ្ទុកបង្កាន់ដៃ។ ស្ដារកន្លែងរក្សាទុក រួចសាកម្ដងទៀត។')}</p><button data-rx="reload">${L('Retry','សាកម្ដងទៀត')}</button></div>`;}
}
let recordingReceiptFilter='open';
function selectReceiptForSale(){
 if(!trip)return;
 receiptDialogView={type:'select-sale'};
 const dialog=$('receipt-workspace');
 try{
 const receipts=issuedStore().receipts.filter(r=>r.dispatchId===trip.id),sales=readSales().sales;
 const visible=receipts.filter(r=>recordingReceiptFilter==='all'||receiptStatus(r,sales)===recordingReceiptFilter);
 dialog.innerHTML=rxHeader(L('Select receipt','ជ្រើសរើសបង្កាន់ដៃ'))+`<div class="rx-body"><p>${esc(trip.id)}</p><div class="od-cluster rx-filters" role="group" aria-label="${L('Receipt status','ស្ថានភាពបង្កាន់ដៃ')}">${['all','open','closed'].map(value=>`<button type="button" data-rx="select-filter" data-filter="${value}" aria-pressed="${recordingReceiptFilter===value}">${value==='all'?L('All','ទាំងអស់'):receiptStatusLabel(value)}</button>`).join('')}</div><div class="rx-list">${visible.length?visible.map(r=>`<article class="rx-row"><div class="od-field"><h3>${esc(L(...r.name))}</h3><span>${esc(r.id)}</span>${receiptFacts(r,sales)}</div><div class="od-cluster rx-actions">${receiptActions(r,sales)}</div></article>`).join(''):`<div class="dr-empty"><h3>${receipts.length?L('No receipts with this status','គ្មានបង្កាន់ដៃក្នុងស្ថានភាពនេះ'):L('No receipts prepared','មិនទាន់រៀបចំបង្កាន់ដៃ')}</h3>${receipts.length?`<button data-rx="select-filter" data-filter="all">${L('Show all receipts','បង្ហាញបង្កាន់ដៃទាំងអស់')}</button>`:`<p>${L('Prepare receipts in Dispatch receipts before recording a sale.','រៀបចំបង្កាន់ដៃក្នុងផ្ទាំងបង្កាន់ដៃចែកចាយ មុនកត់ត្រាការលក់។')}</p><button data-rx="go-prepare">${L('Dispatch receipts','បង្កាន់ដៃចែកចាយ')}</button>`}</div>`}</div></div>`;
 }catch(_){dialog.innerHTML=rxHeader(L('Select receipt','ជ្រើសរើសបង្កាន់ដៃ'))+`<div class="rx-body"><p role="alert">${L('Receipts could not be loaded. Check browser storage and retry.','មិនអាចផ្ទុកបង្កាន់ដៃ។ ពិនិត្យកន្លែងរក្សាទុក រួចសាកម្ដងទៀត។')}</p><button data-rx="select-retry">${L('Retry','សាកម្ដងទៀត')}</button></div>`;}
 rxShow();
}
function rxHeader(title,printReceiptId=null){return `<header class="dr-help-head"><h2 id="rx-title">${title}</h2><div class="od-cluster">${printReceiptId?`<button class="dr-primary" data-rx="print" data-rid="${esc(printReceiptId)}">${L('Print receipt','បោះពុម្ពបង្កាន់ដៃ')}</button>`:`<button data-rx="language" ${issueWorking?'disabled':''}>${lang==='en'?'ខ្មែរ':'English'}</button>`}<button data-rx="close" ${issueWorking?'disabled':''}>${L('Close','បិទ')}</button></div></header>`;}
function rxShow(){if(!$('receipt-workspace').open)$('receipt-workspace').showModal();}
function prepareReceipts(reset=false){
 if(!canIssue())return;
 if(reset){issueSelected=new Set();issueQuery='';issueError='';}receiptDialogView={type:'prepare'};
 $('receipt-workspace').innerHTML=rxHeader(L('Select customer','ជ្រើសរើសអតិថិជន'))+`<div class="rx-body od-stack"><label class="od-field">${L('Search customers','ស្វែងរកអតិថិជន')}<input id="issue-search" type="search" value="${esc(issueQuery)}" ${issueWorking?'disabled':''}></label><div class="od-cluster"><button type="button" id="issue-select-all" data-rx="select-all" ${issueWorking?'disabled':''}>${L('Select all','ជ្រើសរើសទាំងអស់')}</button></div><div id="issue-options" class="od-stack"></div><p id="issue-selected" role="status"></p><p class="dr-error" role="alert">${esc(issueError)}</p><button class="dr-primary" data-rx="issue" ${issueWorking?'disabled':''}>${issueWorking?L('Preparing…','កំពុងរៀបចំ…'):L('Prepare selected receipts','រៀបចំបង្កាន់ដៃដែលជ្រើស')}</button></div>`;
 issueOptions();rxShow();
}
function issueOptions(){
 try{const existing=issuedStore().receipts.filter(r=>r.dispatchId===trip.id),available=customers.filter(c=>trip.customerIds.includes(c.id)&&[c.id,...c.name].join(' ').toLowerCase().includes(issueQuery.toLowerCase()));
 $('issue-options').innerHTML=available.map(c=>{const issued=existing.some(r=>r.customerId===c.id);return `<label class="rx-option"><input type="checkbox" data-issue-customer="${c.id}" ${issued||issueSelected.has(c.id)?'checked':''} ${issued||issueWorking?'disabled':''}><span class="od-field"><strong>${esc(L(...c.name))}</strong><span>${c.id}${issued?' · '+L('Prepared','បានរៀបចំ'):''}</span></span></label>`;}).join('')||`<p>${L('No matching route customers','គ្មានអតិថិជនត្រូវគ្នា')}</p>`;
 $('issue-selected').textContent=L(issueSelected.size+' selected',issueSelected.size+' បានជ្រើស');
 }catch(_){$('issue-options').innerHTML=`<p role="alert">${L('Unable to read saved receipts. Restore storage access and reopen preparation.','មិនអាចអានបង្កាន់ដៃ។ ស្ដារកន្លែងរក្សាទុក រួចបើកម្ដងទៀត។')}</p>`;}
}
async function issueReceipts(){
 if(issueWorking||!canIssue())return;if(!issueSelected.size){issueError=L('Select at least one customer.','ជ្រើសអតិថិជនយ៉ាងហោចណាស់ម្នាក់។');prepareReceipts();return;}
 issueWorking=true;issueError='';prepareReceipts();await new Promise(r=>setTimeout(r,500));
 try{
 if(receiptScenario==='failure'&&!issueFailed){issueFailed=true;throw Error('sample-failure');}
 if(!canIssue())throw Error('state');const data=issuedStore();let sequence=data.receipts.length;
 for(const id of issueSelected){if(data.receipts.some(r=>r.dispatchId===trip.id&&r.customerId===id))continue;const c=customers.find(c=>c.id===id);if(!c||!trip.customerIds.includes(id))throw Error('customer');let ref;do{ref='PR-'+trip.id.replace('DSP-','')+'-'+String(++sequence).padStart(3,'0');}while(data.receipts.some(r=>r.id===ref)||readSales().sales.some(s=>s.dispatchId===trip.id&&receiptKey(s.id)===receiptKey(ref)));data.receipts.push(receiptSnapshot(trip,c,ref));}
 localStorage.setItem(ISSUED_KEY,JSON.stringify(data));issueWorking=false;issueSelected.clear();$('receipt-workspace').close();receiptDialogView=null;issuedRows();$('driver-announcer').textContent=L('Receipts prepared. No sale or payment created.','បានរៀបចំបង្កាន់ដៃ។ មិនបានបង្កើតការលក់ ឬប្រាក់។');
 }catch(_){issueWorking=false;issueError=L('Receipts not saved. Your selection is preserved. Restore browser storage access or space, then retry.','មិនបានរក្សាទុកបង្កាន់ដៃ។ ជម្រើសនៅរក្សា។ ស្ដារកន្លែងរក្សាទុក រួចសាកម្ដងទៀត។');prepareReceipts();}
}
function findIssued(id){return issuedStore().receipts.find(r=>r.dispatchId===trip.id&&r.id===id);}
function receiptPaper(r){const K=(_en,km)=>km;return `<article class="rx-paper" lang="km"><h2>${K('SOK HENG SALES RECEIPT','បង្កាន់ដៃលក់ សុខ ហេង')}</h2><p class="rx-paper-proposal">${K('SAMPLE · Proposed A4 layout','គំរូ · សំណើទម្រង់ A4')}</p><section class="od-stack"><div>${K('Receipt','បង្កាន់ដៃ')}: ${esc(r.id)} · ${K('Date','ថ្ងៃ')}: ${esc(r.date)}</div><div>${K('Customer','អតិថិជន')}: ${esc(K(...r.name))} · ${esc(r.customerId)}</div><div>${K('Contact','ទំនាក់ទំនង')}: ${r.contact?esc(r.contact):K('Not supplied — confirm before use','មិនទាន់ផ្ដល់ — បញ្ជាក់មុនប្រើ')}</div><div>${K('Dispatch','ដំណើរ')}: ${esc(r.dispatchId)}</div><div>${K('Truck internal ID (sample)','លេខសម្គាល់រថយន្ត (គំរូ)')}: ${esc(r.truckId)} · ${K('Plate','ផ្លាកលេខ')}: ${esc(r.truck)}</div><div>${K('Driver','អ្នកបើកបរ')}: ${esc(K(...r.driver))} · ${K('Salesperson','អ្នកលក់')}: ${esc(K(...r.salesperson))}</div><div>${K('Route','ផ្លូវ')}: ${esc(K(...r.route))}</div></section><table><thead><tr><th>${K('Product','ផលិតផល')}</th><th>${K('Qty','ចំនួន')}</th><th>${K('Unit price','តម្លៃឯកតា')}</th><th>${K('Amount','ទឹកប្រាក់')}</th></tr></thead><tbody>${products.map(p=>`<tr><th scope="row">${K(p[0],p[1])}</th><td></td><td></td><td></td></tr>`).join('')}</tbody></table><table class="rx-totals"><tbody>${[['Sale total','សរុបការលក់'],['Amount paid','ប្រាក់បានទូទាត់'],['Unpaid amount','ប្រាក់មិនទាន់ទូទាត់']].map(p=>`<tr><th>${K(...p)}</th><td></td></tr>`).join('')}<tr><th>${K('Payment method','វិធីទូទាត់')}</th><td>□ ${K('Cash','សាច់ប្រាក់')}　□ KHQR</td></tr></tbody></table><p>${K('Cash: KHR only. Leave actual-sale fields blank before departure. Preparation is not a sale.','សាច់ប្រាក់៖ KHR ប៉ុណ្ណោះ។ ទុកចន្លោះការលក់ពិតមុនចេញដំណើរ។ ការរៀបចំមិនមែនជាការលក់។')}</p><div class="rx-note">${K('NOTE:','កំណត់ចំណាំ៖')}</div><div class="rx-signatures"><div class="od-field"><strong>${K('Seller Signature','ហត្ថលេខាអ្នកលក់')}</strong><div class="rx-signature-line" aria-hidden="true"></div></div><div class="od-field"><strong>${K('Customer Signature','ហត្ថលេខាអតិថិជន')}</strong><div class="rx-signature-line" aria-hidden="true"></div></div></div></article>`;}
function previewIssued(id){const r=findIssued(id);if(!r)return;receiptDialogView={type:'preview',id};$('receipt-workspace').innerHTML=rxHeader(L('Receipt details','ព័ត៌មានបង្កាន់ដៃ'),id)+`<div class="rx-body">${receiptPaper(r)}</div>`;rxShow();}
function blankReceipt(id,error=''){

 const r=findIssued(id);if(!r)return;receiptDialogView={type:'blank',id};$('receipt-workspace').innerHTML=rxHeader(L('Confirm blank return','បញ្ជាក់ប្រគល់ក្រដាសទទេ'))+`<div class="rx-body od-stack"><strong>${esc(L(...r.name))} · ${esc(r.id)}</strong><p>${L('Confirm that this paper was returned blank because the customer did not buy. A missing receipt must stay open.','បញ្ជាក់ថាក្រដាសនេះបានប្រគល់ទទេ ព្រោះអតិថិជនមិនទិញ។ បង្កាន់ដៃបាត់ត្រូវនៅបើក។')}</p><p>${L('No sale, payment or debt change. Any old-debt payment is recorded separately.','មិនបង្កើតការលក់ ប្រាក់ ឬផ្លាស់ប្ដូរបំណុល។ កត់ត្រាប្រាក់សងបំណុលចាស់ដាច់ដោយឡែក។')}</p><p class="dr-error" role="alert">${esc(error)}</p><button class="dr-primary" data-rx="confirm-blank" data-rid="${esc(id)}" ${issueWorking?'disabled':''}>${issueWorking?L('Saving…','កំពុងរក្សាទុក…'):L('Confirm returned without purchase','បញ្ជាក់ប្រគល់វិញដោយមិនទិញ')}</button></div>`;rxShow();
}
async function saveBlank(id){if(issueWorking)return;issueWorking=true;blankReceipt(id);await new Promise(r=>setTimeout(r,500));try{if(receiptScenario==='failure'&&!issueFailed){issueFailed=true;throw Error('sample');}const data=issuedStore(),r=data.receipts.find(r=>r.dispatchId===trip.id&&r.id===id);if(!r||receiptStatus(r,readSales().sales)!=='open')throw Error('recorded');r.outcome='blank';r.returnedAt=new Date().toISOString();localStorage.setItem(ISSUED_KEY,JSON.stringify(data));issueWorking=false;$('receipt-workspace').close();receiptDialogView=null;issuedRows();selectReceiptForSale();$('driver-announcer').textContent=L('Blank return saved. No financial transaction created.','បានរក្សាទុកក្រដាសទទេ។ គ្មានប្រតិបត្តិការហិរញ្ញវត្ថុ។');}catch(_){issueWorking=false;blankReceipt(id,L('Not saved. Recheck whether a sale was recorded or restore browser storage, then retry.','មិនបានរក្សាទុក។ ពិនិត្យការលក់ ឬស្ដារកន្លែងរក្សាទុក រួចសាកម្ដងទៀត។'));}}
function saleFromIssued(id){

 try{const r=findIssued(id);if(!r)return;$('receipt-workspace').close();receiptDialogView=null;const data=readSales();loadSales(data);const saved=linkedSale(r,data.sales);if(saved){openReceipt(saved.id);return;}if(r.outcome==='blank'){issuedRows();return;}
 active={id:'issued:'+r.id,status:'pending',issuedId:r.id,name:[...r.name],customer:r.customerId,prices:[...(customers.find(c=>c.id===r.customerId)?.prices||[null,null,null])]};const d=draft(active);d.receipt=r.id;d.customerId=r.customerId;d.type='registered';submitted=false;failure='';panel();$('sale-panel').showModal();
 }catch(_){issuedRows();}
}
function validateIssuedSale(r,d,sales){
 const issued=issuedStore().receipts.find(x=>x.dispatchId===trip.id&&receiptKey(x.id)===receiptKey(d.receipt));
 if(r.issuedId&&!issued||issued&&(issued.outcome==='blank'||issued.customerId!==r.customer||linkedSale(issued,sales)))throw Error('issued-conflict');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rx]');if(!b)return;e.preventDefault();if(issueWorking)return;try{switch(b.dataset.rx){case'select-filter':recordingReceiptFilter=['open','closed'].includes(b.dataset.filter)?b.dataset.filter:'all';selectReceiptForSale();$('receipt-workspace').querySelector('[aria-pressed=true]')?.focus();break;case'select-retry':selectReceiptForSale();break;case'go-prepare':$('receipt-workspace').close();receiptDialogView=null;selectDispatchTab('receipts',true);break;case'filter':receiptFilters.set(trip.id,['open','closed'].includes(b.dataset.filter)?b.dataset.filter:'all');issuedRows();document.querySelector('[data-rx=filter][aria-pressed=true]')?.focus();break;case'prepare':prepareReceipts(true);break;case'select-all':{if(!canIssue())break;const existing=issuedStore().receipts.filter(r=>r.dispatchId===trip.id);customers.filter(c=>trip.customerIds.includes(c.id)&&!existing.some(r=>r.customerId===c.id)).forEach(c=>issueSelected.add(c.id));issueOptions();break;}case'issue':issueReceipts();break;case'preview':previewIssued(b.dataset.rid);break;case'blank':blankReceipt(b.dataset.rid);break;case'confirm-blank':saveBlank(b.dataset.rid);break;case'sale':saleFromIssued(b.dataset.rid);break;case'reload':issuedRows();break;case'close':$('receipt-workspace').close();receiptDialogView=null;break;case'language':lang=lang==='en'?'km':'en';shell();if(receiptDialogView?.type==='prepare')prepareReceipts();else if(receiptDialogView?.type==='preview')previewIssued(receiptDialogView.id);else if(receiptDialogView?.type==='blank')blankReceipt(receiptDialogView.id);else if(receiptDialogView?.type==='select-sale')selectReceiptForSale();break;case'print':$('receipt-print').innerHTML=receiptPaper(findIssued(b.dataset.rid));document.body.classList.add('rx-printing');window.print();break;}}catch(_){$('driver-announcer').textContent=L('Unable to read receipts. Restore browser storage and retry.','មិនអាចអានបង្កាន់ដៃ។ ស្ដារកន្លែងរក្សាទុក រួចសាកម្ដងទៀត។');}});
document.addEventListener('input',e=>{if(e.target.id==='issue-search'){issueQuery=e.target.value;issueOptions();}});
document.addEventListener('change',e=>{const id=e.target.dataset.issueCustomer;if(id){if(e.target.checked)issueSelected.add(id);else issueSelected.delete(id);issueOptions();}});
$('receipt-workspace').addEventListener('cancel',e=>{if(issueWorking)e.preventDefault();else receiptDialogView=null;});
window.addEventListener('afterprint',()=>document.body.classList.remove('rx-printing'));

// Demo fixtures use separate browser keys and never touch ordinary saved sales.
if(demoReceipts){
 try{
  if(localStorage.getItem(ISSUED_KEY)===null)localStorage.setItem(ISSUED_KEY,JSON.stringify(issuedStore()));
  if(receiptScenario==='recorded'&&localStorage.getItem(STORAGE_KEY)===null){
   const c=customers.find(c=>c.id===trips[0].customerIds[0]);
   localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,sales:[{id:'SAMPLE-157-001',dispatchId:trips[0].id,buyerType:'registered',customer:c.id,name:[...c.name],prices:[...c.prices],status:'recorded',recordedAt:new Date().toISOString(),transfer:null,saved:{q:[1,0,0],method:'cash',currency:'KHR',amount:c.prices[0],rate:4000,total:c.prices[0],received:c.prices[0],applied:c.prices[0],balance:0,change:0,adjustment:0,targetCents:Math.round(c.prices[0]/40),fullUsd:false}}]}));
  }
 }catch(_){/* The receipt list reports unavailable storage without overwriting it. */}
}
try{loadSales(readSales());}catch(_){storageIssue=true;}
if(demoReceipts)route(trips[0].id);else route();
})();
