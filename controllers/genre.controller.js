var express = require('express');
const db = require("../models");
const{genres}=require("../models");
const Genre = db.genres;

async function findAllGenres(req,res){
    const data= await db.genres.find({});
    //console.log(data);
    res.json({ genres : data});
}

module.exports={
    findAllGenres
}