let http = require('http');
let fs = require('fs');
let path = require('path');

function WriteToFile(file, result){
    return   fs.writeFile(file, JSON.stringify(result)  , err => console.log('no error found'))
}

let server = http.createServer((req, res) => {
    if (req.method == 'POST' && req.url == '/note'){
        let data = []
        req.on('data', chunck => { 
            data.push(chunck)
            return JSON.stringify(data)
           
        });

        req.on('end', () => {
            let parsedData = JSON.parse(data);
            let name = parsedData.name;
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
                })
            }else{
                shelf = {content : [parsedData.note]}
                WriteToFile(newFile, shelf)
            }

            res.writeHead(200, {'Content-Type' : 'application/json'});
        })
    }

    if(req.method == "GET" && req.url.startsWith('/note')){
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
                res.write(result)
                res.end()
            }
        })  
    
    }

    if(req.method == "POST" && req.url.startsWith('/delete')){
        let current_url = req.url.split('/')[2]
        let filePath = path.join(path.dirname(process.mainModule.filename), `${current_url}`);
      return  fs.rmdir(filePath, {recursive : true}, err => console.log(err))
    }
})

server.listen('4545', (err) => console.log('server is running at 4545 on postman'))