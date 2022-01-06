const CommentRepositorty = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockCommentRepository = new CommentRepositorty();

    mockCommentRepository.checkAvailableCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute({
      commentId: 'comment-123',
      credential: 'testCredentialId',
      threadId: 'thread-123',
    });

    expect(mockCommentRepository.checkAvailableCommentId).toHaveBeenLastCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenLastCalledWith('comment-123', 'testCredentialId');
    expect(mockCommentRepository.deleteComment).toHaveBeenLastCalledWith('comment-123', 'thread-123');
  });
});
