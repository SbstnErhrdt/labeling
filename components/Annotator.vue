<template>
  <div>
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

    <div class="text-md pt-5" v-on:mouseup="selectText" style="min-height: 25vh">
      <div class="label-text" v-html="display"></div>
    </div>

    <hr>

    <div class="py-5">
      <button class="bg-gray-50 hover:bg-gray-200 text-black font-bold py-2 px-4 border border-gray-200 rounded"
              v-on:click="resetAllLabels()">
        <kbd>-</kbd>
        <span class="inline-block pl-2">Reset All</span>
      </button>

      <button class="bg-green-400 text-white font-bold py-2 px-4 border border-green-500 rounded hover:bg-green-600"
              v-on:click="submit()">
        <kbd>↩</kbd>
        <span class="inline-block pl-2">Ok</span>
      </button>
    </div>

    <hr>

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

    <!-- <div class="my-4 p-4 bg-gray-200">
      {{ this.renderedText }}
    </div> -->
    <div>

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
      // console.log(prevEnd, newLabel)
    },
    addFlag: function (newFlag) {
      // if its an empty list

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
            console.warn('can not select text of same node')
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
      let cls = Object.assign([], this.classes);
      let lbs = Object.assign([], this.newLabels);
      let text = Object.assign('', this.text);
      // emit values
      this.$emit('results', {
        labels: lbs,
        classes: cls,
        text: text,
      })
      // reset labels
      this.newLabels = [];
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
      // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
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
  async mounted() {
    console.log('mounted');
  }
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
