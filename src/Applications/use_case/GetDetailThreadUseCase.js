/* eslint-disable no-param-reassign */
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.findThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    comments.map((comment) => {
      if (comment.is_deleted) comment.content = '**komentar telah dihapus**';
      delete comment.is_deleted;
      return comment;
    });

    return new DetailThread({
      ...thread,
      comments,
    });
  }
}

module.exports = GetDetailThreadUseCase;
