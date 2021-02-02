const { writeFile } = require("fs").promises;
const { randomBytes } = require("crypto");
const Ceramic = require("@ceramicnetwork/http-client").default;
const { createDefinition, publishSchema } = require("@ceramicstudio/idx-tools");
const { Ed25519Provider } = require("key-did-provider-ed25519");
const fromString = require("uint8arrays/from-string");

const CERAMIC_URL = "http://ceramic.signchain.xyz:7007";

const Profile = {
  doctype: "tile",
  content: {
    type: "object",
    title: "Signchain Profile",
    $schema: "http://json-schema.org/draft-07/schema#",
    properties: {
      name: {
        type: "string",
        title: "name",
        maxLength: 150,
      },
      email: {
        type: "string",
        title: "email",
        maxLength: 150,
      },
      notary: {
        type: "boolean",
        title: "notary",
        maxLength: 150,
      },
      joindate: {
        type: "string",
        title: "joindate",
        maxLength: 150,
      },
      userAddress: {
        type: "string",
        title: "userAddress",
        maxLength: 150,
      }
    },
  },
};

// const Todo = {
//     doctype: 'object',
//     title: 'Todo Schema',
//     $schema: 'http://json-schema.org/draft-07/schema#',
//     properties: {
//       documents: {
//         type: 'array',
//         title: 'todos',
//       },
//     },
//   };

async function run() {
  // The seed must be provided as an environment variable
  const seed = new Uint8Array([
    215, 180,  59, 150, 212,  97,  41, 111,
     59,  43, 204, 161, 198, 141, 142,  44,
    116,  61, 191,  43, 169,  10,  70, 196,
     89,  64, 124, 199, 152, 207,  56,  65
  ]);
  console.log("Created seed", seed);
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL);
  // Authenticate the Ceramic instance with the provider

  await ceramic.setDIDProvider(new Ed25519Provider(seed));

  // Publish the two schemas
  const [profileSchema] = await Promise.all([publishSchema(ceramic, { content: Profile })]);

  console.log("Profile Schema", profileSchema);

  // Create the definition using the created schema ID
  const profileDefinition = await createDefinition(ceramic, {
    name: "profile",
    description: "Profile Schema",
    schema: profileSchema.commitId.toUrl(),
  });

  const res = await ceramic.pin.add(profileDefinition.id.toString());
  console.log(res)
  // Write config to JSON file
  const config = {
    definitions: {
      profile: profileDefinition.id.toString(),
    },
    schemas: {
      profile: profileSchema.commitId.toUrl(),
    },
  };
  await writeFile("./config.json", JSON.stringify(config));

  console.log("Config written to src/config.json file:", config);
  process.exit(0);
}

run().catch(console.error);
