import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    const config: ClientConfig = {
      host: 'localhost',
      user: 'postgres',
      password: 'prom15',
      database: 'simulation',
      port: 5432,
    };

    this.client = new Client(config);

    try {
      await this.client.connect();
    } catch (error) {
      console.error('Erreur de connexion :', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
    } else {
      console.log('Fermeture de la connexion impossible, client inexistant');
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Base non initialiser');
    }
    return this.client;
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    const client = this.getClient();

    try {
      const { rows } = await client.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
