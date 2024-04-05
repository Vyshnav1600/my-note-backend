import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from 'pg'

const app=express();
const port = 3000;


// const db=new pg.Client({
//     user:"postgres",
//     host:"localhost",
//     database:"newNotes",
//     password:"1700",
//     port:5432
// });

const pool = new pg.Pool({
    user:"postgres",
    host:"localhost",
    database:"newNotes",
    password:"1700",
    port:5432
  })

  //react,list chyaa

// db.connect();

// app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({origin : "http://localhost:3006" , method : "GET,PUT,POST,DELETE"}));
app.use(bodyParser.json()); 



 const getCurrentNotes = async () =>{
    const result = await pool.query('select * from notes');
    return result.rows;
}

app.get("/notes/get", async (req, res) => {
    const existingNotes=await getCurrentNotes(); 
    res.send(existingNotes);
  });

  app.get("/", async (req, res) => {
    res.send("avaible paths:/notes/get,/notes/add,/notes/delete/{id},/notes/edit/{id}");
  });


app.post("/notes/add",async(req,res) => {
    const body = req.body;
    console.log("Body:", body);
    try{
        await pool.query("insert into notes (title,content) Values($1,$2)",
        [body.title,body.content]);
        res.status(200);
        res.send({messeage:"Succesfully Added Note"});
    }catch(err){
        console.log(err);
        res.status(500);
        res.send({messeage:err});
    }
});

app.put("/notes/edit/:id",async(req,res) => {
    const id=req.params.id;
    const body = req.body;
    console.log("body:",body);
    console.log("id:",id);
    try{await pool.query("Update notes SET title=$1,content=$2 Where id=$3 ",[body.title,body.content,id])
    res.status(200);
    res.send({messeage:"Succesfully Updated Note"});
    }catch(err){
        console.log(err);
        res.status(500);
        res.send({messeage:err});
    }
});


app.delete("/notes/delete/",async(req,res) => {
    
    const id = req.query.id;
    console.log("id:",id);
    try{
       const abc = await pool.query("delete From notes Where id= $1",[id]);
       if(abc.rowCount===0){
        res.status(404);
        res.send({messeage:"Notes Not Found"});
       }else{
        res.status(200);
        res.send({messeage:"Succesfully Deleted Note"});
       }
        
    }catch(err){
        console.log(err);
        res.status(500);
        res.send({messeage:err});
    }
});

app.listen(port,  () => {
    console.log("The server is now started at port" + port);
  });
  