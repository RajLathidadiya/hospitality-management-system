import { promises as fs } from 'fs';
import path from 'path';
const DATA_DIR=path.join(process.cwd(),'data');
async function ensure(name:string,fallback:unknown[]){await fs.mkdir(DATA_DIR,{recursive:true});const f=path.join(DATA_DIR,name);try{await fs.access(f)}catch{await fs.writeFile(f,JSON.stringify(fallback,null,2))}return f}
export async function readCollection<T>(name:string,fallback:T[]=[]){const f=await ensure(name,fallback);return JSON.parse(await fs.readFile(f,'utf8')) as T[]}
export async function writeCollection<T>(name:string,data:T[]){const f=await ensure(name,[]);await fs.writeFile(f,JSON.stringify(data,null,2))}
