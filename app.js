const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const port = 3001;

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/rest_api',{useNewUrlParser:true,useUnifiedTopology:true});

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number
});

const Items = mongoose.model('Item', itemSchema);


app.get('/getdata', async (req, res) => {
    try {
        const allItems = await Items.find({});
        res.send(allItems);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
app.post('/postdata', async (req,res)=>{
    try{
        const newItem = new Items({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price
        });
        await newItem.save();
        res.status(201).send(newItem);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
app.delete('/deletedata/:id', async (req,res)=>{
    try{
        const deletedItem = await Items.findByIdAndDelete(req.params.id);
        if(!deletedItem){
            res.status(404).send('No item found');
        }
        res.send(deletedItem);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
app.get('/singaldata/:id', async (req,res)=>{
    try{
        const item = await Items.findById(req.params.id);
        if(!item){
            res.status(404).send('No item found');
        }
        res.send(item);
    }catch(err){
        res.status(500).send({error:err.message});
    }
}
);
app.put('/updatedata/:id', async (req,res)=>{
    try{
        const updatedItem = await Items.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price
        },{new:true});
        if(!updatedItem){
            res.status(404).send('No item found');
        }
        res.send(updatedItem);
    }catch(err){
        res.status(500).send({error:err.message});
    }
}
);
app.patch('/update-patch-data/:id', async (req,res)=>{
    try{
        const updatedItem = await Items.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true});
        if(!updatedItem){
            res.status(404).send('No item found');
        }
        res.send(updatedItem);
    }catch(err){
        res.status(500).send({error:err.message});
    }
}
);

app.listen(port,()=>{
    console.log('Server is running on port',port);
}
);