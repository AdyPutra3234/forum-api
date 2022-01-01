class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, commentId, credential }) {
    await this._commentRepository.checkAvailableCommentId(commentId, threadId);
    await this._commentRepository.verifyCommentOwner(commentId, credential);
    await this._commentRepository.deleteComment(commentId, threadId);
  }
}

module.exports = DeleteCommentUseCase;
