const AdModel = require('../models/AdModel')


exports.getAll = () => AdModel.find().lean();
exports.getOneByIdAndInfo = (id) => AdModel.findById(id).populate('author').populate('usersApplied').lean();
exports.getOneById = (id) => AdModel.findById(id);

exports.createAd = (adData) => AdModel.create(adData);
exports.delete = (id) => AdModel.findByIdAndDelete(id)
exports.update = async (ad, updateData) => {
    ad.headline = updateData.headline;
    ad.location = updateData.location;
    ad.companyName = updateData.companyName;
    ad.description = updateData.description;

    await ad.save();
}