const CommentRepositorty = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('PostCommentUseCase', () => {
  it('should orchestrating the post comment action correctly', async () => {
    const useCasePayload = {
      content: 'new Comment',
    };

    const expectedComment = new AddedComment({
      id: 'comment-123',
      content: 'new Comment',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepositorty();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));
    mockThreadRepository.verifyThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute({ payload: useCasePayload, threadId: 'thread-123', owner: 'user-123' });

    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith({
      newComment: new Comment({
        content: useCasePayload.content,
      }),
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });
});
