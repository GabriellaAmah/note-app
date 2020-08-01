let http = require('http');
let fs = require('fs');
let path = require('path');


function WriteToFile(file, result){
    //function to write into a file. it has two parameters file- the file to be written into, result- data to be written into the file
    return   fs.writeFile(file, JSON.stringify(result)  , err => console.log('no error found'))
}

let server = http.createServer((req, res) => {
    //parsedchunck is gotton when we parse the value of chunck which is in a json format
    //data returns a array of a single object which we will be working with
    // check if the particular file or directory exist if not, make a new directory with the name
    //newfile is a .txt file that will be created once a new directory is made
    //if a directory exist, we check for the .txt file and then update it
    //if the directory is newly created, then we insert our data


    if (req.method == 'POST' && req.url == '/note'){
        let data = []
        req.on('data', chunck => { 
            let parsedChunck = JSON.parse(chunck)
            data.push(parsedChunck) 
        });

        req.on('end', () => {
            let parsedData = data[0];
            let name = parsedData.name
            let newFile;
            let shelf 

            if(!fs.existsSync(name)){
                fs.mkdir(name, err => console.log(err));
            };

            
            newFile = path.join(path.dirname(process.mainModule.filename), `${name}`, `${name}.txt`)

            if(fs.existsSync(newFile)){
               return fs.readFile(newFile, (err, data) => {
                    if(!err){
                      shelf =  JSON.parse(data)
                      shelf.content.push(parsedData.note)

                     WriteToFile(newFile, shelf)
                    
                    }
                    res.end()
                })

            }else{
                shelf = {content : [parsedData.note]}
                WriteToFile(newFile, shelf)
            }
            

            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(() => console.log('data inserted'))
        })
        
    }

    //to read into a file

    if(req.method == "GET" && req.url.startsWith('/note')){
        //input a url, current_url gets the pathname
        //filepath is a path a .txt file with the current_url value as a name
        //if filepath does not exist we end the connection
        //if filepath exist we read its content and present it

        let current_url = req.url.split('/')[2]
        let filePath = path.join(path.dirname(process.mainModule.filename), `${current_url}`, `${current_url}.txt`);

        if(!fs.existsSync(filePath)){
            res.write('you do not have a note')
            res.end()
        }
        
        res.writeHead(200, {'Content-Type' : 'application/json'});
        fs.readFile(filePath, (err, data) => {
            if(!err){
                let result = data.toString()
                JSON.parse(result).content.forEach(note => {
                    res.write(`${note}\n`)
                });
                res.end()
            }
        })  
    
    }

    // to delete a directory
    if(req.method == "POST" && req.url.startsWith('/delete')){
        //current_url is the pathname from the url;
        //filepath is a directory with its name the vale of the current_url
        //the directory is found and deleted

        let current_url = req.url.split('/')[2]
        let filePath = path.join(path.dirname(process.mainModule.filename), `${current_url}`);
      return  fs.rmdir(filePath, {recursive : true}, err => console.log(err))
    }
})

server.listen(4545, (err) => console.log('server is running at 4545 on postman'))