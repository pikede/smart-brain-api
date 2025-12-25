/*
old way off communicating with clarifyapi
const Clarifai = require('clarifai');

const app = new Clarifai.App({apiKey : ''});;

const handleApiCall = (req, res) => {
    const modelId = 'face-detection';
    app.models
    .predict(modelId, req.body.input)
    .then(data => {
        console.log(data)
        res.json(data)
    })
    .catch(err => {
        console.log(err.toString());
        res.status(400).json("unable to reach API")});
}*/

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
require('dotenv').config();

const stub = ClarifaiStub.grpc();
const PAT = process.env.CLARIFAI_API_KEY;
const USER_ID = 'clarifai';
const APP_ID = 'main';
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key "+ PAT);

const handleApiCall = (req, res) => {
    const {input} = req.body;
    if (!input) {
    return res.status(400).json("No image URL provided");
    }

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: "face-detection",
            inputs: [
                {
                    data: {
                        image: {
                            url: input
                        }
                    }
                }
            ]
            },
            metadata,
            (err, response) => {
            if (err) {
                console.log(err);
                return res.status(400).json("unable to reach API");
            }

            if (response.status.code !== 10000) {
                return res.status(400).json("Post model outputs failed");        
            }
            res.json(response);
        }
    );
};


const handleImage = (req, res, db)=> {
    const { id } = req.body;    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => {        
        res.status(400).json('unable to get entries found');
    });    
};

module.exports = {
    handleImage,
    handleApiCall
};