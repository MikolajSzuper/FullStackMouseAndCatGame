db = db.getSiblingDB('cat_and_mouse');

const users = [
  {
    username: "Jan",
    password: "$2b$10$DzVgisk9zibrZYTqdULFleS0wfpwgpPKl7MSwFrj/9uW/VQJucCrO", // bcrypt hash
    email: "alice@example.com",
    stats: { games: 20, wins: 17, losses: 3 },
    createdAt: new Date()
  },
  {
    username: "Robert",
    password: "$2b$10$DzVgisk9zibrZYTqdULFleS0wfpwgpPKl7MSwFrj/9uW/VQJucCrO", // bcrypt hash
    email: "bob@example.com",
    stats: { games: 37, wins: 32, losses: 5 },
    createdAt: new Date()
  }
];

const realNames = [
  { username: "Janek", email: "john.doe@example.com" },
  { username: "Zosia", email: "emma.watson@example.com" },
  { username: "Olek", email: "oliver.smith@example.com" },
  { username: "Amelka", email: "amelia.jones@example.com" },
  { username: "Jasiek", email: "liam.brown@example.com" },
  { username: "Sylwia", email: "sophia.davis@example.com" },
  { username: "Norbert", email: "noah.miller@example.com" },
  { username: "Anka", email: "ava.wilson@example.com" },
  { username: "Eliasz", email: "elijah.moore@example.com" },
  { username: "Miśka", email: "mia.taylor@example.com" },
  { username: "Lukasz", email: "lucas.anderson@example.com" },
  { username: "Eliza", email: "isabella.thomas@example.com" },
  { username: "Maciek", email: "mason.jackson@example.com" },
  { username: "Karolina", email: "charlotte.white@example.com" },
  { username: "Leszek", email: "logan.harris@example.com" },
  { username: "Hania", email: "harper.martin@example.com" },
  { username: "Jakub", email: "james.thompson@example.com" },
  { username: "Ela", email: "ella.garcia@example.com" },
  { username: "Bartek", email: "benjamin.martinez@example.com" },
  { username: "Gracja", email: "grace.robinson@example.com" },
  { username: "Jacek", email: "jack.clark@example.com" },
  { username: "Klara", email: "chloe.rodriguez@example.com" },
  { username: "Henio", email: "henry.lewis@example.com" },
  { username: "Lilka", email: "lily.lee@example.com" },
  { username: "Alek", email: "alex.walker@example.com" }
];


realNames.forEach(person => {
  users.push({
    username: person.username,
    password: "$2b$10$DzVgisk9zibrZYTqdULFleS0wfpwgpPKl7MSwFrj/9uW/VQJucCrO", // bcrypt hash
    email: person.email,
    stats: {
      games: Math.floor(Math.random() * 30) + 1,
      wins: Math.floor(Math.random() * 15),
      losses: Math.floor(Math.random() * 15)
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
  });
});

db.users.insertMany(users);