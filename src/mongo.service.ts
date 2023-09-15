import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoDBService {

  private readonly uri = process.env.MONGODB_URI || 'mongodb+srv://mongo:mongo@cluster0.ebwjwaa.mongodb.net/?retryWrites=true&w=majority';
  private readonly client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.uri);
    this.client.connect();
  }

  async addUserSubscription(userId: string, state: string): Promise<void> {
    const collection = this.client.db('Cloudy_Bot').collection('subscriptions');
    await collection.updateOne({
      userId: userId 
    }, {
      $set: {
        userId: userId,
        state: state
      }
    }, { 
      upsert: true 
    });
  }

  async getUserSubscription(userId: string): Promise<string | null> {
    const collection = this.client.db('Cloudy_Bot').collection('subscriptions');
    const result = await collection.findOne({ userId });
    return result ? result.state : null;
  }

  async deleteUserSubscription(userId: string){
    const collection = this.client.db('Cloudy_Bot').collection('subscriptions');
    await collection.deleteOne({
      userId: userId
    });
  }
  
}
