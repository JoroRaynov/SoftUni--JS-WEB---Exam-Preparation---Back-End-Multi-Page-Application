const housingService = require('../services/housingService');
//TODO Change something with real name
exports.preload = (lean) => async (req, res, next) =>{

    if(lean) {
        res.locals.housing = await housingService.getByIdLean(req.params.id);
    } else {
        res.locals.housing = await housingService.getByIdRaw(req.params.id);
    }
    next();
}