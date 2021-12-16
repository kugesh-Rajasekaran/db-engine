import { db } from "./main.js";

export function createNode(payload) {
    console.log(`[createNode] Handling request with data ${JSON.stringify(payload)}`);
  const { owner, type, create } = payload;
  if (!db.tree[owner]) db.tree[owner] = {};
  if (!db.tree[owner][type]) db.tree[owner][type] = [];
  const _id = generateId(owner, type);
  db.tree[owner][type].push({ id: _id, ...create });
  console.log(`CREATED NODE -> ${JSON.stringify(db)}`);
  return { id: _id };
}

const generateId = (owner, type) => {
  return `${owner}_${type}_${new Date().getTime()}_${Math.floor((Math.random() * 100000))}`;
};

export function updateNode(payload) {
    console.log(`[updateNode] Handling request with data ${JSON.stringify(payload)}`);
  const { owner, type, update } = payload;
  let index = 0;
  if (
    !db.tree[owner] ||
    !db.tree[owner][type] ||
    !db.tree[owner][type].find((ele) => {
      index++;
      return ele.id == update.id;
    })
  )
    return "Updation failed. Record not found for given id";
  db.tree[owner][type][index - 1] = update;
  console.log(`UPDATED NODE -> ${JSON.stringify(db)}`);
  return "Updated Successfully";
}

export function queryTree(query) {
    console.log(`[queryTree] Handling request with data ${JSON.stringify(query)}`);
  const { owner, type, matching = null, tags = null } = query;
  const result = {};
  if (!!matching) result["value-matches"] = findMatchingNodes(owner, type, matching, isValMatching);
  if (!!tags) result["tag-matches"] = findMatchingNodes(owner, type, tags, isTagMatching);
  console.log(`From queryTree -> ${JSON.stringify(result)}`)
  return result;
}


const findMatchingNodes = function(owner, type, tags, fnToCall) {
    console.log(`[findTaggedNodes] Handling request with data ${[owner, type, tags]} `);
      if (!db.tree[owner] || !db.tree[owner][type])
        return "Tree is empty. Please add data to query";
      const records = db.tree[owner][type];
      const recLen = records.length;
      const result = [];
      let itr;
      for (itr = 0; itr < recLen; itr++) {
          const isMatched = fnToCall(Object.keys(records[itr]), tags, records[itr]);
          if(isMatched)
            result.push(records[itr]);
      }
      return result;
    };

    const isValMatching = function(lok, matching, obj) {
        console.log(`[isTagMatching] Handling request with data lok - ${lok}, matches - ${JSON.stringify(matching)}, obj - ${obj}`);
      if (!lok) return false;
      const keysLen = lok.length;
      let itr;
      for (itr = 0; itr < keysLen; itr++) {
          const matchingKeys = Object.keys(matching);
          const objVal = obj[lok[itr]];
          console.log(`--->  ${lok[itr]} ${matchingKeys} ${JSON.stringify(matchingKeys[lok[itr]])} objVal - ${objVal}`)
          if(matchingKeys.includes(lok[itr]) && matching[lok[itr]] == objVal)
            return true;
          if(typeof obj[lok[itr]] =='object')
            return isValMatching(Object.keys(objVal), matching, objVal);
      }
      return false;
    };

    const isTagMatching = function(lok, tags, obj) {
        console.log(`[isTagMatching] Handling request with data lok - ${lok}, tags - ${JSON.stringify(tags)}, obj - ${obj}`);
        console.log(tags)
      if (!lok) return false;
      const keysLen = lok.length;
      let itr;
      for (itr = 0; itr < keysLen; itr++) {
          const objVal = obj[lok[itr]];
          console.log(tags.includes(lok[itr]))
          if(tags.includes(lok[itr]))
            return true;
          if(typeof obj[lok[itr]] =='object')
            return isTagMatching(Object.keys(objVal), tags, objVal);
      }
      return false;
    };





