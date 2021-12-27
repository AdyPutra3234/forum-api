const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('PosthreadUseCase', () => {
  it('should orchestrating the post thread action correctly', async () => {
    const useCasePayload = {
      title: 'just title',
      body: 'new content',
    };

    const expectedThread = new AddedThread({
      id: 'thread_123',
      title: 'just title',
      owner: 'userA',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await getThreadUseCase.execute(useCasePayload, 'userA');

    expect(addedThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), 'userA');
  });
});
