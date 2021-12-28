const Comment = require('../../Domains/comments/entities/Comment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ payload, threadId, owner }) {
    const comment = new Comment(payload);
    await this._threadRepository.verifyThreadById(threadId);
    return this._commentRepository.addComment({ newComment: comment, threadId, owner });
  }
}

module.exports = AddCommentUseCase;
