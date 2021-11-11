<template>
  <div>
    <div class="labeling-classes px-5 pb-2">
      <ul role="list" class="mt-3 grid grid-cols-1 gap-2 sm:gap-2 sm:grid-cols-3 lg:grid-cols-8">
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
            class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
            <div class="flex-1 px-4 py-2 text-sm truncate">
              <span href="#" class="text-gray-900 font-medium hover:text-gray-600">{{ c.shortName }}</span><br>
            </div>
            <div class="flex-shrink-0 pr-2">
              <span
                class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sr-only ">Open options</span>
              <!-- Heroicon name: solid/dots-vertical
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                   aria-hidden="true">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg> -->
            </div>
          </div>
        </li>
      </ul>
    </div>

    <hr>

    <div class="text-md p-5" v-on:mouseup="selectText">
      <div class="label-text" v-html="display"></div>
    </div>

    <!-- <div class="my-4 p-4 bg-gray-200">
      {{ this.renderedText }}
    </div> -->
    <div>
      <div v-for="(item, index) in newLabels" v-bind:key="index">
        {{ item.representation.start }} - {{ item.representation.end }} - {{ item.classUID }} -
        {{ item.representation.text }}
        <button type="button"
                class="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
                v-on:click="removeLabel(index)">
          x
        </button>
      </div>
    </div>
    <button class="bg-gray-50 hover:bg-gray-200 text-black font-bold py-2 px-4 border border-gray-200 rounded"
            v-on:click="resetAllLabels()">
      Reset All
    </button>

    <button class="bg-green-400 text-white font-bold py-2 px-4 border border-green-900 rounded hover:bg-green-600"
            v-on:click="submit()">
      Ok
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      renderedText: '',
      cls: null,
      newLabels: [],
      clsMap: {},
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
  },
  methods: {
    getClassColor: function (clsUID) {
      if (this.clsMap[clsUID] !== undefined) {
        return this.clsMap[clsUID].color || '#ccc';
      }
      console.log('not in map', this.clsMap, clsUID);
      return '#ccc';
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
            console.log('current anno', currentAnnotation);
            result += '<span class="highlight" style="background:' + this.getClassColor(currentAnnotation.classUID) +
              '" data-index="' + j + '">' + currentAnnotation.representation.text +
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
      // if its an empty list
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
          console.log('wrap')
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
      this.newLabels = this.newLabels.sort(this.sortLabels);
      // console.log(prevEnd, newLabel)
    },
    selectClass: function (cls) {
      this.cls = cls;
    },
    selectClassBasedOnKey: function (key) {
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


      if (selection.baseNode.parentNode.hasChildNodes()) {
        // iterate over all the nodes
        for (let i = 0; i < selection.baseNode.parentNode.childNodes.length; i++) {
          let currentNode = selection.baseNode.parentNode.childNodes[i];
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
            offset = offset + currentNode.textContent.length;
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
    removeLabel: function (i) {
      // propagate deleted label to parent
      let deletedLabel = Object.assign({}, this.newLabels[i])
      this.$emit('deleted', {
        labels: [deletedLabel],
      })
      // remove the label from the array
      this.newLabels.splice(i, 1);
    },
    resetAllLabels: function () {
      let deletedLabels = Object.assign([], this.newLabels)
      this.$emit('deleted', {
        labels: deletedLabels,
      })
      this.newLabels = [];
    },
    submit: function () {
      this.$emit('results', {
        labels: this.newLabels,
        classes: this.classes,
        text: this.text,
      })
    },
    sortLabels: function (a, b) {
      return b.representation.start - a.representation.start;
    },
    handleKeyPress: function (e) {
      // use self instead of this in here
      switch (e.keyCode) {
        case 13: // enter
          this.submit();
          break;
        case 27: // esc
          this.resetAllLabels();
          break;
        default:
          let key = String.fromCharCode(e.keyCode);
          this.selectClassBasedOnKey(key);
      }
    }
  },
  created() {
    // copy labels
    this.newLabels = this.labels;
    this.newLabels = this.newLabels.sort(this.sortLabels);
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
  },
  async mounted() {
  }
};
</script>

<style>

kbd {
  cursor: pointer;
  position: relative;
  display: inline-block;
  font: bold 14px arial;
  font-family: monospace;
  text-decoration: none;
  text-align: center;
  font-weight: normal;
  width: 26px;
  height: 25px;
  line-height: 25px;
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
  box-shadow: inset 0px 0px 5px 0px rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  padding: 3px;
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

</style>
