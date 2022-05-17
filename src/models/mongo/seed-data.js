export const seedData = {
  users: {
    _model: "User",
    michael: {
      firstname: "Michael",
      lastname: "Scott",
      username: "mscott13",
      email: "michael@the-office.com",
      password: "secret",
    },
    dwight: {
      firstname: "Dwight",
      lastname: "Schrute",
      username: "schrutedw123",
      email: "dwight@the-office.com",
      password: "secret",
    },
    jim: {
      firstname: "Jim",
      lastname: "Halpert",
      username: "jim123",
      email: "jim@the-office.com",
      password: "secret",
    },
  },
  categories: {
    _model: "POICategory",
    musicvenue: {
      title: "Music Venues",
      description: "Location used for a concert or musical performance",
    },
    sportsstadium: {
      title: "Sports Stadium",
      description: "Location used for major sporting events",
    },
    arena: {
      title: "Arena",
      description: "Location used for theatre, musical performances or sporting events",
    },
  },

  POI: {
    _model: "POI",
    jahnstadion: {
      title: "Jahnstadion Regensburg",
      description: "Soccer stadium for ",
      latitude: 48.99097490003941,
      longitude: 12.107298727065935,
      categories: ["->categories.sportsstadium"],
      creatorid: "->users.jim",
    },
  },
};
