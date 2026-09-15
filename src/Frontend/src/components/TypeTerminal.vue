<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  text: string;
  wrongText?: string;
  prefix?: string;
  timeBetweenKeypresses: number;
  timeBetweenRemoves?: number;
  pauseMultiplier?: number;
  idleTime?: number;
  loop?: boolean;
  terminalSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '$',
  timeBetweenKeypresses: 500,
  timeBetweenRemoves: 200,
  pauseMultiplier: 2,
  idleTime: 1000,
  loop: true,
  terminalSize: 32,
})
type Phase = 'typing-wrong' | 'pausing' | 'deleting' | 'typing-correct' | 'idle';

let cancelled = false;
let currentResolve: (() => void) | null = null;


const displayText = ref('');
const displayPrefix = ref(props.prefix);
const inputText = ref('');
const inputElement = ref<HTMLInputElement | null>(null);
let phase: Phase = 'idle';
let typeInterval: any;
let suppressBlurReset = false;

type AnswerValue = string | (() => string);

const answers: Record<string, AnswerValue> = {
  ls: '\n\t- Jeffrey.dev\n\t- Niels.dev\n\t- Axel.dev',
  whoami: () => '\n' + compliments(),
  help: () => availableCommands(),
  'hiring': '\nSend me a mail, let\'s talk.',
  'sudo rm -rf /': '\nNice try. Access denied.',
  date: () => `\n${new Date().toString()}`,
  'cat resume.txt': '\nSee /people for our full story.',
  'git blame': "\nIt wasn't me I swear.",
  exit: '\nMaybe try :w ?',
  ':w': '\nMaybe try exit ?',
};
const invalidCommand: string = '\nInvalid command. Use Help for a list of commands.';

function availableCommands(): string {
  const commands = Object.keys(answers);
  return '\nAvailable commands:\n\t' + commands.join('\n\t');
}
function compliments(): string {
  const compliments = [
    'You\'re fantastic!',
    'You\'re amazing!',
    'You\'re great!',
    'You\'re awesome!',
    'You\'re the best!',
    'You\'re outstanding!',
    'You\'re exceptional!',
    'You\'re brilliant!',
    'You\'re incredible!',
  ];
  return compliments[Math.floor(Math.random() * compliments.length)] as string;
}

const noWrongText = !props.wrongText || props.wrongText.length === 0;

function findDivergenceIndex(text: string, wrongText: string): number {
  if (noWrongText) return text.length;

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== wrongText[i]) return i;
  }

  return text.length;
}

function typeText(textToType: string): Promise<void> {
  clearInterval(typeInterval);

  return new Promise(resolve => {
    currentResolve = resolve;
    let i = 0;
    typeInterval = setInterval(() => {
      if (i >= textToType.length) {
        clearInterval(typeInterval);
        resolve();
        return;
      }

      displayText.value += textToType[i];
      i++;
    }, props.timeBetweenKeypresses);
  });
}
function removeText(amountToRemove: number): Promise<void> {
  clearInterval(typeInterval);
  return new Promise(resolve => {
    currentResolve = resolve;
    let i = amountToRemove;
    typeInterval = setInterval(() => {
      if (i <= 0) {
        clearInterval(typeInterval);
        resolve();
        return;
      }
      displayText.value = displayText.value.slice(0, -1);
      i--;
    }, props.timeBetweenRemoves);
  });
}
async function removeAllText(): Promise<void> {
  await removeText(displayText.value.length);
}

async function typeWrongText(): Promise<void> {
  if (noWrongText) return;
  await typeText(props.wrongText);
}

async function pauseOnMistake(): Promise<void> {
  if (noWrongText) return;
  if (!props.pauseMultiplier || props.pauseMultiplier === 0) return;
  await sleep(props.timeBetweenKeypresses * props.pauseMultiplier);
}

