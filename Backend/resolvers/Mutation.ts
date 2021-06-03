import { Database } from "https://deno.land/x/mongo@v0.22.0/src/database.ts";
import { Collection } from "https://deno.land/x/mongo@v0.22.0/src/collection/collection.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import {CardSchema, HeroSchema, IContext} from "../Mongo/schema.ts"

interface InHeroes{
    name: string,
    description: string,
    class: string,
    heroPower: string
}

interface InCards{
    class: string,
    cost: number,
    attack: number,
    health: number,
    text: string,
    elite: boolean,
    mechanics: Array<{
        name: string
    }>
}

const Mutation = {
    addCard: async(parent: any, args: {input: InCards}, ctx: IContext): Promise<boolean> => {
        try{
            
            const toFindAndToAdd = {
                class: args.input.class, 
                cost: args.input.cost, 
                attack: args.input.attack, 
                health: args.input.health, 
                text: args.input.text, 
                elite: args.input.elite, 
                mechanics: args.input.mechanics
            }
            
           console.log(args)
            const db: Database = ctx.db;
            const CardCollection: Collection<CardSchema> = db.collection<CardSchema>("AllCards");
            const cardExist = await CardCollection.findOne(toFindAndToAdd, {noCursorTimeout: false} as any)
            if(!cardExist){
                CardCollection.insertOne(toFindAndToAdd)
                return true
            }else{
                throw new GQLError("The card already exists")
            }
        }catch(e){
            console.log(args)
            throw new GQLError(e);
        }
    },

    addHero: async (parent: any, args: {input: InHeroes}, ctx: IContext): Promise<boolean> => {
        try{
            const toFindAndToAdd = {
                name:args.input.name,
                description: args.input.description,
                class: args.input.class,
                heroePower: args.input.heroPower  
            }
            const db: Database = ctx.db;
            const HeroCollection: Collection<HeroSchema> = db.collection<HeroSchema>("AllHeroes");
            const heroExist = await HeroCollection.findOne(toFindAndToAdd, {noCursorTimeout: false} as any)
            if(!heroExist){
                HeroCollection.insertOne(toFindAndToAdd, {noCursorTimeout: false} as any)
                return true
            }else{
                return false
            }
        }catch(e){
            throw new GQLError(e)
        }
    }
}

export default Mutation;