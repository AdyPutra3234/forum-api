const ThreadsRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHeleper = require('../../../../tests/ThreadsTableTestHelper');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHeleper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist post thread and return addedThread correctly', async () => {
      const NewThread = new Thread({
        title: 'just testing',
        body: 'new Thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'userA' });

      await threadRepositoryPostgres.addThread(NewThread, 'userA');

      const thread = await ThreadsTableTestHeleper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return addedThread correctly', async () => {
      const thread = new Thread({
        title: 'justTesting',
        body: 'new Thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user_testing' });

      const addedThread = await threadRepositoryPostgres.addThread(thread, 'user_testing');

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'justTesting',
        owner: 'user_testing',
      }));
    });
  });

  describe('VerifyThread function', () => {
    it('should persist verify thread action correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ id: 'thread-123', owner: 'user-123' });

      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).resolves.not.toThrowError();
    });

    it('should throw error when thread not found in database', async () => {
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).rejects.toThrowError();
    });
  });
});
