import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client | null = null;
  private config: ClientConfig;

  constructor() {
    this.config = {
      host: 'localhost',
      user: 'postgres',
      password: 'prom15',
      database: 'simulation',
      port: 5432,
    };
  }

  async onModuleInit() {
    // Initialisation de la connexion si nécessaire
    await this.ensureConnection();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  private async ensureConnection() {
    if (!this.client || this.client.connection.stream.readableEnded) {
      this.client = new Client(this.config);
      await this.client.connect();
    }
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    await this.ensureConnection();

    try {
      const { rows } = await this.client.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async closeConnection() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  async withConnection<T>(callback: (client: Client) => Promise<T>): Promise<T> {
    await this.ensureConnection();

    try {
      return await callback(this.client);
    } finally {
      await this.closeConnection();
    }
  }
}
