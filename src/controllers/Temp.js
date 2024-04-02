const Register = require('../models/Register')

const jwt = require('jsonwebtoken');
module.exports = {
    async index(req, res) {
        const reg = await Register.find();
        if (reg == null) {
            return res.json({ erro: "Erro" });
        } else {
            return res.json(reg);
        }
    },
    async create(req, res) {
        const {
            temp,
            date,
            hour } = req.body;
        let data = {};
        data = { temp, date, hour };
        let user = await Register.create(data);
        return res.status(201).json(user);

    },
    async details(req, res) {
        const { _id } = req;
        const reg = await Register.findOne({ _id });
        if (reg == null) {
            return false;
        } else {
            return { reg };
        }
    },

    async lastRecords(req, res) {
        const { count } = req.params;
        if (count === undefined || count === 0) {
            return res.status(404).json({ erro: "Não foi possível processar a solicitação" });
        }
        try {
            const registers = (await Register.find().sort({ _id: -1 }).limit(count)).reverse();

            if (registers.length === 0) {
                return res.json({ erro: "Nenhum registro encontrado" });
            } else {

                const temperatures = registers.map(record => record.temp);
                const totalTemperature = temperatures.reduce((acc, temperature) => acc + temperature, 0);
                const averageTemperature = totalTemperature / temperatures.length;

                return res.status(202).json({ registers: registers, averageTemperature: averageTemperature, count: temperatures.length });
            }
        } catch (error) {
            return res.status(500).json({ erro: "Erro interno do servidor" });
        }
    },
    async delete(req, res) {
        const { _id } = req;
        const reg = await Register.findByIdAndDelete({ _id });
        if (reg == null) {
            return res.status(203).json({ erro: "Erro" });
        } else {
            return res.status(202).json(reg);
        }
    },
    async recordsByDate(req, res) {
        const { date } = req.params;

        try {
            const registers = await Register.find({ date });

            const temperatures = registers.map(record => record.temp);

            const totalTemperature = temperatures.reduce((acc, temperature) => acc + temperature, 0);

            const averageTemperature = totalTemperature / temperatures.length;

            return res.status(202).json({ registers: registers, averageTemperature: averageTemperature, count: temperatures.length });
        } catch (error) {
            console.error("Erro ao recuperar os registros por data:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    },

    async searchTemp(req, res) {
        const { date, count } = req.params;

        try {

            const registers = await Register.find({ date }).sort({ _id: -1 }).limit(count);
            const countRegisters = (await Register.find({ date })).length;
            const temperatures = registers.map(record => record.temp);
            const totalTemperature = temperatures.reduce((acc, temperature) => acc + temperature, 0);
            const averageTemperature = totalTemperature / temperatures.length;

            // Encontrar a temperatura máxima e mínima
            const maxTemperature = Math.max(...temperatures);
            const minTemperature = Math.min(...temperatures);

            // Encontrar os registros correspondentes às temperaturas máxima e mínima
            const recordWithMaxTemp = registers.find(record => record.temp === maxTemperature);
            const recordWithMinTemp = registers.find(record => record.temp === minTemperature);

            console.log("Temperatura Máxima:", maxTemperature, "Data e Hora:", recordWithMaxTemp.date + "-" + recordWithMaxTemp.hour);
            console.log("Temperatura Mínima:", minTemperature, "Data e Hora:", recordWithMinTemp.date + "-" + recordWithMinTemp.hour);


            return res.status(202).json({
                registers: registers,
                averageTemperature: averageTemperature,
                count: temperatures.length,
                maxDatesCount: countRegisters,
                max: {
                    temp: maxTemperature,
                    date: recordWithMaxTemp.date,
                    hour: recordWithMaxTemp.hour
                },
                min: {
                    temp: minTemperature,
                    date: recordWithMinTemp.date,
                    hour: recordWithMinTemp.hour
                }
            });
        } catch (error) {
            console.error("Erro ao recuperar os registros por data:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    },
    async datesAvailable(req, res) {
        try {

            const dates = await Register.distinct('date');
            return res.status(202).json({ dates: dates, });
        } catch (error) {
            console.error("Erro ao recuperar os registros por data:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }


}