import {Application, Router, RouterContext} from "https://deno.land/x/oak@v7.5.0/mod.ts";
import "https://deno.land/x/dotenv@v2.0.0/load.ts";
import { MongoClient} from "https://deno.land/x/mongo@v0.23.1/mod.ts";
import {applyGraphQL, GQLError} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import Mutation from "./resolvers/Mutation.ts"
import Query from "./resolvers/Query.ts"
import Schema from "./Schema/schema.ts"

const resolvers = {
    Mutation,
    Query
}

try{
    const DB_URL = Deno.env.get("DB_URL");
    const DB_NAME = Deno.env.get("DB_NAME");
    const DB_HOST = Deno.env.get("DB_HOST");
    const DB_USER_NAME = Deno.env.get("DB_USER_NAME")
    const DB_USER_PASSWORD = Deno.env.get("DB_USER_PASSWORD")
    const DB_CONN_NAME = Deno.env.get("DB_CONN_NAME")

    if(!DB_URL || !DB_NAME || DB_HOST || DB_USER_NAME || DB_USER_PASSWORD){
        throw Error("Please define DB_URL and DB_NAME on a .env file");
    }
    const client = new MongoClient();
    await client.connect({
        db: DB_CONN_NAME!,
        tls: true,
        servers: [
            {
                host: DB_HOST!,
                port: 27017
            },
        ],
        credential: {
            username: DB_USER_NAME!,
            password: DB_USER_PASSWORD!,
            db: DB_CONN_NAME!,
            mechanism: "SCRAM-SHA-1",
        },
    });
    const db = client.database(DB_NAME);

    const app = new Application();

    const GraphQLService = await applyGraphQL<Router>({
        Router,
        path: "/graphql",
        typeDefs: Schema,
        resolvers,
        context: (ctx: RouterContext) => {
            return{
                ctx,
                db
            }
        }
    })

    app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

    const port = Deno.env.get("PORT") || "3000";
    console.log(`Server start at http://localhost:${port}`);
    await app.listen({port: parseInt(port)});

}catch(e){
    console.log(e);
}