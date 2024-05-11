import { seed } from "../db/seed";

const seedCommand = () => {
  console.log("seeding 🎲");
  seed()
    .then(() => console.log("done ⚡"))
    .catch(console.log);
};

seedCommand();
