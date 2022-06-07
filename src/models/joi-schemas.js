import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("Jim@the-office.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstname: Joi.string().required().example("Jim"),
  lastname: Joi.string().required().example("Halpert"),
  username: Joi.string().required().example("jim123"),
}).label("UserDetails");

export const UserSpecUpdate = UserCredentialsSpec.keys({
  password: Joi.string().example("secret").optional(),
  email: Joi.string().email().example("Jim@the-office.com").optional(),
  firstname: Joi.string().example("Jim").optional(),
  lastname: Joi.string().example("Halpert").optional(),
  username: Joi.string().example("jim123").optional(),
}).label("UserDetailsUpdate");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
})
  .unknown(true)
  .label("UserDetailsPlus");

export const UserArraySpec = Joi.array().items(UserSpecPlus).label("UserArray");

export const POISpec = Joi.object()
  .keys({
    title: Joi.string().required().example("A music venue"),
    description: Joi.string().allow("").optional().example("Its a very known music venue with a large stage and place for 3000 people."),
    latitude: Joi.number().min(-90).max(90).required().example(4.23423),
    longitude: Joi.number().min(-180).max(180).required().example(34.23423),
    categories: Joi.array().items(IdSpec).required(),
    creator: IdSpec.optional(),
  })
  .label("POIDetails");

export const POISpecUpdate = Joi.object()
  .keys({
    title: Joi.string().optional().example("A music venue"),
    description: Joi.string().allow("").optional().example("Its a very known music venue with a large stage and place for 3000 people."),
    latitude: Joi.number().min(-90).max(90).optional().example(4.23423),
    longitude: Joi.number().min(-180).max(180).optional().example(34.23423),
    categories: Joi.array().items(IdSpec).optional(),
    creator: IdSpec,
  })
  .label("POIUpdate");

export const POISpecPlus = POISpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
})
  .unknown(true)
  .label("POIPlus");

export const POIArraySpec = Joi.array().items(POISpecPlus).label("POIArray");

export const POICategorySpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Sports Stadium"),
    description: Joi.string().optional().example("Location used for major sporting events"),
  })
  .label("POICategory");
export const POICategorySpecUpdate = Joi.object()
  .keys({
    title: Joi.string().optional().example("Sports Stadium"),
    description: Joi.string().optional().example("Location used for major sporting events"),
  })
  .label("POICategoryUpdate");

export const POICategorySpecPlus = POICategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
})
  .unknown(true)
  .label("POICategoryPlus");

export const POICategoryArray = Joi.array().items(POICategorySpecPlus).label("POIArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
