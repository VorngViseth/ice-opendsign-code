import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,cleanup,fireEvent,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import {KEYS,baseTrips,write} from '../src/domain/storage';
import {transition} from '../src/domain/rules';
import type {Trip} from '../src/domain/models';
beforeEach(()=>{localStorage.clear();history.replaceState({},'','/index.html');HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;};window.scrollTo=vi.fn();Object.defineProperty(navigator,'locks',{configurable:true,value:{request:(_key:string,fn:()=>unknown)=>Promise.resolve(fn())}});});
afterEach(cleanup);
describe('React operational interactions',()=>{
 it('keeps walk-in quantities disabled until customer selection and retains draft in Khmer',async()=>{const user=userEvent.setup();render(<App/>);const q=screen.getByRole('spinbutton',{name:'Block ice quantity'});expect((q as HTMLInputElement).disabled).toBe(true);await user.click(screen.getByRole('button',{name:'Select customer'}));await user.type(screen.getByRole('searchbox'),'+855 12 000 001');await user.click(screen.getByRole('button',{name:/Sokha Market/}));expect((q as HTMLInputElement).disabled).toBe(false);fireEvent.change(q,{target:{value:'2'}});await user.click(screen.getByRole('button',{name:'ខ្មែរ'}));expect((screen.getByRole('spinbutton',{name:'បរិមាណ ទឹកកកដុំ'}) as HTMLInputElement).value).toBe('2');});
 it('blocks fractional quantity and incomplete occasional walk-in payment',async()=>{const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'Occasional buyer'}));fireEvent.change(screen.getByRole('spinbutton',{name:'Block ice quantity'}),{target:{value:'1.5'}});await user.click(screen.getByRole('button',{name:'Show required corrections'}));expect(screen.getAllByText(/Enter a whole quantity/).length).toBeGreaterThan(0);expect((screen.getByRole('button',{name:'Complete sale'}) as HTMLButtonElement).disabled).toBe(true);});
 it('opens a dispatch directly and persists a driver sale once',async()=>{const user=userEvent.setup();history.replaceState({},'','/driver-sales.html#dispatch='+baseTrips[0].id);render(<App/>);await user.click(screen.getByRole('button',{name:'Add sale'}));await user.click(screen.getByRole('button',{name:'Occasional buyer'}));await user.type(screen.getByRole('textbox',{name:'Receipt number *'}),'R-TEST-01');fireEvent.change(screen.getByRole('spinbutton',{name:'Block ice quantity'}),{target:{value:'1'}});await user.click(screen.getByRole('button',{name:'Record sale'}));await screen.findByText('Saved sale');const stored=JSON.parse(localStorage.getItem(KEYS.sales)!);expect(stored.sales).toHaveLength(1);expect(stored.sales[0].saved.balance).toBe(5200);expect(stored.sales[0].buyerType).toBe('occasional');});
 it('retains the separate dispatch departure handoff',async()=>{const user=userEvent.setup();const t:Trip=transition({...baseTrips[0],status:'created',planned:[1,1,1]},'verify',[1,1,1]);write(KEYS.dispatch,{version:1,records:{[t.id]:t}});history.replaceState({},'','/dispatch-documents.html?view=handoff#'+t.id);render(<App/>);expect((screen.getByRole('button',{name:'Confirm departure'}) as HTMLButtonElement).disabled).toBe(true);await user.click(screen.getByRole('button',{name:'Confirm documents issued'}));await user.click(screen.getByRole('button',{name:'Confirm departure'}));await user.click(within(screen.getByRole('dialog')).getByRole('button',{name:'Depart'}));await waitFor(()=>expect(JSON.parse(localStorage.getItem(KEYS.dispatch)!).records[t.id].status).toBe('dispatched'));});
 it('generates all route customers across search, preserves choices and prevents duplicates',async()=>{
  const user=userEvent.setup();const t:Trip=transition({...baseTrips[0],status:'created',planned:[1,1,1]},'verify',[1,1,1]);write(KEYS.dispatch,{version:1,records:{[t.id]:t}});
  history.replaceState({},'','/dispatch-documents.html#'+t.id);render(<App/>);
  expect(screen.queryByRole('button',{name:'Confirm departure'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Generate receipts'}));
  const search=screen.getByRole('searchbox',{name:'Find customer'});
  await user.type(search,'C-001');await user.click(screen.getByRole('button',{name:'Select all customers on route'}));
  expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  await user.click(screen.getByRole('checkbox'));
  await user.clear(search);
  await user.click(screen.getByRole('button',{name:'ខ្មែរ'}));
  expect(screen.getByRole('button',{name:`បង្កើតបង្កាន់ដៃ ${t.customerIds.length-1}`})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'EN'}));
  await user.click(screen.getByRole('button',{name:`Generate ${t.customerIds.length-1} receipts`}));
  await screen.findByText('Receipts generated. Ready to preview and print.');
  const initial=JSON.parse(localStorage.getItem(KEYS.receipts)!).receipts;
  expect(initial).toHaveLength(t.customerIds.length-1);expect(initial.some((r:{customerId:string})=>r.customerId==='C-001')).toBe(false);
  expect(localStorage.getItem(KEYS.sales)).toBeNull();expect(localStorage.getItem(KEYS.collections)).toBeNull();
  await user.click(screen.getByRole('button',{name:'Generate receipts'}));await user.click(screen.getByRole('button',{name:'Select all customers on route'}));
  await user.click(screen.getByRole('button',{name:'Generate 1 receipts'}));await screen.findByText('Receipts generated. Ready to preview and print.');
  expect(JSON.parse(localStorage.getItem(KEYS.receipts)!).receipts).toHaveLength(t.customerIds.length);
  await user.click(screen.getByRole('button',{name:'Preview / print all'}));
  expect(within(screen.getByRole('dialog')).getAllByText('Seller Signature')).toHaveLength(t.customerIds.length);
  expect(within(screen.getByRole('dialog')).getAllByText('Customer Signature')).toHaveLength(t.customerIds.length);
 });
 it('keeps customer choices after a failed receipt generation and saves on retry',async()=>{
  const user=userEvent.setup();const t:Trip=transition({...baseTrips[0],status:'created',planned:[1,1,1]},'verify',[1,1,1]);write(KEYS.dispatch,{version:1,records:{[t.id]:t}});
  history.replaceState({},'','/dispatch-documents.html#'+t.id);render(<App/>);await user.click(screen.getByRole('button',{name:'Generate receipts'}));await user.click(screen.getByRole('button',{name:'Select all customers on route'}));
  const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementationOnce(()=>{throw Error('quota');});
  await user.click(screen.getByRole('button',{name:`Generate ${t.customerIds.length} receipts`}));await screen.findByText(/Receipts not saved/);
  expect(localStorage.getItem(KEYS.receipts)).toBeNull();spy.mockRestore();
  await user.click(screen.getByRole('button',{name:`Generate ${t.customerIds.length} receipts`}));await screen.findByText('Receipts generated. Ready to preview and print.');expect(JSON.parse(localStorage.getItem(KEYS.receipts)!).receipts).toHaveLength(t.customerIds.length);
 });

});

