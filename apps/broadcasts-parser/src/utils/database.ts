import pg from 'pg'
import type { Pool, PoolClient, QueryResult, QueryResultRow } from "pg"
import { Url } from '../entities/fixtrures-live.js';
import { CustomChannels } from '../entities/channels.js';
import { LiveEvents } from '../entities2/event.js';

type exist = {
    matchId: number;
    urls: Url[];
}


class DatabaseManager 
{
    private pool : Pool;
    private connection : PoolClient | undefined;

    constructor() 
    {
        const { Pool } = pg
        this.pool = new Pool
        ({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            port: parseInt(process.env.DATABASE_PORT || "5432", 10),
            ssl: { rejectUnauthorized: false }
        });
        console.log({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            port: parseInt(process.env.DATABASE_PORT || "5432", 10),
            ssl: { rejectUnauthorized: false }
        })
    }

async addChannels(channels: CustomChannels[]) {
    const client = await this.getConnection();
    try {
        await client.query('BEGIN'); // Початок транзакції

        // Запрос на вставку/обновление записей
        const query = `
        INSERT INTO "broadcasts" ("id", "channelLink", "channelName")
        VALUES ($1, $2, $3)
        ON CONFLICT ("id") 
        DO UPDATE SET
            "channelLink" = EXCLUDED."channelLink",
            "channelName" = EXCLUDED."channelName"
        `;

        // Вставка або оновлення кожного запису
        for (const live of channels) {
            await client.query(query, [live.id, live.channelLink, live.channelName]);
        }

        await client.query('COMMIT'); // Завершення транзакції
    } catch (error) {
        await client.query('ROLLBACK'); //
        console.error('Error updating channel data:', error); 
        throw error; // Пробросити помилку для подальшої обробки
    }
}


    async addLive(lives: exist[]): Promise<void> {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN'); // Початок транзакції
    
            // Запит на оновлення записів
            const query = `
            UPDATE "live-events"
            SET "liveStream" = $2
            WHERE "matchId" = $1
            `;
    
            // Оновлення кожного запису
            for (const live of lives) {
                await client.query(query, [live.matchId, JSON.stringify(live.urls)]);
            }
    
            await client.query('COMMIT'); // Завершення транзакції
        } catch (error) {
            await client.query('ROLLBACK'); // Откат транзакції при помилці
            console.error('Error updating live data:', error);
            throw error; // Пробросити помилку для подальшої обробки
        }
    }
    

    async addEvents(matches: LiveEvents[]): Promise<void> 
    {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN'); // Начало транзакции
 
            // Создание запроса на вставку данных
            const query = `
            INSERT INTO "live-events" (
                "matchId", "firstName", "firstLogo", "secondName", "secondLogo", "startAt", "sportId", "leagueId", "leagueName", "eventName" 
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT ("matchId") DO NOTHING
            `;

            // Выполнение вставки для каждого матча
            for (const match of matches) {
                await client.query(query, [
                    match.matchId,
                    match.firstName,
                    match.firstLogo,
                    match.secondName,
                    match.secondLogo,
                    match.startAt,
                    match.sportId,
                    match.leagueId,
                    match.leagueName,
                    match.name
                ]);
            }

            await client.query('COMMIT'); // Завершение транзакции
        } catch (error) {
            await client.query('ROLLBACK'); // Откат транзакции при ошибке
            console.error('Error adding matches:', error);
        }
    }

    async getAllSportsId() : Promise<{id: number}[]>
    {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN'); // Начало транзакции
            
            const query = `SELECT "id" FROM "sports"`;
    
            const result = await client.query(query);
            await client.query('COMMIT'); // Завершение транзакции
    
            return result.rows; // Возвращаем результат запроса
        } catch (error) {
            await client.query('ROLLBACK'); // Откат транзакции при ошибке
            console.error('Error retrieving matches:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

    async getCheckEvents(): Promise<LiveEvents[]> 
    {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN'); // Начало транзакции
            
            const query = `SELECT * FROM "live-events" WHERE "startAt" < $1`;
    
            const result = await client.query(query, [Math.floor(Date.now() / 1000)]);
            await client.query('COMMIT'); // Завершение транзакции
    
            return result.rows; // Возвращаем результат запроса
        } catch (error) {
            await client.query('ROLLBACK'); // Откат транзакции при ошибке
            console.error('Error retrieving matches:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }
    

    async deleteOldEvents(): Promise<void> 
    {
        const client = await this.getConnection();
        try {
            await client.query('BEGIN');

            const query = `
            DELETE FROM "live-events"
            WHERE TO_TIMESTAMP("startAt") < NOW() - INTERVAL '4 HOURS'
            `;

            await client.query(query);
            await client.query('COMMIT'); // Завершение транзакции
        } catch (error) {
            await client.query('ROLLBACK'); // Откат транзакции при ошибке
            console.error('Error deleting old matches:', error);
        }
    }

    async deleteOld(id: number): Promise<void> {
        const client = await this.getConnection();
        try {
            // Start a transaction
            await client.query('BEGIN');
    
            // Perform the delete operation
            const query = `
                DELETE FROM "live-events"
                WHERE TO_TIMESTAMP("startAt") < NOW() - INTERVAL '10 MINUTES'
                  AND "matchId" = $1
            `;
            await client.query(query, [id]);
    
            // Commit the transaction
            await client.query('COMMIT');
        } catch (error) {
            // Rollback the transaction on error
            await client.query('ROLLBACK');
            console.error('Error deleting old matches:', error);
            throw error; // Re-throw the error if needed for further handling
        }
    }
    
    
    private async getConnection(): Promise<PoolClient> 
    {
        if (this.connection === undefined) 
        {
            this.connection = await this.pool.connect();
            console.warn("Connected to DATABASE")
        }
        return this.connection;
    }

    async closeConnection(): Promise<void> 
    {
        try 
        {
            if (this.connection)
            {
                // Remove listeners before releasing the connection
                this.connection.removeAllListeners();
                this.connection.release();
            }
            await this.pool.end();
            console.log('Database connection closed');
        } 
        catch (error) 
        {
            console.error('Error closing database connection:', error);
        }
    }
}

export default DatabaseManager;