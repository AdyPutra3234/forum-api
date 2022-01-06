const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepositorty = require('../../../Domains/comments/CommentRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the GET detail thread action correctly', async () => {
    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'just testing',
      body: 'new thread',
      date: '2021-08-08',
      username: 'test-1',
      comments: [
        {
          id: 'comments-123',
          username: 'test-2',
          date: '2021-09-09',
          content: 'sebuah comment',
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepositorty();

    mockThreadRepository.findThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'just testing',
        body: 'new thread',
        date: '2021-08-08',
        username: 'test-1',
      }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comments-123',
          username: 'test-2',
          date: '2021-09-09',
          content: 'sebuah comment',
          is_deleted: false,
        },
      ]));

    const getDetailThread = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getDetailThread.execute('thread-123');

    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.findThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
  });

  it('should return content of comment correctly when comment has been deleted', async () => {
    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'just testing',
      body: 'new thread',
      date: '2021-08-08',
      username: 'test-1',
      comments: [
        {
          id: 'comments-123',
          username: 'test-2',
          date: '2021-09-09',
          content: '**komentar telah dihapus**',
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepositorty();

    mockThreadRepository.findThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'just testing',
        body: 'new thread',
        date: '2021-08-08',
        username: 'test-1',
      }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comments-123',
          username: 'test-2',
          date: '2021-09-09',
          content: 'sebuah comment',
          is_deleted: true,
        },
      ]));

    const getDetailThread = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getDetailThread.execute('thread-123');

    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.findThread).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
  });
});
