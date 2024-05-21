const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// company.db 파일이 있으면 연결하고, 없으면 만들어 연결한다.
const db = new sqlite3.Database("company.db", (err) => {
    if(err) {
        console.error(err);
    } else {
        console.log("Connection has been established successfully!!")
    }
});

// Create a table
db.run(
    `CREATE TABLE IF NOT EXISTS Products(
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductName TEXT,
        SupplierID INTEGER,
        CategoryID INTEGER,
        Unit TEXT,
        Price FLOAT
    )`,
    (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log("Table has been created successfully!!")
        }
    }
);

// Performs a query of all information in the products table.
const search = (callback) => {
    db.all("SELECT * FROM Products", (err, rows) => {
        if(err) {
            console.error(err);
        } else {
            callback(rows);
        }
    });
};

// Prepare a query to add data to our database.
const insertData = db.prepare(
    `INSERT INTO Products (ProductName, SupplierID, CategoryID, Unit, Price)
    VALUES (?, ?, ?, ?, ?)`,
    (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log("Data has been inserted successfully.");
        }
    }
);

// Prepare a query to delete data from the database.
const deleteData = db.prepare(
    `DELETE FROM Products WHERE ProductID == ?`,
    (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log("Data has been deleted successfully!!")
        }
    }
);

// Prepares a query to modify the database data.
const modifyData = db.prepare(
    `UPDATE Products
      SET ProductName = ?,
          SupplierID = ?,
          CategoryID = ?,
          Unit = ?,
          Price = ?
     WHERE ProductID = ?`,
     (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data has been modified successfully.");
        }
     }
);

// Now let's create the server and bring the database information to the server.
const server = http.createServer((req, res)=>{
    // To enable CORS and that there is no problem in this example.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Returns all information to the server.
    search((result)=>{
        res.write(JSON.stringify(result));
        res.end();
    });

    
    // Checks if it is a request with the POST method.
    if(req.method === "POST"){
        let body = "";
        // Receives information sent to the server.
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            // Deserializes the information.
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // Uses the prepared query to insert the data received from the Frontend.
            insertData.run(
                parsedBody.ProductName,
                parsedBody.SupplierID,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price
            );
            console.log("Data has been created successfully.");
        });

        
    // Checks if it is a request with the DELETE method.
    }else if(req.method === "DELETE"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // We use the prepared query to delete the data that the Frontend indicates.
            deleteData.run(parsedBody.ProductID);
            console.log("Data has been deleted successfully.");
        });
    // Checks whether it is a request with the PUT method.
    }else if(req.method === "PUT"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            // We use the prepared query to modify the data received from the Frontend.
            modifyData.run(
                parsedBody.ProductName,
                parsedBody.SupplierID,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price,
                parsedBody.ProductID
            );
            console.log("Dados modificados com sucesso.");
        });
    }

});
const port = 3000;
server.listen(port);
console.log(`Server listening on port ${port}`)