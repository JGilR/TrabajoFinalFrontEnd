import { Database } from "https://deno.land/x/mongo@v0.22.0/src/database.ts";
import { Collection } from "https://deno.land/x/mongo@v0.22.0/src/collection/collection.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import {CardSchema, HeroSchema, IContext} from "../Mongo/schema.ts"

interface OutHeroes{
    name: string,
    description: string,
    class: string,
    heroPower: string
}

interface OutCards{
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



const Query = {
    seeAllCards: async (parent: any, args: {}, ctx: IContext): Promise<OutCards[]> => {
        try{
            const db: Database = ctx.db;
            const CardsCollection = db.collection<CardSchema>("AllCards");
            const cards = await CardsCollection.find({}, {noCursorTimeout: false} as any);
            const cardsArray = cards.map((elem: OutCards) => {
                return {
                    ...elem,
                }
            })
            return cardsArray;
        }catch(e){
            throw new GQLError(e)
        }
    },

    seeAllHeroes: async(parents: any, args: {}, ctx: IContext): Promise<OutHeroes[]> => {
        try{
            const db: Database = ctx.db;
            const HeroesCollection = db.collection<HeroSchema>("AllHeroes")
            const heroes = await HeroesCollection.find({}, {noCursorTimeout: false} as any);
            const heroesArray = heroes.map((elem: OutHeroes) => {
                return {
                    ...elem,
                }
            })
            return heroesArray;
        }catch(e){
            throw new GQLError(e)
        }
    },

    search: async(parents: any, args: {by: {name: string | undefined, class: string | undefined, cost: number | undefined}}, ctx: IContext): Promise<OutCards[]> => {
        try{
            const db: Database = ctx.db;
            const CardCollection = db.collection<CardSchema>("AllCards");
            let cardArray;
            if(args.by.name !== undefined){
                const cards = await CardCollection.find({name: {$regex: `/${args.by.name}/`}})
                cardArray = cards.map((elem) => {
                    return {
                        ...elem
                    }
                })
            }else if(args.by.cost !== undefined){
                const cards = await CardCollection.find({class: {$regex: `/${args.by.cost}`}})
                cardArray = cards.map((elem) => {
                    return {
                        ...elem
                    }
                })
            }else if(args.by.class !== undefined){
                const cards = await CardCollection.find({class: {$regex: `/${args.by.class}`}})
                cardArray = cards.map((elem) => {
                    return {
                        ...elem
                    }
                })
            }else{
                throw new GQLError("Algo ha salido mal")
            }
            return cardArray;
        }catch(e){
            throw new GQLError(e)
        }
    }
}

export default Query