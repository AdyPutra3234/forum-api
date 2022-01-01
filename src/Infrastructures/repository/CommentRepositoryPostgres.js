const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepositorty = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepositorty {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ newComment, threadId, owner }) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, false, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId, threadId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    await this._pool.query(query);
  }

  async checkAvailableCommentId(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');

    const { owner: commentOwner } = result.rows[0];

    if (owner !== commentOwner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = CommentRepositoryPostgres;
