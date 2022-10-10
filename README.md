# DB Engine 
(Created as a part of 24 hour hachathlon)
##
```sh
API link - [ https://database-engine-27iia6qixq-el.a.run.app ]
```
## Description
DB engine is a simple application which performs create, read, update operations on user provided data. The application is intended to use file storage but ended up using in-memory storage (in the sense, the appication not completed).  There is only one endpoint and operations will be based on the user provided input. Implemented data transfer from application memory to file but couldn't find enough time to recreate into a complete solution.
## API Operations
### Create operation
#### input 
```sh
{ operation: 'create', data: { owner: string, type: string, ...data_need_to_store } }
```
  ex. 
```sh
{ 
"operation": "create",
	"data": {
		"owner": "kugesh",
		"type": "notes",
		"create": {
			"name": "sample",
			"description": "Just a single line text",
			"date": "13 July 2021"
		}
	}
}     
```
   #### output 
```sh   
    {
	"result": {
		"id": "kugesh-notes_notes_1639672709320_64539" // created record's ID
	    }
    }
```

### Update operation
#### input 
```sh
{ operation: 'update', data: { owner: string, type: string, update: { id: string, ...data_need_to_update } } }
```
  ex. 
```sh
{
	"operation": "update",
	"data": {
		"owner": "kugesh-notes",
		"type": "notes",
		"update": {
			"id": "kugesh-notes_notes_1639672333921_55138",
			"name": "ramprasad",
			"description": "Just a third text",
			"date": "22 July"
		}
	}
} 
```
   #### output 
```sh   
    {
	"result": "Updated Successfully"
    }
```

### Read operation
#### input 
```sh
{ operation: 'read', query: { owner: string, type: string, matching: [{ key_to_match: string, value_to_match: string }], tags: [tags_to_be_matched] } }
```
  ex. 
```sh
{ 
"operation": "read",
	"query": {
		"owner": "kugesh-notes",
		"type": "notes",
		"matching": { "name": "kugesh" },
		"tags": ["handsomenes"]
	}
}
```
   #### output 
```sh   
   {
	"result": {
		"value-matches": [
			{
				"id": "kugesh-notes_notes_1639672709320_64539",
				"name": "kugesh",
				"description": "Just a third text",
				"date": "13 July"
			}
		],
		"tag-matches": []
	}
}
```
