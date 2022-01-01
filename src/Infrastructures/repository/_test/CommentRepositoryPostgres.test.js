const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const Comment = require('../../../Domains/comments/entities/Comment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHeleper = require('../../../../tests/ThreadsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

  describe('delete comment function', () => {
    it('should persist delete comment action correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment('comment-123', 'thread-123');

      expect(await CommentTableTestHelper.isDeleted('comment-123')).toEqual(true);
    });
  });

  describe('checkAvailableCommentId function', () => {
    it('should not throw error when commentId is founded', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.checkAvailableCommentId('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw error when commentId not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.checkAvailableCommentId('comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should verify the comment owner correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError();
    });

    it('should throw error when the comment is not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHeleper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'fake-user')).rejects.toThrowError(AuthorizationError);
    });

    it('should throw error when commentId not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-???', 'fake-user')).rejects.toThrowError(NotFoundError);
    });
  });
});
