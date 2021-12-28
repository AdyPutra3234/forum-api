// istanbul ignore file

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({ id = 'comment-123', content = 'just comment', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3)',
      values: [id, content, owner],
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

  async cleanTable() {
    await pool.query('DELETE FROM comments where 1=1');
  },
};

module.exports = CommentTableTestHelper;