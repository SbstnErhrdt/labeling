<template>
  <div>
    <!-- Flag Note -->
    <div v-if="showFlagNote" class="fixed z-40 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
         aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!--
          Background overlay, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!--
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">

          <div
            class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
            @click="showFlagNote = false;">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                 viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>

          <label for="note" class="form-label inline-block mb-2 text-gray-700">
            Note:
          </label>
          <textarea
            v-model="note"
            id="note"
            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            rows="3"
            placeholder="Your note"
          ></textarea>
          <div class="mt-5 sm:mt-6">
            <button @click="addNote()" type="button"
                    class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-app-600 text-base font-medium text-white hover:bg-app-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-500 sm:text-sm">
              Save
            </button>
            <!-- Show if note is already set -->
            <div v-if="newFlagsMap['note']">
              <hr class="my-5">

              <button @click="removeNote()" type="button"
                      class="text-gray-500 inline-flex justify-center w-full rounded-md bg-gray-50 hover:bg-gray-200 text-black shadow-sm px-4 py-2">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Classes -->
    <div class="labeling-classes pb-2">
      <ul role="list" class="mt-3 grid grid-cols-1 gap-2 sm:gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <li
          v-if="classes && cls"
          v-for="(c, index) in classes" class="col-span-1 flex shadow-sm rounded-md cursor-pointer"
          v-on:click="selectClass(c)"
          v-bind:class="{ active: c.name === cls.name }"
        >
          <div :key="index"
               class="flex-shrink-0 flex items-center justify-center w-12 text-white text-sm font-medium rounded-l-md"
               :style="{ 'background-color': c.color}">
            <kbd>{{ c.keyboardKey }}</kbd>
          </div>
          <div
            class="flex-1 items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
            <div class="px-1 py-0 text-sm truncate">
              <span class="text-gray-900 font-medium">{{ c.shortName }}</span>
            </div>
            <div class="px-1 text-xs text-gray-500 truncate">
              {{ c.name }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <hr>

    <!-- Text Box -->
    <div class="text-md pt-5" v-on:mouseup="selectText" style="min-height: 25vh">
      <div class="label-text" v-html="display"></div>
    </div>

    <hr>

    <!-- Confirmation Area -->
    <div class="py-5">
      <!-- Reset Button -->
      <button class="bg-gray-50 hover:bg-gray-200 text-black font-bold py-2 px-4 border border-gray-200 rounded"
              v-on:click="resetAllLabels()">
        <kbd>-</kbd>
        <span class="inline-block pl-2">Reset All</span>
      </button>

      <!-- Confirm Button -->
      <button class="bg-green-400 text-white font-bold py-2 px-4 border border-green-500 rounded hover:bg-green-600"
              v-on:click="submit()">
        <kbd>↩</kbd>
        <span class="inline-block pl-2">Ok</span>
      </button>

      <!-- Flag button -->
      <div class="relative inline-block text-left float-right">
        <div>
          <button @click="showFlags=!showFlags"
                  class="bg-gray-50 hover:bg-gray-200 text-black font-bold py-2 px-4 border border-gray-200 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
            </svg>
            Mark
            <span v-if="Object.keys(this.newFlagsMap).length > 0"  class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {{ Object.keys(this.newFlagsMap).length }}
            </span>
            <svg class="-mr-1 ml-2 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                 fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- Flag Dropdown -->
        <div v-if="showFlags"
             class="origin-top-right z-30 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
             role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">

          <!-- Group 1 -->

          <div class="py-1" role="none">

            <!-- Unclear -->

            <button @click="toggleFlag('unclear', 'true')"
                    class="text-gray-500 px-4 py-2 text-sm w-full block hover:bg-gray-100 text-left"
                    role="menuitem"
                    v-bind:class="{
              'text-yellow-700': this.newFlagsMap['unclear'] ,
              'bg-gray-50': this.newFlagsMap['unclear'] ,
            }"
                    tabindex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-3" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Unclear
            </button>

            <!-- Exclude -->

            <button @click="toggleFlag('exclude', 'true')"
                    class="text-gray-500 px-4 py-2 text-sm w-full block hover:bg-gray-100 text-left"
                    role="menuitem"
                    v-bind:class="{
              'text-red-700': this.newFlagsMap['exclude'] ,
              'bg-gray-50': this.newFlagsMap['exclude']
            }"
                    tabindex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-3" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              Exclude
            </button>

            <!-- Note -->
            <button @click="showFlags = !showFlags; openNoteModal()"
                    class="text-gray-500 px-4 py-2 text-sm block w-full block hover:bg-gray-100 text-left"
                    role="menuitem"
                    v-bind:class="{
              'text-blue-700': this.newFlagsMap['note'] ,
              'bg-gray-50': this.newFlagsMap['note'] ,
            }"
                    tabindex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-3" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Add Note
            </button>
          </div>

          <!-- Group 2 -->

          <div class="py-1" role="none">
            <button @click="toggleFlag('example', 'true')"
                    class="text-gray-500 px-4 py-2 text-sm w-full block hover:bg-gray-100 text-left"
                    role="menuitem"
                    v-bind:class="{
              'text-green-700': this.newFlagsMap['example'] ,
              'bg-gray-50': this.newFlagsMap['example'] ,
            }"
                    tabindex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-3" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"/>
              </svg>
              Use as an example
            </button>
          </div>
        </div>
      </div>

    </div>

    <hr>

    <!-- Dev -->
    <div class="py-3">
      <button @click="showDev =!showDev" class="rounded bg-gray-50 hover:bg-gray-200 py-1 px-2 text-xs">
        {{ showDev ? 'Close' : 'Show Raw Data' }}
      </button>
      <div v-if="showDev" class="py-3 text-xs">
        <strong>TEXT:</strong> <br>
        <pre style="white-space: pre-wrap;">{{ text }}</pre>
        <div class="py-2"></div>
        <strong>METADATA:</strong> <br>
        <pre>{{ metadata }}</pre>
        <strong>INITIAL LABELS:</strong> <br>
        <pre>{{ JSON.stringify(this.labels, null, '\t') }}</pre>
        <strong>CURRENT LABELS:</strong> <br>
        <pre>{{ JSON.stringify(this.newLabels, null, '\t') }}</pre>
      </div>
    </div>

    <hr>
    <!-- Results -->
    <div>
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="(item, index) in newLabels" v-bind:key="index" class="py-5">
          <div class="relative">
            <h3 class="text-sm font-semibold text-gray-800">
              <span :style="{ 'color': getClassColor(item.classUID)}">{{ getClass(item.classUID).shortName }}</span> -
              {{ getClass(item.classUID).name }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2">
              {{ text.substring(item.representation.start, item.representation.end) }}
            </p>
            <div class="text-gray-400 text-xs font-mono mt-2">
              <strong>Start:</strong>{{ item.representation.start }} -
              <strong>End:</strong>{{ item.representation.end }}
              <br>
              <strong>Source:</strong>{{ item.labelSource }}
              <br>
              <strong>Confirmed:</strong>{{ item.confirmerUID !== null }}
            </div>
            <button type="button"
                    class="absolute right-0 top-0 bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    aria-expanded="false"
                    v-on:click="removeLabel(index)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      note: '',
      showFlags: false,
      showFlagNote: false,
      renderedText: '',
      cls: null,
      newLabels: [],
      newFlags: [],
      newFlagsMap: {},
      clsMap: {},
      showDev: false,
    };
  },
  computed: {
    // a computed getter
    display: function () {
      // return "text";
      return this.createHighlightedString(this.newLabels, this.text);
    }
  },
  props: {
    itemUID: '',
    clientUID: '',
    projectUID: '',
    taskUID: '',
    text: '',
    classes: [],
    labels: [],
    flags: [],
    metadata: {},
  },
  methods: {
    getClassColor: function (clsUID) {
      if (this.clsMap[clsUID] !== undefined) {
        return this.clsMap[clsUID].color || '#ccc';
      }
      console.error('class not in map', this.clsMap, clsUID);
      return '#ccc';
    },
    getClassShortName: function (clsUID) {
      if (this.clsMap[clsUID] !== undefined) {
        return this.clsMap[clsUID].shortName || 'no-class name';
      }
      console.error('class not in map', this.clsMap, clsUID);
      return 'no-class name';
    },
    getClass: function (clsUID) {
      if (this.clsMap[clsUID] !== undefined) {
        return this.clsMap[clsUID] || null;
      }
      console.error('class not in map', this.clsMap, clsUID);
      return null;
    },
    createHighlightedString: function (ranges, text) {
      if (!this.newLabels) {
        return
      }
      let labelStack = Object.assign([], this.newLabels);
      let result = '';
      let currentAnnotation = labelStack.pop();
      let j = this.newLabels.length - 1;
      for (let i = 0; i < text.length; i++) {
        if (currentAnnotation === undefined) {
          result += text.charAt(i);
        } else {
          if (i >= currentAnnotation.representation.start && i < currentAnnotation.representation.end - 1) {
            // do nothing
          } else if (i === currentAnnotation.representation.end - 1) {
            result += '<span class="highlight" style="background:' + this.getClassColor(currentAnnotation.classUID) +
              // todo: fix text '" data-index="' + j + '">' + currentAnnotation.representation.text +
              '" data-index="' + j + '">' + this.text.substring(currentAnnotation.representation.start, currentAnnotation.representation.end) +
              // display label tag
              '<sub style="background:' + this.getClassColor(currentAnnotation.classUID) + '">' +
              this.getClassShortName(currentAnnotation.classUID) +
              '</sub>' +
              '</span>';
            // next annotation
            currentAnnotation = labelStack.pop();
            j--
          } else {
            result += text.charAt(i);
          }
        }
      }
      this.renderedText = result;
      return result;
    },
    addLabel: function (newLabel) {
      // if it's an empty list
      if (this.newLabels && this.newLabels.length === 0) {
        this.newLabels.push(newLabel)
        return
      }
      // iterate over the labels and insert it at the exact position
      let prevEnd = 0;
      for (let i = 0; i < this.newLabels.length; i++) {
        let currentLabel = this.newLabels[i]
        // new end is before current start
        if (currentLabel.representation.start < newLabel.representation.end && newLabel.representation.start < currentLabel.representation.end) {
          break
        }
        // if the new label is surrounding another label
        // todo: there is a bug with span wrapping
        if (newLabel.representation.start <= currentLabel.representation.start && currentLabel.representation.end <= newLabel.representation.end) {
          return
        }
        // prev label end
        if (prevEnd <= newLabel.representation.start && newLabel.representation.end < currentLabel.representation.start) {
          this.newLabels.splice(i, 0, newLabel)
          break
        }
        // if its at the end of the list add it
        if (i === this.newLabels.length - 1) {
          this.newLabels.splice(i, 0, newLabel)
          break
        }
        prevEnd = currentLabel.representation.end
      }
      this.newLabels = this.newLabels.sort(function (a, b) {
        return b.representation.start - a.representation.start;
      });
    },
    removeLabel: function (i) {
      // propagate deleted label to parent
      let deletedLabel = Object.assign({}, this.newLabels[i])
      this.$emit('deleted', {
        labels: [deletedLabel],
      })
      // remove the label from the array
      this.newLabels.splice(i, 1);
    },
    addNote: function () {
      const note = "" + this.note;
      this.addFlag('note', note);
      this.note = "";
      this.showFlagNote = false; // close modal
      // update map
      let flagMap = Object.assign({}, this.newFlagsMap);
      flagMap['note'] = note;
      this.newFlagsMap = flagMap;
    },
    removeNote: function () {
      this.removeFlag('note', '');
      this.note = "";
      this.showFlagNote = false;
      // update map
      let flagMap = Object.assign({}, this.newFlagsMap);
      delete flagMap['note'];
      this.newFlagsMap = flagMap;
    },
    openNoteModal: function () {
      // copy note
      if (this.newFlagsMap['note']) {
        this.note = ""+ this.newFlagsMap['note'];
      } else {
        this.note = "";
      }
      this.showFlagNote = true;
    },
    toggleFlag: function (flagKey, flagValue) {
      let flagMap = Object.assign({}, this.newFlagsMap);
      if (flagMap[flagKey]) {
        delete flagMap[flagKey];
        this.removeFlag(flagKey, flagValue);
      } else {
        flagMap[flagKey] = flagValue;
        this.addFlag(flagKey, flagValue);
      }
      this.newFlagsMap = flagMap;
    },
    addFlag: function (flagKey, flagValue) {
      this.$emit('addFlag', {
        itemUID: this.itemUID,
        clientUID: this.clientUID,
        projectUID: this.projectUID,
        taskUID: this.taskUID,
        key: flagKey,
        value: flagValue,
      })
    },
    removeFlag: function (flagKey, flagValue) {
      this.$emit('removeFlag', {
        itemUID: this.itemUID,
        clientUID: this.clientUID,
        projectUID: this.projectUID,
        taskUID: this.taskUID,
        key: flagKey,
        value: flagValue,
      })
    },
    selectClass: function (cls) {
      this.cls = cls;
    },
    selectClassBasedOnKey: function (key) {
      // disable if not flag modal is opened
      if (this.showFlagNote) {
        return;
      }
      // iterate over the classes to see if there is a match
      // todo: create key map
      for (let i in this.classes) {
        if (this.classes[i].keyboardKey === key) {
          this.cls = this.classes[i];
          return
        }
      }
    },
    selectText: function (e) {

      e.preventDefault();

      let offset = 0;
      let selection = window.getSelection();
      let start = selection.anchorOffset;
      let end = selection.focusOffset;
      // fip if its the wrong order
      if (start > end) {
        let t = start;
        start = end;
        end = t;
      }

      // check if it was an empty selection
      if (start - end === 0 && e.target) {
        let index = e.target.getAttribute('data-index')
        // if the data attribute is present
        if (index) {
          // remote the label at the index
          this.removeLabel(index)
        }
        return
      }

      // check if the selection was within a selection
      if (selection.anchorNode.parentNode.nodeName !== 'DIV') {
        console.warn('can not select text within a selection')
        return;
      }

      // prevent the selection of overlapping nodes
      if (selection.anchorNode !== selection.focusNode) {
        console.warn('can not select text of different nodes')
        return;
      }

      if (selection.anchorNode.parentNode.hasChildNodes()) {
        // iterate over all the nodes
        for (let i = 0; i < selection.anchorNode.parentNode.childNodes.length; i++) {
          let currentNode = selection.anchorNode.parentNode.childNodes[i];

          // break if its the same node
          if (currentNode === selection.anchorNode) {
            break;
          }
          // if its a text node
          // count the length of the text
          if (currentNode.nodeType === document.TEXT_NODE) {
            offset = offset + currentNode.length;
          }
          // if its a element node
          // count the length of the text of the element
          if (currentNode.nodeType === document.ELEMENT_NODE) {
            let childrenCursor = 0;
            while (childrenCursor < currentNode.childNodes.length) {
              let currentChildNode = currentNode.childNodes[childrenCursor];
              // exclude sub
              if (currentChildNode.nodeType === document.TEXT_NODE) {
                offset = offset + currentChildNode.textContent.length;
              }
              childrenCursor++;
            }
          }
        }
      }
      // add the offset
      start = start + offset;
      end = end + offset;
      if (end !== start) {
        this.addLabel({
          'clientUID': this.clientUID,
          'projectUID': this.projectUID,
          'taskUID': this.taskUID,
          'itemUID': this.itemUID,
          'classUID': this.cls.UID || '',
          'representation': {
            'indexStart': -1, // this is only if there is some tokenization before
            'indexEnd': -1, // this is only if there is some tokenization before
            'start': start,
            'end': end,
            'text': this.text.substring(start, end),
          },
        })
      }
    },
    resetAllLabels: function () {
      let deletedLabels = Object.assign([], this.newLabels)
      this.$emit('deleted', {
        labels: deletedLabels,
      })
      this.newLabels = [];
    },
    submit: function () {
      let cls = Object.assign([], this.classes);
      let lbs = Object.assign([], this.newLabels);
      let text = Object.assign('', this.text);
      let flags = Object.assign([], this.newFlags);
      // emit values
      this.$emit('results', {
        labels: lbs,
        classes: cls,
        flags: flags,
        text: text,
      })
      // reset labels
      this.newLabels = [];
      this.newFlags = [];
      this.newFlagsMap = {};
    },
    handleKeyPress: function (e) {
      // use self instead of this in here
      switch (e.keyCode) {
        case 13: // enter
          this.submit();
          break;
        case 45: // -
          this.resetAllLabels();
          break;
        default:
          let key = String.fromCharCode(e.keyCode);
          this.selectClassBasedOnKey(key);
      }
    }
  },
  watch: {
    labels: function (newVal, oldVal) { // watch it
      let labels = Object.assign([], newVal);
      labels = labels.sort(function (a, b) {
        return b.representation.start - a.representation.start;
      });
      this.newLabels = labels;
    }
  },
  created() {
    // copy labels
    this.newLabels = Object.assign([], this.labels);
    // sort labels
    this.newLabels = this.newLabels.sort(function (a, b) {
      return b.representation.start - a.representation.start;
    });
    // copy flags
    this.newFlags = Object.assign([], this.flags);
    let newFlagsMap = {};
    for (const flag of this.newFlags) {
      if (['seen', 'exclude', 'example', 'unclear'].includes(flag.key)) {
        newFlagsMap[flag.key] = flag.value;
      } else {
        newFlagsMap[flag.key] = flag.value;
      }
    }
    this.newFlagsMap = newFlagsMap;

    // set the first class as default
    if (this.classes && this.classes.length >= 0) {
      this.cls = this.classes[0];
      // crate a class map
      this.classes.forEach(element => {
        this.clsMap[element.UID] = element;
      });
    }
  },
  beforeMount() {
    window.addEventListener('keypress', this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.handleKeyPress);
    // reset labels
    this.newLabels = [];
  },
  async mounted() {}
};
</script>

<style>

kbd {
  cursor: pointer;
  position: relative;
  display: inline-block;
  font: bold 13px arial;
  font-family: monospace;
  text-decoration: none;
  text-align: center;
  font-weight: normal;
  width: 30px;
  height: 27px;
  line-height: 27px;
  border-radius: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  margin: 0;
  color: #ffffff;
  background: #222;
  box-shadow: inset 0 0 25px #333, 0 1px 0 #000, 0 2px 0 #222, 0 2px 3px #333;
  text-shadow: 0 -1px 0 #000;
}

.labeling-classes ul li {
  opacity: 0.5;
}

.labeling-classes ul li.active {
  opacity: 1;
}

.highlight {
  cursor: not-allowed;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px 0 rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  padding: 3px 3px 9px 3px;
  position: relative;
}

.highlight:hover {
  border: 1px dotted rgba(0, 0, 0, 0.8);
}

.label-text {
  line-height: 200%;
  padding: 1px;
}

.remove {
  border: 1px solid;
}

.highlight sub {
  position: absolute;
  left: 3px;
  bottom: 5px;
  font-size: 9px;
  display: block;
  opacity: 0.6;
}

</style>
