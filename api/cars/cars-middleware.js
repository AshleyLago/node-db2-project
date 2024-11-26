const Car = require('./cars-model')
var vinValidator = require('vin-validator');

const checkCarId = async (req, res, next) => {
  try {
    const car = await Car.getById(req.params.id)
    if (car) {
      req.car = car
      next()
    } else {
      next({ status: 404, message: `car with id ${car} is not found` })
    }
  } catch (err) {
    next(err)
  }
}

// requires: vin, make, model, mileage (int)
const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage} = req.body
  if (!vin) {
    next({ status:400, message: "vin is missing"})
  } else if (!make) {
    next({ status:400, message: "make is missing"})
  } else if (!model) {
    next({ status:400, message: "model is missing"})
  } else if (!mileage) {
    next({ status:400, message: "mileage is missing"})
  }
  next()
}

const checkVinNumberValid = (req, res, next) => {
  const {vin} = req.body
  if (vinValidator.validate(vin)) {
    next()
  } else {
    next({ status:400, message: `vin ${vin} is invalid` })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  const {vin} = req.body
  try {
    const exist = await Car.getByVin(vin)
    if(!exist) {
      next()
    } else {
      next({ status:400, message: `vin ${vin} already exists` })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}