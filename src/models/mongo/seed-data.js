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
      title: "Music Venue",
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
    concerthall: {
      title: "Concert Hall",
      description: "A concert hall is a cultural building with a stage that serves as a performance venue and an auditorium filled with seats.",
    },
  },

  POI: {
    _model: "POI",
    jahnstadion: {
      title: "Jahnstadion Regensburg",
      description: "Homepage: https://www.jahnstadion-regensburg.de/",
      latitude: 48.99097490003941,
      longitude: 12.107298727065935,
      categories: ["->categories.sportsstadium"],
      creator: "->users.jim",
    },
    elbphilharmonie: {
      title: "Elbphilharmonie",
      description:
        "The Elbphilharmonie is a concert hall in the HafenCity quarter of Hamburg, Germany, on the Grasbrook peninsula of the Elbe River. It is among the largest in the world.",
      latitude: 53.54134403100801,
      longitude: 9.984130782758227,
      categories: ["->categories.concerthall", "->categories.musicvenue"],
      creator: "->users.michael",
    },
  },
};
