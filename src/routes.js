const express = require('express');
const router = express.Router();
const Temp = require('./controllers/Temp');

router.get("/", (req, res) => {
    res.status(200).json({ msg: "Servidor Diz: Tudo certo por aqui!" })
});

router.get("/index", async (req, res) => {
    return await Temp.index(req, res);
});

router.post("/temp", async (req, res) => {
    return await Temp.create(req, res);
});

router.get("/temp/:count", async (req, res) => {
    return await Temp.lastRecords(req, res);
});

router.get("/temp/date/:date/:count", async (req, res) => {
    return await Temp.searchTemp(req, res);
});

router.get("/available", async (req, res) => {
    return await Temp.datesAvailable(req, res);
})





module.exports = router;