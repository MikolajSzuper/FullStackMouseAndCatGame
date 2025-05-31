db = db.getSiblingDB('cat_and_mouse');

const users = [
  {
    username: "alice",
    password: "$2a$10$7Qw3Qw3Qw3Qw3Qw3Qw3QwOQw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Q", // bcrypt hash
    email: "alice@example.com",
    stats: { games: 10, wins: 7, losses: 3 },
    createdAt: new Date()
  },
  {
    username: "bob",
    password: "$2a$10$7Qw3Qw3Qw3Qw3Qw3Qw3QwOQw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Q", // bcrypt hash
    email: "bob@example.com",
    stats: { games: 8, wins: 3, losses: 5 },
    createdAt: new Date()
  }
];

// 25 użytkowników z realnymi nazwami
const realNames = [
  { username: "john", email: "john.doe@example.com" },
  { username: "emma", email: "emma.watson@example.com" },
  { username: "oliver", email: "oliver.smith@example.com" },
  { username: "amelia", email: "amelia.jones@example.com" },
  { username: "liam", email: "liam.brown@example.com" },
  { username: "sophia", email: "sophia.davis@example.com" },
  { username: "noah", email: "noah.miller@example.com" },
  { username: "ava", email: "ava.wilson@example.com" },
  { username: "elijah", email: "elijah.moore@example.com" },
  { username: "mia", email: "mia.taylor@example.com" },
  { username: "lucas", email: "lucas.anderson@example.com" },
  { username: "isabella", email: "isabella.thomas@example.com" },
  { username: "mason", email: "mason.jackson@example.com" },
  { username: "charlotte", email: "charlotte.white@example.com" },
  { username: "logan", email: "logan.harris@example.com" },
  { username: "harper", email: "harper.martin@example.com" },
  { username: "james", email: "james.thompson@example.com" },
  { username: "ella", email: "ella.garcia@example.com" },
  { username: "benjamin", email: "benjamin.martinez@example.com" },
  { username: "grace", email: "grace.robinson@example.com" },
  { username: "jack", email: "jack.clark@example.com" },
  { username: "chloe", email: "chloe.rodriguez@example.com" },
  { username: "henry", email: "henry.lewis@example.com" },
  { username: "lily", email: "lily.lee@example.com" },
  { username: "alex", email: "alex.walker@example.com" }
];

realNames.forEach(person => {
  users.push({
    username: person.username,
    password: "$2a$10$7Qw3Qw3Qw3Qw3Qw3Qw3QwOQw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Qw3Q", // bcrypt hash
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