describe('collection and receipt outcomes',()=>{
 it('keeps a changed-balance attempt unsaved and allows a reviewed retry',async()=>{const user=userEvent.setup();history.replaceState({},'','/debt-collection.html?scenario=race');render(<App/>);const buttons=await screen.findAllByRole('button',{name:'Record collection'});await user.click(buttons[0]);const amount=screen.getByRole('spinbutton',{name:/Actual amount collected/});fireEvent.change(amount,{target:{value:'40000'}});await user.click(screen.getByRole('button',{name:'Confirm collection'}));await screen.findByText(/Balance changed before saving/);const key=KEYS.collections+'.fixture.race';let stored=JSON.parse(localStorage.getItem(key)!);expect(stored.tickets[0].status).toBe('pending');expect(stored.balances['C-001'].amount).toBe(80000);await user.click(screen.getByRole('button',{name:'Confirm collection'}));await screen.findByText('Saved collection outcome');stored=JSON.parse(localStorage.getItem(key)!);expect(stored.balances['C-001'].amount).toBe(40000);expect(stored.tickets[0].record.amount).toBe(40000);});
 it('requires explicit blank-return confirmation and leaves missing papers pending',async()=>{const user=userEvent.setup();history.replaceState({},'','/driver-sales.html?receipts=three#dispatch='+baseTrips[0].id);render(<App/>);await user.click((await screen.findAllByRole('button',{name:'Returned without purchase'}))[1]);await user.click(screen.getByRole('button',{name:'Confirm returned without purchase'}));await screen.findByText('Blank return saved. No sale, payment or debt created.');const rs=JSON.parse(localStorage.getItem(KEYS.receipts+'.demo.three')!).receipts;expect(rs.map((r:{outcome:string})=>r.outcome)).toEqual(['pending','blank','pending']);expect(localStorage.getItem(KEYS.sales+'.receipts-demo.three')).toBeNull();});
 it('preserves entered collection on failed save without changing debt',async()=>{const user=userEvent.setup();history.replaceState({},'','/debt-collection.html?scenario=failure');render(<App/>);await user.click((await screen.findAllByRole('button',{name:'Record collection'}))[0]);const amount=screen.getByRole('spinbutton',{name:/Actual amount collected/});fireEvent.change(amount,{target:{value:'40000'}});await user.click(screen.getByRole('button',{name:'Confirm collection'}));await screen.findByText(/Collection not saved/);expect((amount as HTMLInputElement).value).toBe('40000');const stored=JSON.parse(localStorage.getItem(KEYS.collections+'.fixture.failure')!);expect(stored.balances['C-001'].amount).toBe(100000);expect(stored.tickets[0].status).toBe('pending');});
 it('places print preview outside the hidden application shell',async()=>{const user=userEvent.setup();history.replaceState({},'','/dispatch-documents.html');render(<App/>);await user.click((await screen.findAllByRole('button',{name:'Preview / print'}))[0]);const dialog=screen.getByRole('dialog');expect(dialog.parentElement).toBe(document.body);expect(document.body.classList.contains('erp-printing')).toBe(true);expect(within(dialog).getByRole('heading',{name:'SOK HENG · SALES RECEIPT'})).toBeTruthy();});
});

