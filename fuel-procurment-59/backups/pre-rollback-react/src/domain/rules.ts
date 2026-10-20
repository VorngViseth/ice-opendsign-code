import type {Prices,Method,Currency,Trip,Ledger,Ticket} from './models';
export function calculatePayment(q:number[],prices:Prices,method:Method,currency:Currency,amount:number,rate=4000){
 const total=q.reduce((s,n,i)=>s+n*(prices[i]??0),0),usd=method==='khqr'&&currency==='USD',cents=Math.round(amount*100),targetCents=usd?Math.round(total*100/rate):0;
 const received=usd?cents*rate/100:amount,fullUsd=usd&&amount>0&&total>0&&cents===targetCents;
 const adjustment=fullUsd?total-received:0,applied=fullUsd?total:Math.min(total,received),balance=Math.max(0,total-applied),change=method==='cash'?Math.max(0,received-total):0;
 return {total,amount,received,applied,balance,change,adjustment,targetCents,fullUsd,overpayment:method==='khqr'&&(usd?cents>targetCents:received>total),ambiguous:usd&&!fullUsd&&!Number.isInteger(received)};
}
export function transition(t:Trip,action:'verify'|'issue'|'depart'|'return',actual?:number[]):Trip{
 const next=structuredClone(t),at=new Date().toISOString();
 if(action==='verify') {if(t.status!=='created'||t.verifiedAt||!actual||!t.planned||actual.some((v,i)=>!Number.isSafeInteger(v)||v<0||v!==t.planned?.[i]))throw Error('load');next.actual=[actual[0],actual[1],actual[2]];next.verifiedAt=at;}
 if(action==='issue'){if(t.status!=='created'||!t.verifiedAt)throw Error('state');next.issuedAt=at;}
 if(action==='depart'){if(t.status!=='created'||!t.verifiedAt||!t.issuedAt)throw Error('state');next.status='dispatched';next.departedAt=at;}
 if(action==='return'){if(t.status!=='dispatched')throw Error('state');next.status='returned';next.returnedAt=at;}
 return next;
}
export function balanceChange(s:Ledger,id:string,delta:number,type:string,at=new Date().toISOString()){
 const b=s.balances[id];if(!b||!Number.isSafeInteger(delta)||b.amount+delta<0)throw Error('amount');const before=b.amount;b.amount+=delta;if(before===0&&b.amount>0)b.start=at;if(b.amount===0)b.start=null;b.version++;s.events.push({id:crypto.randomUUID(),customer:id,delta,type,at});
}
export function dailySnapshot(s:Ledger,t:Ticket):NonNullable<Ticket['debtHistory']>{
 const allowed=new Set(['collection','sample prior payment','sample external payment','sample full settlement','sample later unpaid purchase']);
 const events=s.events.filter(e=>e.customer===t.customer&&allowed.has(e.type)&&Date.parse(e.at)>=Date.parse(t.start??t.prepared)&&Date.parse(e.at)<=Date.parse(t.prepared));
 const opening=t.snapshot-events.reduce((n,e)=>n+e.delta,0);if(opening<0)throw Error('history');
 const rows=new Map<string,{date:string;added:number;paid:number}>();
 const add=(at:string,delta:number)=>{const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Phnom_Penh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));const r=rows.get(date)??{date,added:0,paid:0};if(delta>0)r.added+=delta;else r.paid-=delta;rows.set(date,r);};
 if(opening)add(t.start??t.prepared,opening);events.forEach(e=>add(e.at,e.delta));
 return {version:1,rows:[...rows.values()].sort((a,b)=>a.date.localeCompare(b.date)),total:t.snapshot,opening};
}
export function recordCollection(s:Ledger,ticketId:string,expected:{amount:number;version:number},input:{none:boolean;amount:number;method:Method;currency:Currency;notes:string}){
 const t=s.tickets.find(t=>t.id===ticketId);if(!t||t.status!=='pending')throw Error('duplicate');const b=s.balances[t.customer];
 if(!b||b.amount!==expected.amount||b.version!==expected.version)throw Error('changed');
 const n=input.none?0:input.amount;if(!input.none&&(input.currency!=='KHR'||!Number.isSafeInteger(n)||n<=0||n>b.amount))throw Error('amount');
 const before=b.amount;if(n)balanceChange(s,t.customer,-n,'collection');t.status=input.none?'none':'collected';t.recorded=new Date().toISOString();t.record={amount:n,currency:input.none?null:'KHR',method:input.none?null:input.method,before,after:b.amount,startAfter:b.start,notes:input.notes,receiver:input.none?null:'driver',reconciliation:!input.none&&input.method==='khqr'?'pending':null,rate:null};return t;
}
