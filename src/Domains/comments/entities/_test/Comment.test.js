const Comment = require('../Comment');

describe('Comment entities', () => {
  it('shoudl throw error when payload did not contain needed property', () => {
    expect(() => new Comment({})).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment({ comment: 'test' })).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment({ body: 'test' })).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new Comment({ content: ['just comment'] })).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment({ content: true })).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      content: 'just comment',
    };

    const { content } = new Comment(payload);

    expect(content).toEqual(payload.content);
  });
});
