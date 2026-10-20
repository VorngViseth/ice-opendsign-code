import {copyFile,mkdir,rm} from 'node:fs/promises';
const files=["home.html", "home.js", "home.css", "fuel-approvals.html", "fuel-procurement.html", "fuel-procurement.js", "fuel-procurement.css", "production-sales.html", "production-sales.js", "production-sales.css", "production-data.js", "executive-overview.html", "executive-overview.js", "executive-overview.css", "executive-data.js", "daily-finance.html", "daily-finance.js", "daily-finance.css", "app.js", "debt-collection.css", "debt-collection.html", "debt-collection.js", "dispatch-documents.html", "dispatch-ice-return-3.html", "dispatch-planning.html", "dispatch-returns.html", "dispatch-store.js", "dispatch-workflow.css", "dispatch-workflow.js", "dispatch.html", "driver-sales.css", "driver-sales.html", "driver-sales.js", "index.html", "shared-dispatches.js", "styles.css"];
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of files) await copyFile(file,'dist/'+file);
console.log('Static prototype copied to dist.');
