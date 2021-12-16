import express from "express";
import bodyParser from "body-parser";
import { createNode, updateNode, queryTree } from "./operations.js";
import { transferDataToFile } from './utils/transfer-data.js';

const api = express();
const port = 3000;
export const usagePattern = { create: {}, update: {}, read: {} };
export const db = {
  calculatedSize: 0,
  tree: {}
};
/* request object structure */
const reqObjStr = {
  create: `{ operation: 'create', data: { owner: string, type: string, ...data_need_to_store } }`,
  update: `{ operation: 'update', data: { owner: string, type: string, update: { id: string, ...data_need_to_update } } }`,
  read: `{ operation: 'read', query: { owner: string, type: string, matching: [{ key_to_match: string, value_to_match: string }], tags: [tags_to_be_matched] } }`,
};
/**
 * CREATE
 *      { operation: 'create', data: { owner: string, type: string, create: { ...data_need_to_store } }
 * UPDATE
 *      { operation: 'update', data: { owner: string, type: string, update: { id: string, ...data_need_to_update } } }
 * READ
 *      { operation: 'read', query: { owner: string, type: string, matching: [ { key_to_match: string, value_to_match: string } ], tags: [tags_to_be_matched] } }
 **/
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

api.post("/", (req, res) => {
  if (!req.body || !req.body.operation) res.send("PLEASE PROVIDE VALID DATA");
  const { operation, data = null, query = null } = req.body;
  switch (operation) {
    case "create":
        handleReq(operation, data, createNode, res);
      break;
    case "update":
        handleReq(operation, data, updateNode, res);
      break;
    case "read":
        handleReq(operation, query, queryTree, res);
      break;
    default:
      res.send(
        `The given operation not permitted. Permitted operations are create, update, read`
      );
  }
});

const handleReq = (operation, payload, fnToCall, res) => {
    if (!isReqValid(operation, payload))
        res.send(
          `${operation} request needs to in the following format - ${reqObjStr[operation]}`
        );
      else {
        const result = fnToCall(payload);
        res.send(result);
        updateUP(operation, payload.owner);
        handleMemory(operation, payload);
      }
}

const handleMemory = (operation, payload) => {
    if(operation != 'create')
        return ;
    db.calculatedSize += JSON.stringify(payload.create).length * 2;
    if(calculatedSize / 1000 > 500)
        transferDataToFile();
}

const updateUP = (operation, owner) => {
    if(!usagePattern[operation][owner])
        usagePattern[operation][owner] = 1;
    else
        !usagePattern[operation][owner]++;
}

const isReqValid = (operation, data) => {
    console.log(JSON.stringify(data));
    if (!data || !data.owner || !data.type) return false;
    switch(operation){
        case 'create':
            if (data.create) 
                return true;
        break;
        case 'update':
            if (data.update && data.update.id) return true;
        break;
        case 'read':
            return true;
        default: 
        return false;
    }
};

api.listen(port, () => {
  console.log("APP started listening");
});
