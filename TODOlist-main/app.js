const express=require("express")
const mongoose=require('mongoose')
const app=express()
const _=require("lodash")


app.use(express.urlencoded())
app.use(express.static("public"))
app.set('view engine','ejs')

mongoose.connect("mongodb+srv://Admin_Aryaman:aryaman887@cluster0.vitpw.mongodb.net/todoListDB",{useNewUrlParser:true})

const itemsSchema={
    name: String
}

const Item= mongoose.model("Item",itemsSchema)


const item1 =new Item({
     name:"Welcome"
})
const item2 =new Item({
    name:"Hi"
})
const item3 =new Item({
    name:"Hello"
})

const defaultitems=[item1,item2,item3]

const listSchema={
    name:String,
    items:[itemsSchema]
}

const List =mongoose.model("List",listSchema)


app.get("/",function(req,res){
    

    Item.find({},function(err,results){

        if(results.length==0){
          Item.insertMany(defaultitems,function(err){
            if(err)
               console.log(err)
            else
               console.log("Sucess")
           
            })
            res.redirect("/")
        }

        else{
            res.render("list",{listtitle:"Today",newlistitems:results})
        }
        
    })
    
   

})

app.get("/:customlistname",function(req,res){
    const customlistname=_.capitalize(req.params.customlistname)
  

    List.findOne({name:customlistname},function(err,rslt){
        if(!err)
        {
            if(!rslt)
            {
                   const list=new List({
                    name:customlistname,
                    items:defaultitems
                })
                list.save()
                res.redirect("/"+customlistname)
            }
            else
            {
                res.render("list.ejs",{listtitle:customlistname,newlistitems:rslt.items})
            }
            
        }
  
    
    })



})




app.post("/",function(req,res){
    
    const itemname=req.body.newitem
    const listname=req.body.list

    const item=new Item({
        name:itemname
    })
    
    if(listname=="Today")
    {
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listname},function(err,rslt){
            rslt.items.push(item)
            rslt.save()
            res.redirect("/"+listname)
        })
    }
   
  
    
})

app.post("/delete",function(req,res){
   const checkeditemid=req.body.checkbox
   const Listname=req.body.listname

   if(Listname=="Today"){

   
   Item.findByIdAndRemove(checkeditemid,function(err){
       if(err)
       console.log(err)
       else{
        console.log("Removed")
        res.redirect("/")
       }
       
    })
  } 
  else{
        List.findOneAndUpdate({name:Listname},{$pull:{items:{_id:checkeditemid}}},function(err,rslt){
            if(!err)
            res.redirect("/"+Listname)
        })
  }
})

app.get("/work",function(req,res){
    res.render("list",{listtitle:"work list",newlistitems:workitems})
})


app.post("/work",function(req,res){
    let item=req.body.newitem;
    workitems.push(item)
    res.redirect("/work")
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
    console.log("Server started on port 3000")
})