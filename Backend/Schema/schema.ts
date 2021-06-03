import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql
    type Heroe{
        name: String!
        description: String!
        class: String!
        heroePower: String!
    }

    input InputHeroe{
        name: String!
        description: String!
        class: String!
        heroePower: String!
    }

    type Mechanics{
        name: String!
    }

    type Card{
        class: String!
        cost : Int!
        attack: Int!
        health: Int!
        text: String!
        elite: Boolean!
        mechanics: [Mechanics!]!
    }

    input InputMechanics{
        name: String!
    }

    input InputCard{
        class: String!
        cost: Int!
        attack: Int!
        health: Int!
        text: String!
        elite: Boolean!
        mechanics:[InputMechanics!]!
    }

    input SBInput{
        name: String
        class: String
        mana: Int
    }

    type Query{
        seeAllCards: [Card]!
        seeAllHeroes: [Heroe]!
        search(by: SBInput): [Card]!
    }

    type Mutation{
        addCard(input: InputCard!): Boolean!
        addHero(input: InputHeroe): Boolean!
    }



export default Schema