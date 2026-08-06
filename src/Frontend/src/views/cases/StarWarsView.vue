<script lang="ts">
import { defineComponent } from 'vue';
import { ref, watch } from 'vue';
import StarWars from '@/components/three/StarWars.vue';

export default defineComponent({
  components: {
    StarWars,
  },
  setup() {
    const text = ref(['The Alumnus Project', 'A collaborative effort', 'by', 'Cornillie Jeffrey', 'Vannieuwenborgh Niels', 'Martens Axel', 'Enjoy the journey through our work!']);
    const positions = ref([100, 250, 300, 350, 400, 450, 550]);
    const speed = ref(1);
    const rerenderKey = ref(0);
    const showSpaceship = ref(true);
    const showControls = ref(true);
    const spacing = ref(150);

    const startPositionValue = 100;

    //make an inputtext variable for the input of textarea, that we will split on change into the text variable
    const inputText = ref(text.value.join('\n'));
    const updateValues = () => {
      text.value = inputText.value.split('\n');
    };
    const updatePositions = () => {
      positions.value = [];
      text.value.forEach((_, i) => {
        const position = startPositionValue + i * spacing.value;
        positions.value.push(position);
      });
    };
    const rerender = () => {
      updateValues();
      updatePositions();
      rerenderKey.value++;
    };

    return {
      text,
      positions,
      inputText,
      updateValues,
      updatePositions,
      rerenderKey,
      rerender,
      showSpaceship,
      spacing,
      showControls,
      speed,
    };
  },
});
</script>

<template>
  <div class="toggle-controls">
    <label>
      <input type="checkbox" class="toggle-input" v-model="showControls" />
      <span v-if="showControls"> Hide Controls </span>
      <span v-else> Show Controls </span>
    </label>
  </div>
  <div v-show="showControls" class="controls">
    <fieldset class="separation-container">
      <legend class="rerender-info">Needs rerender</legend>
      <div class="text-controls">
        <h2>Define your own text</h2>
        <textarea v-model="inputText" rows="5" cols="50" placeholder="Enter your text here, one line per entry"></textarea>
        <div class="speed-controls">
          <h4>Spacing Control</h4>
          <input type="range" v-model="spacing" min="20" max="300" step="10" />
        </div>
        <button @click="rerender">Confirm changes</button>
      </div>
    </fieldset>
    <fieldset class="toggles">
      <legend class="rerender-info">Updates instantly</legend>
      <div class="speed-controls">
        <h4>Speed Control</h4>
        <input type="range" v-model="speed" min="0.1" max="5" step="0.1" />
      </div>
      <h4>Toggle Elements</h4>
      <label>
        <input type="checkbox" v-model="showSpaceship" />
        <span> Show Spaceship </span>
      </label>
    </fieldset>
  </div>
  <StarWars :textContent="text" :positions="positions" :showSpaceship="showSpaceship" :speed="speed" :key="rerenderKey" class="screen" />
</template>

<style scoped>
fieldset {
  border: 1px dashed #ffcc00;
  border-radius: 0.5rem;
}
.rerender-info {
  text-align: right;
}
.toggle-controls {
  position: absolute;
  top: 2rem;
  left: 3rem;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
}
.controls {
  position: absolute;
  top: 5rem;
  left: 3rem;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.text-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.controls h2,
h4 {
  margin: 0;
  color: #ffcc00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow:
    0 0 2px #ffcc00,
    0 0 10px #ffcc00,
    0 0 20px #ffcc00;
  text-align: center;
}
.controls textarea {
  width: 300px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  resize: none;
  background-color: transparent;
  border: 1px solid #ffcc00;
  color: white;
  text-align: center;
}
.controls button {
  padding: 0.5rem 1rem;
  background-color: #ffcc00;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: black;
  font-weight: bold;
}
.controls label,
.toggle-controls label {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}
.controls input[type='checkbox'],
.toggle-controls input[type='checkbox'] {
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  cursor: pointer;
}
.controls input[type='checkbox']:checked + span,
.toggle-controls input[type='checkbox']:checked + span {
  background-color: #ffcc00;
  color: black;
  font-weight: bold;
  border: 1px solid #ffcc00;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
.controls input[type='checkbox']:not(:checked) + span,
.toggle-controls input[type='checkbox']:not(:checked) + span {
  background-color: transparent;
  color: #aaaaaa;
  border: 1px solid #aaaaaa;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.controls button:hover {
  background-color: #e6b800;
}
.screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}
</style>