async function deleteToDivergence(): Promise<number> {
  if (noWrongText) return props.text.length;

  const divergenceIndex = findDivergenceIndex(props.text, props.wrongText);
  const lengthToRemove = props.wrongText.length - divergenceIndex;

  const maxOvershoot = Math.floor(divergenceIndex * 0.3);
  const overshoot = Math.floor(Math.random() * maxOvershoot);
  const lengthToRemoveWithOvershoot = lengthToRemove + overshoot;
  const LengthToRemoveClampedOnTextLength = Math.min(lengthToRemoveWithOvershoot, props.text.length);
  const LengthToRemoveClampedOnWrongTextLength = Math.min(LengthToRemoveClampedOnTextLength, props.wrongText.length);


  await removeText(LengthToRemoveClampedOnWrongTextLength);

  const remainingLength = props.wrongText.length - LengthToRemoveClampedOnWrongTextLength;
  return remainingLength;
}

async function typeCorrectText(fromIndex: number): Promise<void> {
  await typeText(props.text.slice(fromIndex));
}

async function loopForever() {
  while (!cancelled) {
    await run();
    if (cancelled) break;
    await sleep(props.idleTime);
    if (cancelled) break;
    await removeAllText();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  phase = 'typing-wrong';
  await typeWrongText();
  if (cancelled) return;
  phase = 'pausing';
  await pauseOnMistake();
  if (cancelled) return;
  phase = 'deleting';
  const remainingLength = await deleteToDivergence();
  if (cancelled) return;
  phase = 'typing-correct';
  await typeCorrectText(remainingLength);
  if (cancelled) return;
  phase = 'idle';
}

function start() {
  cancelled = false;
  if (!props.loop) {
    run();
  } else {
    loopForever();
  }
}
function cleanup() {
  cancelled = true;
  clearInterval(typeInterval);
  currentResolve?.();
}
onMounted(() => {
  start();
});

onUnmounted(() => {
  cleanup();
})

function onFocus() {
  cleanup();
  inputText.value = '';
  displayText.value = '';
}
function onBlur() {
  if (suppressBlurReset) {
    suppressBlurReset = false;
    return;
  }

  inputText.value = '';
  displayText.value = '';
  start();
}
function onInput() {
  displayText.value = inputText.value;
}

function onEnter() {
  const command = inputText.value.trim();
  const answer = answers[command];
  if (!answer) {
    displayText.value += invalidCommand;
  } else {
    displayText.value += typeof answer === 'function' ? answer() : answer;
  }

  suppressBlurReset = true;
  inputElement.value?.blur();
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (document.activeElement === inputElement.value) {
      onEnter();
    } else {
      inputElement.value?.focus();
    }
  }

})
</script>

<template>
  <div class="terminal" :style="{ '--terminal-size': terminalSize + 'px' }">
    <span class="terminal-prefix">{{ displayPrefix }}</span>
    <span type="text" class="terminal-text">{{ displayText }}</span>
    <input ref="inputElement" type="text" class="terminal-input" :onInput="onInput" :onBlur="onBlur" :onFocus="onFocus"
      v-model="inputText" />
    <span class="terminal-cursor" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.terminal {
  --terminal-size: 24px;
  display: inline-flex;
  align-items: center;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: var(--terminal-size);
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--surface-strong);
  color: var(--accent);
  padding: 0.5em 1em;
  border: 1px solid var(--accent-ghost);
  border-radius: 0.35em;
  text-shadow: 0 0 0.4em var(--accent-weak);
  box-shadow: 0 0 1.4em rgba(0, 0, 0, 0.35);
  position: relative;
  max-width: 30vw;
}

.terminal:hover {
  cursor: text;
}

.terminal-prefix {
  margin-top: 0.1em;
  align-self: start;
}

.terminal-text {
  margin: auto 0;
  white-space: pre-wrap;
  max-width: 30vw;
  text-wrap: auto;
  overflow: scroll;
}

.terminal-input {
  position: absolute;
  inset: 0;
  border: none;
  outline: none;
  overflow: hidden;
  transition: width 500ms ease;
  color: transparent;
  caret-color: transparent;
  background: transparent;
  max-width: 30vw;
  text-wrap: auto;
  overflow: scroll;
}

.terminal-prefix {
  margin-right: 0.5em;
  color: var(--accent2);
}

.terminal-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1.2em;
  margin: auto 0 0.3em 0;
  background: currentColor;
  animation: terminal-blink 1s steps(1) infinite;
}

@keyframes terminal-blink {

  0%,
  50% {
    opacity: 1;
  }

  50.01%,
  100% {
    opacity: 0;
  }
}
</style>
