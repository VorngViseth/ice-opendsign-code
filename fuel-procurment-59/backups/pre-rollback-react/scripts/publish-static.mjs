import {copyFile,mkdir,cp,readFile,writeFile} from 'node:fs/promises';
const pages=['index.html','driver-sales.html','debt-collection.html','dispatch-planning.html','dispatch.html','dispatch-documents.html','dispatch-returns.html','dispatch-ice-return-3.html'];
const html=await readFile('dist/index.html','utf8');
for(const page of pages){await writeFile('dist/'+page,html);await copyFile('dist/'+page,page);}
await mkdir('assets',{recursive:true});await cp('dist/assets','assets',{recursive:true});
