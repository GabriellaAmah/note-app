

** this is a basic note app craeted with a http module.
** it helps to store notes based on the topic of the note

** input data in this format
 ```
 {
    "name" : "fiction",
    "note" : "this note is a scene i created"
 }

 ```

* name - the topic you are writing into
* note - the note you are writing under the topic

** localhost:4545/note - to enter note    [Post request]
** localhost:4545/note/your_topic_name e.g localhost:4545/note/fiction  [Get request]


