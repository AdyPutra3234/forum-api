class Comment {
  constructor(payload) {
    this._validatePayload(payload);

    this.content = payload.content;
  }

  _validatePayload({ content }) {
    if (!content) throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    if (typeof content !== 'string') throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}

module.exports = Comment;
