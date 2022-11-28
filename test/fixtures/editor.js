const editor = {
  blocks: {
    getCurrentBlockIndex: () => 0,
    getRedactor: () => {
      const { body } = document;
      const mainContainer = body.children[0];
      const editorContainer = mainContainer.children[0];
      const redactor = editorContainer.children[0];
      return redactor;
    },
    getParagraph: () => {
      const ceBlock = document.createElement('div');
      ceBlock.classList.add('ce-block');

      const ceContent = document.createElement('div');
      ceContent.classList.add('ce-block__content');

      const ceParagraph = document.createElement('div');
      ceParagraph.classList.add('ce-paragraph', 'cdx-block');

      ceContent.appendChild(ceParagraph);
      ceBlock.appendChild(ceContent);

      return ceBlock;
    },
    getBlockByIndex: (index) => {
      const redactor = editor.blocks.getRedactor();
      const { children } = redactor;
      const child = children[index] || editor.blocks.getParagraph();
      return {
        id: `12${index}id`, type: 'paragraph', data: {}, holder: child,
      };
    },
    getBlocksCount: () => 4,
    move: (finalPosition, currentPosition) => () => {
      const redactor = editor.blocks.getRedactor();
      redactor.children[currentPosition].before(redactor.children[finalPosition]);
    },
    delete: (index) => {
      const redactor = editor.blocks.getRedactor();
      const currentBlock = redactor.children[index];
      currentBlock.remove();
    },
    insert: (block) => {
      const redactor = editor.blocks.getRedactor();
      redactor.appendChild(block);
    },
  },
  toolbar: {
    close: () => true,
  },
  caret: {
    setToBlock: (index) => index,
  },
};

export default editor;
