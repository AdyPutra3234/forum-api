/* eslint-disable camelcase */
// istanbul ignore file

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'just comment', owner = 'user-123', threadId = 'thread-123', isDeleted = false, date = '2021-12-4',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, isDeleted, date],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async isDeleted(id) {
    const query = {
      text: 'SELECT is_deleted FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const { is_deleted } = result.rows[0];
    return is_deleted;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments where 1=1');
  },
};

module.exports = CommentTableTestHelper;
