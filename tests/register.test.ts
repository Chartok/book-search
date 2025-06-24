import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../server/models/User.ts';

test('successful user registration', async () => {
	const mongo = await MongoMemoryServer.create();
	await mongoose.connect(mongo.getUri());

	const userData = {
		username: 'testuser',
		email: 'test@example.com',
		password: 'Password1!',
	};

	const user = await User.create(userData);

	assert.ok(user._id);
	assert.equal(user.username, userData.username);
	assert.equal(user.email, userData.email);
	assert.notEqual(user.password, userData.password);
	assert.equal(await user.isCorrectPassword(userData.password), true);

	await mongoose.disconnect();
	await mongo.stop();
});
