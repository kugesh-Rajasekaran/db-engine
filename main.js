import express from "express";
import bodyParser from "body-parser";
import { createNode, updateNode, queryTree } from "./operations.js";
const api = express();
const port = 3000;
export const db = {
  calculatedSize: 0,
  tree: {
    "kugesh-notes": {
      notes: [
        {
          id: "kugesh-notes_notes_1639652574992_77519",
          name: "rakesh",
          description: "Just a third text",
          date: "13 July",
        },
        {
          id: "kugesh-notes_notes_1639652585708_30590",
          name: "kugesh",
          attitude: { handsomenes: "best" },
          description: "Just a third text",
          date: "13 July",
        },
      ],
    },
    "rakesh-notes": {
      notes: [
        {
          id: "rakesh-notes_notes_1639652611050_65116",
          name: "kugesh",
          description: "Just a third text",
          date: "13 July",
        },
      ],
    },
  },
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
      if (!isReqValid("create", data))
        res.send(
          `Create request needs to in the following format - ${reqObjStr.create}`
        );
      else {
        const result = createNode(data);
        res.send({ id: result});
      }
      break;
    case "update":
      if (!isReqValid("update", data))
        res.send(
          `Update request needs to in the following format - ${reqObjStr.update}`
        );
      else {
        res.send("Record got updated successfully");
        updateNode(data);
      }
      break;
    case "read":
      if (!isReqValid("read", query))
        res.send(
          `Read request needs to in the following format - ${reqObjStr.read}`
        );
      else {
        const result =  queryTree(query);
        res.send(result);
        //console.log(queryTree(query))
      }
      break;
    default:
      res.send(
        `The given operation not permitted. Permitted operations are create, update, read`
      );
  }
});

/**
 * CREATE
 *      { operation: 'create', data: { owner: string, type: string, create: { ...data_need_to_store } }
 * UPDATE
 *      { operation: 'update', data: { owner: string, type: string, update: { id: string, ...data_need_to_update } } }
 * READ
 *      { operation: 'read', query: { owner: string, type: string, matching: [ { key_to_match: string, value_to_match: string } ], tags: [tags_to_be_matched] } }
 **/

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
