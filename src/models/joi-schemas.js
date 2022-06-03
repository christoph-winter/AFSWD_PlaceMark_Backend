import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("Jim@the-office.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstname: Joi.string().example("Jim").required(),
  lastname: Joi.string().example("Halpert").required(),
  username: Joi.string().example("jim123").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const POISpec = Joi.object()
  .keys({
    title: Joi.string().required().example("A music venue"),
    description: Joi.string().optional().example("Its a very known music venue with a large stage and place for 3000 people."),
    latitude: Joi.number().min(-90).max(90).required().example(4.23423),
    longitude: Joi.number().min(-180).max(180).required().example(34.23423),
    categories: Joi.array().items(IdSpec).required(),
    creator: IdSpec,
  })
  .label("POI");

export const POISpecPlus = POISpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("POIPlus");

export const POIArray = Joi.array().items(POISpecPlus).label("POIArray");

export const POICategorySpec = Joi.object().keys({
  title: Joi.string().required().example("Sports Stadium"),
  description: Joi.string().optional().example("Location used for major sporting events"),
});
export const POICategorySpecPlus = POICategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("POICategoryPlus");

export const POICategoryArray = Joi.array().items(POICategorySpecPlus).label("POIArray");
