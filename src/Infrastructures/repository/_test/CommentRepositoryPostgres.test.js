const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const Comment = require('../../../Domains/comments/entities/Comment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHeleper = require('../../../../tests/ThreadsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHeleper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist post comment and return addedComment correctly', async () => {
      const newComment = new Comment({
        content: 'just comment',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'userA' });
      await ThreadsTableTestHeleper.addThread({ owner: 'userA', id: 'thread-321' });

      await commentRepositoryPostgres.addComment({ newComment, threadId: 'thread-321', owner: 'userA' });

      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return addedComment object correctly', async () => {
      const comment = new Comment({
        content: 'just comment',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ owner: 'user-123', id: 'thread-321' });

      const addedComment = await commentRepositoryPostgres.addComment({ newComment: comment, threadId: 'thread-321', owner: 'user-123' });

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'just comment',
        owner: 'user-123',
      }));
    });
  });
});
