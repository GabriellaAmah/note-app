

** this is a basic note app created with a http module.
** the note app does the following

-write notes into a directory 
-group notes with the same topic into the same directory
-update an existing topic
-delete an existing topic
-read notes

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

** localhost:4545/delete/your_topic_name


