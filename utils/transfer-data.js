import { createWriteStream } from 'fs';
import { db, usagePattern } from '../main.js';
export function transferDataToFile(){
    const ownerName = userDataToRemove();
    const fd = createWriteStream('./datafile.txt', { flags: 'a' });
    fd.write('*****');
    fd.write(`***start***'${db.tree[ownerName]}***end***`);
    delete db.tree[ownerName];
}

function userDataToRemove(){
    const readersList = usagePattern.read;
    const rlKeys = Object.keys(readersList);
    const rlKeysLen = rlKeys.length;
    if(!rlKeysLen)
        return null;
    let itr, lv = readersList[rlKeys[0]], lvName = null;
    for(itr = 0 ; itr < rlKeysLen ; itr++){
        if(lv > readersList[rlKeys[itr]]){
            lv = readersList[rlKeys[itr]];
            lvName = rlKeys[itr];
        }
    }
    return lvName;
}