//TODO Change the name of the file

//TODO change all Model names with real names
const Housing = require('../models/Housing')

exports.getAll = () => Housing.find().lean();
exports.getFirstThree = () => Housing.find().limit(3).lean();
exports.getByIdLean = (id) => Housing.getById(id).lean();

exports.getByIdRaw = (id) => Housing.getById(id);

exports.create = (data) => Housing.create(data);

exports.update = async(something,data) => {
        //TODO something.title = data.title..


    await something.save();
}

exports.delete = (id) => Housing.findByIdAndDelete(id);