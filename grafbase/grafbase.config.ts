import { g, auth, config } from "@grafbase/sdk";
//@ts-ignore
const User = g
  .model("User", {
    name: g.string().length({ min: 2, max: 20 }),

    email: g.email().unique(),

    avatarUrl: g.url(),

    description: g.string().length({ min: 2, max: 100 }).optional(),

    githubUrl: g.string().optional(),

    linkedInUrl: g.url().optional(),

    //@ts-ignore
    projects: g
      .relation(() => Project)
      .list()
      .optional(),

    // Extend models with resolvers
    // https://grafbase.com/docs/edge-gateway/resolvers
    // gravatar: g.url().resolver('user/gravatar')
  })
  .auth((rules) => {
    rules.public().read();
  });

//@ts-ignore
const Project = g
  .model("Project", {
    title: g.string().length({ min: 3 }),
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    category: g.string().search(),
    createdBy: g.relation(() => User),
  })
  .auth((rules) => {
    rules.public().read();
    rules.private().create().delete().update();
  });

const jwt = auth.JWT({
  issuer: "grafbase",
  secret: g.env("NEXTAUTH_SECRET"),
});

export default config({
  schema: g,
  // Integrate Auth
  // https://grafbase.com/docs/auth
  auth: {
    providers: [jwt],
    rules: (rules) => {
      rules.private();
    },
  },
});
