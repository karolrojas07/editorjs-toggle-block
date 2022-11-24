import './index.css';
import { v4 as uuidv4 } from 'uuid';
import toggleIcon from '../assets/toggleIcon.svg';

/**
 * ToggleBlock for the Editor.js
 * Creates a toggle and paragraphs can be saved in it.
 * Requires no server-side uploader.
 *
 * @typedef {object} ToggleBlockData
 * @description Tool's input and output data format
 * @property {string} text - toggle text
 * @property {string} status - toggle status
 * @property {array} items - toggle paragraphs
 */

export default class ToggleBlock {
  /**
   * Render tool's main Element and fill it with saved data
   *
   * @param {{data: object, api: object}}
   * data - Previously saved data
   * api - Editor.js API
   * readOnly - read-only mode status
   */
  constructor({
    data, api, readOnly, config,
  }) {
    this.data = {
      text: data.text || '',
      status: data.status || 'open',
      fk: data.fk || `fk-${uuidv4()}`,
      items: data.items || 0,
    };
    this.itemsId = [];
    this.api = api;
    const {
      toolbar: {
        close,
      },
      blocks: {
        getCurrentBlockIndex,
        getBlockByIndex,
        getBlocksCount,
        move,
      },
    } = this.api;
    this.close = close;
    this.getCurrentBlockIndex = getCurrentBlockIndex;
    this.getBlocksCount = getBlocksCount;
    this.getBlockByIndex = getBlockByIndex;
    this.move = move;
    this.wrapper = undefined;
    this.readOnly = readOnly || false;
    this.placeholder = config?.placeholder ?? 'Toggle';
    this.defaultContent = config?.defaultContent ?? 'Empty toggle. Click or drop blocks inside.';
    this.addListener();
    this.addSupportForUndoAndRedoActions();
    this.addSupportForDragAndDropActions();
  }

  // ------------------------- EditorJS methods ------------------------------------

  /**
   * Icon and title for displaying at the Toolbox
   * @returns {object} {tittle: string, icon: string}
   */
  static get toolbox() {
    return {
      title: 'Toggle',
      icon: toggleIcon,
    };
  }

  /**
   * Notify core to disable the creation of new EditorJS blocks by pressing 'enter'
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Notify core that the read-only mode is supported
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Create a Toggle block when it is selected from the ToolBox
   * @returns {HTMLDivElement}
   */
  render() {
    const index = this.getCurrentBlockIndex();
    const { holder } = this.getBlockByIndex(index);
    this.createToggle();
    setTimeout(() => {
      this.renderItems();
      this.setInitialIconTransition();
      if (this.isAToggleItem(holder)) { this.nestBlock(index); }
    });
    return this.wrapper;
  }

  /**
   * Extract the Toggle's data from the UI.
   * @param {HTMLDivElement} blockContent - Toggle tools rendered view
   * @returns {ToggleBlockData} - saved data
   */
  save(blockContent) {
    const { children } = blockContent;
    const caption = children[1].innerHTML;
    const blocks = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);

