var express = require('express');
const {artists}=require("../models");
const db = require("../models");
const Artist = db.artists;

async function findAllArtists(req,res){
    const data= await db.artists.find({});
    //console.log(data);
    res.json({artists : data});
}

module.exports={
    findAllArtists
}