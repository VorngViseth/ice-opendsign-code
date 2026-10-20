(()=>{'use strict';
const products=[{id:'block',name:['Block ice','ទឹកកកដុំ'],unit:['Blocks','ដុំ'],code:'block'},{id:'tube',name:['Tube ice','ទឹកកកបំពង់'],unit:['Bags','បាវ'],code:'bag'},{id:'crushed',name:['Crushed ice','ទឹកកកកិន'],unit:['Bags','បាវ'],code:'bag'}];
const rows=[];
function add(id,product,kind,qty,date,extra={}){rows.push({id,ref:id,product,kind,qty,unit:products.find(p=>p.id===product).code,date,time:'09:00',entered:date+' 10:00',customer:kind==='production'?null:['Sokha Market','ផ្សារសុខា'],dispatch:kind==='driver'?'DSP-0928-01':null,payment:kind==='driver'?'partial':'paid',...extra});}
products.forEach((p,i)=>{add('BATCH-142-'+(i+1),p.id,'production',[500,1000,300][i],'2026-09-23');add('WI-142-'+(i+1),p.id,'walkin',[100,200,80][i],'2026-09-24');add('DR-142-'+(i+1),p.id,'driver',[350,700,240][i],'2026-09-25',{entered:'2026-09-28 16:00'});});
add('BATCH-142-04','block','production',120,'2026-09-20');add('WI-142-04','tube','walkin',60,'2026-09-21',{payment:'unpaid'});
add('BATCH-142-05','tube','production',100,'2026-09-29');add('DR-142-05','tube','driver',40,'2026-09-29');add('DR-142-06','tube','driver',6,'2026-09-29',{unit:'split-bag'});add('DR-142-07','crushed','driver',12,'2026-09-29',{unit:null});
function records(from,to,product='all'){return [...new Map(rows.map(r=>[r.id,r])).values()].filter(r=>r.date>=from&&r.date<=to&&(product==='all'||r.product===product));}
function summary(from,to,product='all'){return products.filter(p=>product==='all'||p.id===product).map(p=>{const rs=records(from,to,p.id),invalid=rs.filter(r=>r.unit!==p.code),sum=k=>rs.filter(r=>r.kind===k&&r.unit===p.code).reduce((v,r)=>v+r.qty,0),production=sum('production'),walkin=sum('walkin'),driver=sum('driver');return {...p,production,walkin,driver,sold:walkin+driver,difference:invalid.length?null:production-walkin-driver,invalid,records:rs};});}
window.ProductionData={products,rows,records,summary};
})();