    return Object.assign(this.data, {
      text: caption,
      items: blocks.length,
    });
  }

  /**
   * Add events for the move up, move down and delete options in the toolbar
   */
  renderSettings() {
    const settingsBar = document.getElementsByClassName('ce-settings--opened');
    const optionsContainer = settingsBar[0];
    const options = optionsContainer.lastChild;
    const toggleIndex = this.api.blocks.getCurrentBlockIndex();

    this.highlightToggleItems(this.wrapper.id);

    setTimeout(() => {
      this.addEventsMoveButtons('ce-tune-move-down', 0, options, toggleIndex);
      this.addEventsMoveButtons('ce-tune-move-up', 1, options, toggleIndex);

      const deleteButton = options.getElementsByClassName('ce-settings__button--delete')[0];
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          const classesList = deleteButton.classList;
          const classes = Object.values(classesList);

          if (classes.indexOf('clicked-to-destroy-toggle') === -1) {
            deleteButton.classList.add('clicked-to-destroy-toggle');
          } else {
            this.removeFullToggle(toggleIndex);
          }
        });
      }
    });
  }

  // -------------------------------  Initializer methods ---------------------------------------

  /**
   * Capture space key event to create a Toggle root or the Tab key event to nest a block
   */
  addListener() {
    if (!this.readOnly) {
      const redactor = document.body.querySelector('.codex-editor__redactor');
      redactor.addEventListener('keyup', (e) => {
        const currentIndex = this.getCurrentBlockIndex();
        const { holder } = this.getBlockByIndex(currentIndex);

        if (e.code === 'Space' && !this.isAToggleRoot(holder)) {
          this.createToggleRootWithShortcut(currentIndex, holder);
        }
        if (e.code === 'Tab') { this.nestBlock(currentIndex); }
      });
    }
  }

  /**
   * Restore the item attributes when the undo action is executed.
   */
  addSupportForUndoAndRedoActions() {
    if (!this.readOnly) {
      const target = document.querySelector('div.codex-editor__redactor');

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            setTimeout(this.restoreItemAttributes.bind(this, mutation));
          }
        });
      });

      const config = { attributes: true, childList: true, characterData: true };

      observer.observe(target, config);
    }
  }

  /**
   * Drag and drop a whole toggle
   */
  addSupportForDragAndDropActions() {
    if (!this.readOnly) {
      if (this.wrapper === undefined) {
        setTimeout(() => this.addSupportForDragAndDropActions(), 250);
        return;
      }

      // Set status in attribute to a proper hide and show
      const toggleBlock = document.querySelector(`#${this.wrapper.id}`).parentNode.parentNode;
      toggleBlock.setAttribute('status', this.data.status);

      const settingsButton = document.querySelector('.ce-toolbar__settings-btn');
      settingsButton.setAttribute('draggable', 'true');
      settingsButton.addEventListener('dragstart', () => {
        this.startBlock = this.api.blocks.getCurrentBlockIndex();
        this.nameDragged = this.api.blocks.getBlockByIndex(this.startBlock).name;
        this.holderDragged = this.api.blocks.getBlockByIndex(this.startBlock).holder;
      });

      document.addEventListener('drop', (event) => {
        // Get the position when item was dropped
        const { target } = event;
        if (document.contains(target)) {
          const dropTarget = target.classList.contains('ce-block') ? target : target.closest('.ce-block');
          if (dropTarget && dropTarget !== this.holderDragged) {
            let endBlock = this.getIndex(dropTarget);

            // Control the toggle's children will be positioned down of the parent
            endBlock = this.startBlock < endBlock ? endBlock + 1 : endBlock;

            // Check if the item dropped is another toggle
            const isTargetAToggle = dropTarget.querySelectorAll('.toggle-block__selector').length > 0
              || dropTarget.getAttribute('foreignKey') !== null;

            setTimeout(() => {
              // Verify if the item droped is the toggle
              if (this.nameDragged === 'toggle') {
                // Verify if the toggle dropped is the same of this eventListener
                const currentToggleDropped = this.holderDragged.querySelector(`#${this.wrapper.id}`);

                if (currentToggleDropped) {
                  // Check if the toggle dropped was not droppen in its children
                  if (!this.isChild(currentToggleDropped.getAttribute('id'), dropTarget.getAttribute('foreignKey'))) {
                    // If is a toggle we have to add the attributes to make it a part of the toggle
                    if (isTargetAToggle) {
                      const foreignKey = dropTarget.getAttribute('foreignKey')
                        ?? dropTarget.querySelector('.toggle-block__selector').getAttribute('id');

                      const newToggleIndex = this.getIndex(this.holderDragged);
                      this.setAttributesToNewBlock(newToggleIndex, foreignKey);
                    }

                    this.moveChildren(endBlock);
                  } else {
                    // If we are dropping in the toggle children,
                    // we have to move the toggle in the original position
                    if (this.startBlock === endBlock) {
                      this.api.blocks.move(this.startBlock + 1, endBlock);
                    } else {
                      this.api.blocks.move(this.startBlock, endBlock);
                    }

                    // And remove the attributes
                    if (!isTargetAToggle) {
                      const newToggleIndex = this.getIndex(this.holderDragged);
                      this.removeAttributesFromNewBlock(newToggleIndex);
                    }
                  }
                }
              }

              // If we are dropping out of a toggle we have to remove the attributes
              if (!isTargetAToggle) {
                const newToggleIndex = this.getIndex(this.holderDragged);
                this.removeAttributesFromNewBlock(newToggleIndex);
              }
            });
          }
        }
      });
    }
  }

  // ----------------------- Creational methods ------------------------------------

  /**
   * Create a the Toggle Root block
   */
  createToggle() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('toggle-block__selector', 'cdx-block');
    this.wrapper.id = this.data.fk;

    const icon = document.createElement('span');
    const input = document.createElement('div');
    const defaultContent = document.createElement('div');

    icon.classList.add('toggle-block__icon');
    icon.innerHTML = toggleIcon;

    input.classList.add('toggle-block__input');
    input.setAttribute('contentEditable', !this.readOnly);
    input.innerHTML = this.data.text || '';

    // Events
    if (!this.readOnly) {
      // Events to create other blocks and destroy the toggle
      input.addEventListener('keyup', this.createParagraphFromToggleRoot.bind(this));
      input.addEventListener('keydown', this.removeToggle.bind(this));

      // Sets the focus at the end of the text when a nested block is deleted with the backspace key
      input.addEventListener('focusin', () => this.setFocusToggleRootAtTheEnd());

      // Establishes the placeholder for the toggle root when it's empty
      input.addEventListener('keyup', this.setPlaceHolder.bind(this));
      input.setAttribute('placeholder', this.placeholder);

      // Calculates the number of toggle items
      input.addEventListener('focus', this.setDefaultContent.bind(this));
      input.addEventListener('focusout', this.setDefaultContent.bind(this));

      // Event to add a block when the default content is clicked
      defaultContent.addEventListener('click', this.clickInDefaultContent.bind(this));
    }

    defaultContent.classList.add('toggle-block__content-default', 'toggle-block__hidden');
    defaultContent.innerHTML = this.defaultContent;

    this.wrapper.appendChild(icon);
    this.wrapper.appendChild(input);
    this.wrapper.appendChild(defaultContent);
  }

  /**
   * Create a toggle using the '>' char and the 'Space' key
   * @param {number} index - Block index where the toggle root will be created.
   * @param {HTMLDivElement} holder
   */
  createToggleRootWithShortcut(index, holder) {
    const content = holder.textContent;

    // Convert current paragraph block into a toggle root
    if ((content[0] === '>')) {
      this.api.blocks.insert('toggle', { text: content.substring(2) }, this.api, index, true);
      this.api.blocks.delete(index + 1);
      this.api.caret.setToBlock(index);
    }
  }

  /**
   * Create a Toggle's child when pressing "enter" into the Toggle root title
   * @param {KeyboardEvent} e - key up event
   */
  createParagraphFromToggleRoot(e) {
    if (e.code === 'Enter') {
      const currentPosition = document.getSelection().focusOffset;
      const originalIndex = this.api.blocks.getCurrentBlockIndex();
      const block = this.api.blocks.getBlockByIndex(originalIndex);
      const { holder } = block;
      const blockCover = holder.firstChild;
      const blockContent = blockCover.firstChild;
      const content = blockContent.children[1].innerHTML;

      const breakLine = content.indexOf('<br>');
      const end = breakLine === -1 ? content.length : breakLine;

      if (this.data.status === 'closed') {
        this.resolveToggleAction();
        this.hideAndShowBlocks();
      }

      const newText = content.slice(end + 4, currentPosition.focusOffset);
      blockContent.children[1].innerHTML = content.slice(currentPosition.focusOffset, end);

      this.api.blocks.insert('paragraph', { text: newText }, {}, originalIndex + 1, 1);
      this.setAttributesToNewBlock();
    }
  }

  // ------------------------------- Removal methods -----------------------------

  /**
   * Remove a toggle root and its nested blocks.
   *
   * @param {number} toggleIndex - toggle index
   */
  removeFullToggle(toggleIndex) {
    const children = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);
    const { length } = children;

    for (let i = toggleIndex; i < toggleIndex + length; i += 1) {
      this.api.blocks.delete(toggleIndex);
    }
  }

  /**
   * Deletes the toggle structure and converts the main text and the nested blocks
   * in regular blocks.
   *
   * @param {KeyboardEvent} e - key down event
   */
  removeToggle(e) {
    if (e.code === 'Backspace') {
      const { children } = this.wrapper;
      const content = children[1].innerHTML;

      const cursorPosition = document.getSelection();

      if (cursorPosition.focusOffset === 0) {
        const index = this.api.blocks.getCurrentBlockIndex();
        const breakLine = content.indexOf('<br>');
        const end = breakLine === -1 ? content.length : breakLine;
        const blocks = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);

        for (let i = 1; i < blocks.length + 1; i += 1) {
          this.removeAttributesFromNewBlock(index + i);
        }

        this.api.blocks.delete(index);
        this.api.blocks.insert('paragraph', { text: content.slice(0, end) }, {}, index, 1);
        this.api.caret.setToBlock(index);
      }
    }
  }

  /**
   * When a nested block is removed, the 'items' attribute
   * is updated, subtracting from it an unit.
   * @param {string} id - block identifier
   */
  removeBlock(holder, id, cursorPosition) {
    if (cursorPosition === 0) {
      const currentBlock = holder.nextSibling;
      const blockCover = currentBlock.firstChild;
      const blockContent = blockCover.firstChild;
      const oldContent = blockContent.innerHTML;

      const toggleCover = holder.firstChild;
      const toggleContent = toggleCover.firstChild;

      toggleContent.children[1].innerHTML += oldContent;

      const position = this.itemsId.indexOf(id);
      this.itemsId.splice(position, 1);

      const togglePosition = this.api.blocks.getCurrentBlockIndex();
      this.api.blocks.delete(togglePosition + 1);
    }
  }

  /**
   * Removes all properties of a nested block.
   *
   * @param {number} destiny - block position
   */
  removeAttributesFromNewBlock(destiny) {
    const newBlock = this.api.blocks.getBlockByIndex(destiny);
    const { holder } = newBlock;

    if (!this.itemsId.includes(newBlock.id)) {
      const i = this.itemsId.indexOf(newBlock.id);
      this.itemsId.splice(i, 1);
    }

    holder.removeAttribute('foreignKey');
    holder.removeAttribute('id');
    holder.onkeydown = {};
    holder.onkeyup = {};
    holder.classList.remove('toggle-block__item');
  }

  // --------------------------------  Setter methods -----------------------------

  /**
   * Capture events on children blocks:
   * * Enter       = To create a new Toggle child
   * * Shift + Tab = To extract the block form the Toggle
   * * Backspace   = To delete the child block
   * @param {KeyboardEvent} e - key down event
   */
  setEventsToNestedBlock(e) {
    const index = this.getCurrentBlockIndex();
    const block = this.getBlockByIndex(index);

    if (e.code === 'Enter' && !this.isAToggleRoot(block.holder)) {
      this.setAttributesToNewBlock();
    }
    if (e.code === 'Tab' && e.shiftKey) { this.extractBlock(index); }
    if (e.code === 'Backspace') {
      const cursorPosition = document.getSelection().focusOffset;
      this.removeBlock(block.holder, block.id, cursorPosition);
    }
  }

  /**
   * Gets the index of the new block, then assigns the required properties,
   * and finally sends the focus.
   */
  setAttributesToNewBlock(entryIndex = null, foreignKey = this.wrapper.id) {
    const index = entryIndex === null ? this.getCurrentBlockIndex() : entryIndex;
    const newBlock = this.getBlockByIndex(index);
    const { holder } = newBlock;

    holder.setAttribute('foreignKey', foreignKey);
    holder.setAttribute('id', uuidv4());
    holder.classList.add('toggle-block__item');

    if (!this.readOnly) {
      holder.onkeydown = this.setEventsToNestedBlock.bind(this);
      holder.querySelector('.cdx-block').focus();
    }

    if (!this.itemsId.includes(newBlock.id)) {
      this.itemsId.splice(index - 1, 0, newBlock.id);
    }
  }

  /**
   * Sets the focus at the end of the toggle root when
   * a nested block is deleted through the backspace key.
   */
  setFocusToggleRootAtTheEnd() {
    const toggle = document.activeElement;
    const selection = window.getSelection();
    const range = document.createRange();

    selection.removeAllRanges();
    range.selectNodeContents(toggle);
    range.collapse(false);
    selection.addRange(range);
    toggle.focus();
  }

  /**
   * Sets the default content. If the toggle has no other blocks inside it,
   * so sets the 'block__hidden tag' in the default content,
   * otherwise it removes it.
   */
  setDefaultContent() {
    const children = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);
    const { firstChild, lastChild } = this.wrapper;
    const { status } = this.data;
    const value = (children.length > 0 || status === 'closed');

    lastChild.classList.toggle('toggle-block__hidden', value);
    firstChild.style.color = (children.length === 0) ? 'gray' : 'black';
  }

  /**
   * If the toggle root is empty and the key event received is 'backspace'
   * or 'enter', its content is cleared so that the visible placeholder
   * is set through the css.
   *
   * @param {KeyboardEvent} e - key up event
   */
  setPlaceHolder(e) {
    if (e.code === 'Backspace' || e.code === 'Enter') {
      const { children } = this.wrapper;
      const { length } = children[1].textContent;

      if (length === 0) children[1].textContent = '';
    }
  }

  /**
   * Display the Toggle's icon according its state
   */
  setInitialIconTransition() {
    const { status } = this.data;
    const icon = this.wrapper.querySelector('.toggle-block__icon');
    const svg = icon.firstChild;
    svg.style.transition = '0.1s';
    svg.style.transform = `rotate(${status === 'closed' ? 0 : 90}deg)`;
  }

  // ----------------------------------------- Getter methods -----------------------------------

  getIndex = (target) => Array.from(target.parentNode.children).indexOf(target);

  /**
   * Return the Toggle root id, given the index of a Toggle's child or Toggle's root.
   * @param {number} index - Block index
   * @returns {String} foreignKey - The Toggle parent id
   */
  getToggleId(index) {
    const { holder } = this.getBlockByIndex(index);
    let foreignKey;
    if (this.isAToggleRoot(holder)) {
      const toggle = holder.querySelector('.toggle-block__selector');
      foreignKey = toggle.getAttribute('id');
    }
    if (this.isAToggleItem(holder)) {
      foreignKey = holder.getAttribute('foreignKey');
    }
    return foreignKey;
  }

  /**
  * Return the toggle's root index, given the index of one of its children
  *
  * @param {number} entryIndex - block index
  * @param {String} fk - The block's foreign key (Toggle root id)
  * @returns {number} The Toggle's root index
  */
  findToogleRootIndex(entryIndex, fk) {
    const block = this.getBlockByIndex(entryIndex);
    const { holder } = block;

    if (this.isAToggleRoot(holder)) {
      const id = holder.querySelector('.toggle-block__selector').getAttribute('id');
      if (fk === id) {
        return entryIndex;
      }
    }
    if (entryIndex - 1 >= 0) {
      return this.findToogleRootIndex(entryIndex - 1, fk);
    }
    return -1;
  }

  /**
   * Returns the index of the root of the toggle which is at the same level of the toggle that it
   * is expected to be moved
   *
   * fk of the toggle that is going to be moved
   * @param {string} currentToggleFk
   * @param {string} blockFk // fk of block which is above of the current toggle root
   * @param {number} toggleInitialIndex // index of the root of the current toggle root
   * @returns
   */
  findIndexOfParentBlock(currentToggleFk, blockFk, toggleInitialIndex) {
    const NestedToggleChildren = this.getDecendentsNumber(blockFk);
    const parentBlockIndex = toggleInitialIndex - (NestedToggleChildren + 1);
    const parentBlock = this.getBlockByIndex(parentBlockIndex).holder;
    if (parentBlock.hasAttribute('foreignKey')) {
      const parentBlockFk = parentBlock.getAttribute('foreignKey');
      if (parentBlockFk !== currentToggleFk) {
        const beforeBlock = this.getBlockByIndex(parentBlockIndex - 1).holder;
        if (beforeBlock.hasAttribute('foreignKey')) {
          const fk = beforeBlock.getAttribute('foreignKey');
          if (fk !== parentBlockFk) {
            return this.findIndexOfParentBlock(currentToggleFk, fk, parentBlockIndex);
          }
        }
      }
    }
    return parentBlockIndex;
  }

  /**
   * Return the number of blocks inside the root Toggle
   * @param {string} fk - The id of the root Toggle
   */
  getDecendentsNumber(fk) {
    let counter = 0;
    const listChildren = document.querySelectorAll(`div[foreignKey="${fk}"]`);
    listChildren.forEach((child) => {
      // Evaluate if the child is a toggle
      if (child.hasAttribute('status')) {
        const childId = child.querySelector('.toggle-block__selector').getAttribute('id');
        counter += this.getDecendentsNumber(childId);
      }
      counter += 1;
    });
    return counter;
  }

  // -------------------------  Validation methods ---------------------------------

  /**
   * Checks if target is a child of a toggle
   * @param {string} parentID id of the parent element
   * @param {string} targetFK foreign key of the target element
   * @returns {boolean}
   */
  isChild = (parentID, targetFK) => {
    if (!parentID || !targetFK) return false; // No parent or no target
    if (parentID === targetFK) return true; // Direct child of the toggle

    return [...document.querySelectorAll(`div[foreignKey="${parentID}"]`)]
      .some((child) => {
        const toggle = child.querySelector('.toggle-block__selector');
        if (!toggle) return false;
        return this.isChild(toggle.getAttribute('id'), targetFK);
      });
  };

  /**
   * Validates if a block contains one of the classes to be
   * part of a toggle. If It has it returns 'true' (It's part
   * of a toggle), otherwise returns 'false' (It's another
   * type of block)
   *
   * @param {HTMLDivElement} block - Block to be validated
   * @returns {boolean}
   */
  isPartOfAToggle(block) {
    const classes = Array.from(block.classList);
    const answer = classes.includes('toggle-block__item') || (classes.includes('toggle-block__input') || classes.includes('toggle-block__selector'));

    return answer;
  }

  /**
   * Returns true if the div element is a toggle child, otherwise, returns false
   * @param {HTMLDivElement} holder
   * @returns {boolean}
   */
  isAToggleItem(holder) {
    return holder.classList.contains('toggle-block__item');
  }

  /**
   * Returns true if the div element is a toggle root, otherwise, returns false
   * @param {HTMLDivElement} holder
   * @returns {boolean}
   */
  isAToggleRoot(holder) {
    return holder.classList.contains('toggle-block__selector') || Boolean(holder.querySelector('.toggle-block__selector'));
  }

  // ------------------------- Movement methods ---------------------------------------

  addEventsMoveButtons(className, movement, options, toggleIndex) {
    const list = options.getElementsByClassName(className);
    if (!list.length) {
      return;
    }
    const moveButton = list[0];
    if (moveButton) {
      moveButton.addEventListener('click', () => {
        this.moveToggle(toggleIndex, movement);
      });
    }
  }

  /**
   * Move the Toggle with all its children and nested toggles.
   * Index of the root toggle before it is moved by editorjs core.
   * @param {number} toggleInitialIndex
   * @param {number} direction // 0: Move down || 1: Move up
   */
  moveToggle(toggleInitialIndex, direction) {
    if (!this.readOnly) {
      this.close();
      const currentToggleIndex = this.getCurrentBlockIndex();
      const decendents = this.getDecendentsNumber(this.wrapper.id);
      const blocks = this.getBlocksCount();
      const toggleEndIndex = toggleInitialIndex + decendents;

      // Move back the root of the Toogle to its initial position
      this.move(toggleInitialIndex, currentToggleIndex);

      if (toggleInitialIndex >= 0 && toggleEndIndex <= (blocks - 1)) {
        if (direction === 0) {
          this.moveDown(toggleInitialIndex, toggleEndIndex);
        } else {
          this.moveUp(toggleInitialIndex, toggleEndIndex);
        }
      }
    }
  }

  /**
   * Move down the whole current toggle to the next corresponding position
   * @param {number} toggleInitialIndex // index of the root of the current toggle
   * @param {number} toggleEndIndex // index of the last child of the current toggle
   */
  moveDown(toggleInitialIndex, toggleEndIndex) {
    const blockAfterToggleIndex = toggleEndIndex + 1;
    const blockAfterToggle = this.getBlockByIndex(blockAfterToggleIndex);
    const { holder } = blockAfterToggle;

    this.move(toggleInitialIndex, blockAfterToggleIndex);

    // Evaluate if the block is a toggle to move its children
    if (blockAfterToggle.name === 'toggle') {
      const id = holder.querySelector('.toggle-block__selector').getAttribute('id');
      const children = this.getDecendentsNumber(id);
      this.moveDecendents(children, toggleInitialIndex + 1, blockAfterToggleIndex + 1, 0);
    }
  }

  /**
   * Move up the whole current toggle to the next corresponding position
   * @param {number} toggleInitialIndex // index of the root of the current toggle
   * @param {number} toggleEndIndex // index of the last child of the current toggle
   */
  moveUp(toggleInitialIndex, toggleEndIndex) {
    const blockBeforeToggleIndex = toggleInitialIndex - 1;
    const blockBeforeToggle = this.getBlockByIndex(blockBeforeToggleIndex);
    if (blockBeforeToggle.name === 'toggle') {
      return;
    }
    const { holder } = blockBeforeToggle;
    // Evaluate if the block is an item of a toggle to move the whole parent toggle
    if (holder.hasAttribute('foreignKey')) {
      const currentToggle = this.getBlockByIndex(toggleInitialIndex).holder;
      const currentToggleFk = currentToggle.getAttribute('foreignKey');
      const fk = holder.getAttribute('foreignKey');
      if (fk !== currentToggleFk) {
        const parentBlockIdx = this.findIndexOfParentBlock(currentToggleFk, fk, toggleInitialIndex);
        const parentBlock = this.getBlockByIndex(parentBlockIdx).holder;
        const id = parentBlock.querySelector('.toggle-block__selector').getAttribute('id');
        const children = this.getDecendentsNumber(id);
        this.move(toggleEndIndex, parentBlockIdx);
        this.moveDecendents(children, toggleEndIndex, parentBlockIdx, 1);
        return;
      }
    }
    this.move(toggleEndIndex, blockBeforeToggleIndex);
  }

  /**
   * Move all the children of the toggle that is being moved
   * @param {number} children // Number of children of the current toggle
   * @param {number} finalIndex // index to calculate where children are going to be moved
   * @param {number} parentInitialIndex // index to calculate where the children are
   * @param {number} direction // 0: to move from top to bottom || 1: to move from bottom to the top
   */
  moveDecendents(children, finalIndex, parentInitialIndex, direction) {
    let childrenCurrentPosition = parentInitialIndex;
    let childrenFinalPosition = finalIndex;
    while (children) {
      this.move(childrenFinalPosition, childrenCurrentPosition);
      if (direction === 0) {
        childrenCurrentPosition += 1;
        childrenFinalPosition += 1;
      }
      children -= 1;
    }
  }

  moveChildren(endBlock, fk = this.wrapper.id) {
    // Get the children of the dropped toggle
    let children = document.querySelectorAll(`div[foreignKey="${fk}"]`);

    // Move all the children to the parent position
    children = this.startBlock >= endBlock ? [...children].reverse() : children;
    children.forEach((child) => {
      const childIndex = this.getIndex(child);
      this.api.blocks.move(endBlock, childIndex);

      // If this child is a toggle we have to move his children too
      const toggles = child.querySelectorAll('.toggle-block__selector');
      const isToggle = toggles.length > 0;
      if (isToggle) {
        const toggleIndex = this.getIndex(child);
        const fix = this.startBlock < endBlock ? 0 : 1;
        toggles.forEach((toggle) => this.moveChildren(toggleIndex + fix, toggle.getAttribute('id')));

        const dif = Math.abs(endBlock - toggleIndex);
        endBlock = this.startBlock < endBlock ? endBlock + dif : endBlock - dif;
      }
    });
  }

  // ----------------------------- Helper methods -----------------------------------------------

  /**
   * Restores the item attributes to nested blocks.
   *
   * @param {HTMLDivElement} mutation - Html element removed or inserted
   */
  restoreItemAttributes(mutation) {
    if (this.wrapper !== undefined) {
      const index = this.api.blocks.getCurrentBlockIndex();
      const block = this.api.blocks.getBlockByIndex(index);
      const { holder } = block;
      const currentBlockValidation = !this.isPartOfAToggle(holder);
      const mutatedBlock = mutation.removedNodes[0];

      if (this.itemsId.includes(block.id) && currentBlockValidation) {
        this.setAttributesToNewBlock(index);
      } else if (mutatedBlock && this.isPartOfAToggle(mutatedBlock) && currentBlockValidation) {
        const blockCover = holder.firstChild;
        const blockContainer = blockCover.firstChild;

        if (!this.isPartOfAToggle(blockContainer)) {
          this.setAttributesToNewBlock(index);
          this.itemsId[index] = block.id;
        }
      }
    }
  }

  /**
   * Adds the actions to do when the default content is clicked.
   */
  clickInDefaultContent() {
    this.api.blocks.insert();
    this.setAttributesToNewBlock();
    this.setDefaultContent();
  }

  /**
   * Extracts a nested block from a toggle
   * with 'shift + tab' combination
   *
   * @param {number} entryIndex - Block's index that will be extracted
   */
  extractBlock(entryIndex) {
    const block = this.getBlockByIndex(entryIndex);
    const { holder } = block;

    if (this.isAToggleItem(holder)) {
      const fk = holder.getAttribute('foreignKey');
      const parentIndex = this.findToogleRootIndex(entryIndex, fk);
      if (parentIndex >= 0) {
        const items = this.getDecendentsNumber(fk);
        const destiny = parentIndex + items;

        if (items > 1) { this.api.blocks.move(destiny, entryIndex); }

        setTimeout(() => this.removeAttributesFromNewBlock(destiny), 200);
      }
    }
    this.api.caret.setToBlock(entryIndex);
    this.api.toolbar.close();
  }

  /**
   * Renders the items view and assigns the properties required to look
   * like a block inside the toggle.
   */
  renderItems() {
    const blocksInEditor = this.api.blocks.getBlocksCount();
    const icon = this.wrapper.firstChild;
    let toggleRoot;

    if (this.readOnly) {
      const redactor = document.getElementsByClassName('codex-editor__redactor')[0];
      const { children } = redactor;
      const { length } = children;

      for (let i = 0; i < length; i += 1) {
        const blockCover = children[i].firstChild;
        const blockContainer = blockCover.firstChild;
        const { id } = blockContainer;

        if (id === this.wrapper.id) {
          toggleRoot = i;
          break;
        }
      }
    } else {
      const toggle = this.wrapper.children[1];
      let currentBlock = {};
      let index = this.api.blocks.getCurrentBlockIndex();

      while (currentBlock[1] !== toggle) {
        toggleRoot = index;
        const block = this.api.blocks.getBlockByIndex(toggleRoot);
        const { holder } = block;
        const blockCover = holder.firstChild;
        const blockContent = blockCover.firstChild;
        currentBlock = blockContent.children;

        index -= 1;
      }
    }

    if (toggleRoot + this.data.items < blocksInEditor) {
      for (let i = toggleRoot + 1, j = 0; i <= toggleRoot + this.data.items; i += 1) {
        const block = this.api.blocks.getBlockByIndex(i);
        const { holder } = block;
        const cover = holder.firstChild;
        const content = cover.firstChild;

        if (!this.isPartOfAToggle(content)) {
          this.setAttributesToNewBlock(i);
          j += 1;
        } else {
          this.data.items = j;
          break;
        }
      }
    } else {
      this.data.items = 0;
    }

    icon.addEventListener('click', () => {
      this.resolveToggleAction();
      setTimeout(() => {
        this.hideAndShowBlocks();
      });
    });

    this.hideAndShowBlocks();
  }

  /**
   * Converts the toggle status to its opposite.
   * If the toggle status is open, then now will be closed and
   * the icon will reset to rotation. Otherwise, will be open
   * and the icon will be rotated 90 degrees to the left.
   *
   * @returns {string} icon - toggle icon
   */
  resolveToggleAction() {
    const icon = this.wrapper.firstChild;
    const svg = icon.firstChild;

    if (this.data.status === 'closed') {
      this.data.status = 'open';
      svg.style.transform = 'rotate(90deg)';
    } else {
      this.data.status = 'closed';
      svg.style.transform = 'rotate(0deg)';
    }

    const toggleBlock = this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex());
    toggleBlock.holder.setAttribute('status', this.data.status);
  }

  /**
   * Hides and shows the toggle paragraphs or the default content.
   * If the toggle status is closed, the added value to the hidden attribute
   * in the container paragraph is 'true', otherwise is 'false'.
   *
   * @param {number} index - toggle index
   */
  hideAndShowBlocks(foreignKey = this.wrapper.id, value = this.data.status) {
    const children = document.querySelectorAll(`div[foreignKey="${foreignKey}"]`);
    const { length } = children;

    if (length > 0) {
      children.forEach((child) => {
        child.hidden = value === 'closed';

        // Check if this child is a toggle and hide his children too
        const toggles = child.querySelectorAll('.toggle-block__selector');
        const isToggle = toggles.length > 0;
        if (isToggle) {
          const childValue = value === 'closed' ? value : child.getAttribute('status');
          this.hideAndShowBlocks(toggles[0].getAttribute('id'), childValue);
        }
      });
    } else if (foreignKey === this.wrapper.id) {
      const { lastChild } = this.wrapper;
      lastChild.classList.toggle('toggle-block__hidden', value);
    }
  }

  /**
   * Highlight the blocks that belongs to the Toggle
   * @param {string} fk - The id of the root Toggle
   */
  highlightToggleItems(fk) {
    const listChildren = document.querySelectorAll(`div[foreignKey="${fk}"]`);
    listChildren.forEach((child) => {
      child.classList.add('ce-block--selected');
      // Evaluate if the child is a toggle, then highlight also its children
      if (child.hasAttribute('status')) {
        const childId = child.querySelector('.toggle-block__selector').getAttribute('id');
        this.highlightToggleItems(childId);
      }
    });
  }

  /**
   * Nest a block inside a toggle
   * @param {number} currentIndex - Block index to be nested
   */
  nestBlock(currentIndex) {
    if (currentIndex - 1 >= 0) {
      const foreignKey = this.getToggleId(currentIndex - 1);
      if (foreignKey) {
        this.setAttributesToNewBlock(currentIndex, foreignKey);
      }
    }
  }
}
