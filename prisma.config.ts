// @ts-expect-error -- "prisma/config" ships no type declarations for its "skills" option
import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