describe('connected dispatch preparation',()=>{
 it('creates an order-based dispatch with summed planned quantities and opens verification',async()=>{const user=userEvent.setup();history.replaceState({},'','/dispatch-planning.html');render(<App/>);await user.click(screen.getByRole('button',{name:'Create dispatch'}));await user.selectOptions(screen.getByRole('combobox',{name:'Planning method'}),'order');const blocks=screen.getAllByRole('spinbutton',{name:'Block ice'});fireEvent.change(blocks[0],{target:{value:'2'}});fireEvent.change(blocks[1],{target:{value:'3'}});await user.click(within(screen.getByRole('dialog')).getByRole('button',{name:'Create dispatch'}));await screen.findByRole('button',{name:'Print picking ticket'});const s=JSON.parse(localStorage.getItem(KEYS.dispatch)!);const t=Object.values(s.records)[0] as Trip;expect(t.planned).toEqual([5,0,0]);expect(t.orders).toHaveLength(2);expect(t.status).toBe('created');const links=screen.getAllByRole('link',{name:/Load & Verify/});await user.click(links[links.length-1]);expect(screen.getByRole('button',{name:'Confirm verified load'})).toBeTruthy();});
 it.each(['/dispatch-planning.html','/dispatch.html','/dispatch-documents.html','/dispatch-returns.html','/dispatch-ice-return-3.html','/driver-sales.html','/debt-collection.html'])('mounts the existing route %s',path=>{history.replaceState({},'',path);render(<App/>);expect(screen.queryByRole('heading',{name:/Unable to open/})).toBeNull();expect(screen.getByRole('main')).toBeTruthy();});
});

describe('focused #157 screen',()=>{
 it('opens a usable sample and records A, a blank B and leaves C pending',async()=>{
  const user=userEvent.setup();history.replaceState({},'','/dispatch-documents.html');render(<App/>);
  await screen.findAllByRole('button',{name:'Preview / print'});
  await user.click(screen.getByRole('button',{name:'Returned receipts'}));
  await user.click(screen.getAllByRole('button',{name:'Record sale'})[0]);
  fireEvent.change(screen.getByRole('spinbutton',{name:'Block ice quantity'}),{target:{value:'1'}});
  await user.click(within(screen.getByRole('dialog')).getByRole('button',{name:'Record sale'}));
  await screen.findByText('Saved sale');await user.click(within(screen.getByRole('dialog')).getByRole('button',{name:'Close'}));
  expect(screen.getByRole('button',{name:'View sale'})).toBeTruthy();
  await user.click(screen.getAllByRole('button',{name:'Returned without purchase'})[0]);await user.click(screen.getByRole('button',{name:'Confirm returned without purchase'}));
  await screen.findByText('Blank return saved.');const rs=JSON.parse(localStorage.getItem(KEYS.receipts+'.157-screen.three')!).receipts;
  expect(rs.map((r:{outcome:string})=>r.outcome)).toEqual(['pending','blank','pending']);
  expect(JSON.parse(localStorage.getItem(KEYS.sales+'.157-screen.three')!).sales).toHaveLength(1);
  expect(localStorage.getItem(KEYS.sales)).toBeNull();expect(localStorage.getItem(KEYS.dispatch)).toBeNull();
  await user.click(screen.getByRole('button',{name:'View separate debt collection'}));expect(screen.getByText('20,000 KHR')).toBeTruthy();
 });
 it('generates from the empty sample without modifying dispatch storage',async()=>{const user=userEvent.setup();history.replaceState({},'','/dispatch-documents.html?example=empty');render(<App/>);await screen.findByText('No receipts prepared');await user.click(screen.getByRole('button',{name:'Generate receipts'}));await user.click(screen.getByRole('button',{name:'Select all customers on route'}));await user.click(screen.getByRole('button',{name:'Generate 3 receipts'}));await screen.findByText('Receipts generated. Ready to preview and print.');expect(screen.getAllByRole('button',{name:'Preview / print'})).toHaveLength(3);expect(localStorage.getItem(KEYS.dispatch)).toBeNull();});
 it('keeps a failed blank return pending and allows retry',async()=>{const user=userEvent.setup();history.replaceState({},'','/dispatch-documents.html?example=failure');render(<App/>);await user.click(screen.getByRole('button',{name:'Returned receipts'}));await user.click((await screen.findAllByRole('button',{name:'Returned without purchase'}))[1]);await user.click(screen.getByRole('button',{name:'Confirm returned without purchase'}));await screen.findByText(/Not saved. Your receipt is unchanged/);expect(JSON.parse(localStorage.getItem(KEYS.receipts+'.157-screen.failure')!).receipts[1].outcome).toBe('pending');await user.click(screen.getByRole('button',{name:'Confirm returned without purchase'}));await screen.findByText('Blank return saved.');});
});
