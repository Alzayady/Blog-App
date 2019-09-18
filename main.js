var express =require("express");
var app=express();
var bodybarser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser:true,
	useCreateIndex:true
}).then(()=>{
	console.log("connected to Db");
}).catch(err=> {
	console.log("Error",err.message);
});

app.use(express.static("public"));
app.use(bodybarser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

var BlogSchema=new mongoose.Schema({
	title:String,
	image:String,
	post:String,
	created:{type: Date,default:Date.now}
});

var Blog=mongoose.model("Blog",BlogSchema);


app.get("/",function(req,res){
	res.redirect("/blogs");
});

//Index Restfull Routes 
app.get("/blogs",function(req,res){
	Blog.find({},function(err,MOBS){
		res.render("Index",{MOBS:MOBS});
	});
});
	
// new Restful Routs 

app.get("/blogs/new",function(req,res){
	res.render("new");
});

// create Restful Route 
app.post("/blogs",function(req,res){
	console.log(req.body);
	var name=req.body.blog.name;
	var image=req.body.blog.image;
	var desc=req.body.blog.body;
	Blog.create({
		title:name,
		image:image,
		post:desc
	},function(err){
		if(err){
			console.log("not saved");
		}else{
			console.log("saving done");
		}
	});
	
	res.redirect("/blogs");
});
// show Restful Route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,Ele){
		if(err){
			console.log("not get Id");
		}else{
			console.log("Getting Element");
			res.render("show",{Ele:Ele});
		}
	});
});

// edit Restfull Route

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,ele){
		if(err){
			console.log("some Thing Goes Wrong ");
		}else{
			res.render("edit",{ele:ele});
		}
	});
});
//update 
app.put("/blogs/:id",function(req,res){
	
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//Destroy
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log("Delete Error");
		}else{
			console.log("Delete Done");
			res.redirect("/blogs");
		}
	});
});
app.listen(3000,function(){
	console.log("server is running");
});