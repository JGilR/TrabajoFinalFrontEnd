import { Database } from "https://deno.land/x/mongo@v0.22.0/src/database.ts";

export interface HeroSchema{
    _id :        {$oid: string}
    name:        string
    description: string
    class:       string
    heroPower:   string
}

export interface CardSchema{
    _id:       {$oid: string}
    class:     string
    cost:      number
    attack:    number
    health:    number
    text:      string
    elite:     boolean
    mechanics: [{name: string}]
}

export interface IContext{
    db: Database
}