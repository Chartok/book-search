import { MongoDataSource } from 'apollo-datasource-mongodb';
import type { IUser } from '../models/User';
import type { Model } from 'mongoose';

export class UserDataSource extends MongoDataSource<IUser> {
	constructor({ model }: { model: Model<IUser> }) {
		super({ modelOrCollection: model });
	}

	async getUserById(id: string) {
		return await this.findOneById(id);
	}
	async getUserByEmail(email: string) {
		return await this.findOneByFields({ email });
	}
	async getUserByUsername(username: string) {
		return await this.findByFields({ username });
	}
	async me(userId: string) {
		return await this.findOneById(userId);
	}
}
