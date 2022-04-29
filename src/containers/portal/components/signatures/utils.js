import * as Tone from 'tone';
import {
  PATTERN_CYBER,
  PATTERN_ETH,
  PATTERN_COSMOS,
  PATTERN_OSMOS,
  PATTERN_TERRA,
} from '../../../../utils/config';

const DICTIONARY_ABC = {
  a: { note: 'E3', bass: 'E3', color: '#00EDEB' },
  b: { note: 'G3', bass: 'E3', color: '#FCF000' },
  c: { note: 'A3', bass: 'E3', color: '#F62BFD' },
  d: { note: 'B3', bass: 'E3', color: '#36D6AE' },
  e: { note: 'D3', bass: 'E3', color: '#000AFF' },
  f: { note: 'B3', bass: 'E3', color: '#00C4FF' },
  g: { note: 'E3', bass: 'E3', color: '#FF5C00' },
  h: { note: 'G3', bass: 'E3', color: '#C4C4C4' },
  i: { note: 'A3', bass: 'E3', color: '#999999' },
  j: { note: 'B3', bass: 'E3', color: '#00EDEB' },
  k: { note: 'D3', bass: 'E3', color: '#FCF000' },
  l: { note: 'E3', bass: 'E3', color: '#F62BFD' },
  m: { note: 'E3', bass: 'E3', color: '#36D6AE' },
  n: { note: 'G3', bass: 'E3', color: '#000AFF' },
  o: { note: 'A3', bass: 'E3', color: '#00C4FF' },
  p: { note: 'B3', bass: 'E3', color: '#FF5C00' },
  q: { note: 'D3', bass: 'E3', color: '#C4C4C4' },
  r: { note: 'B3', bass: 'E3', color: '#999999' },
  s: { note: 'E3', bass: 'A3', color: '#00EDEB' },
  t: { note: 'G3', bass: 'A3', color: '#FCF000' },
  u: { note: 'A3', bass: 'A3', color: '#F62BFD' },
  v: { note: 'B3', bass: 'A3', color: '#36D6AE' },
  w: { note: 'D3', bass: 'A3', color: '#000AFF' },
  x: { note: 'B2', bass: 'A3', color: '#00C4FF' },
  y: { note: 'F#3', bass: 'A3', color: '#00EDEB' },
  z: { note: 'B2', bass: 'A3', color: '#000AFF' },
  0: { note: 'sustein', bass: 'G3', color: '#00EDEB' },
  1: { note: 'sustein', bass: 'G3', color: '#FCF000' },
  2: { note: 'sustein', bass: 'G3', color: '#F62BFD' },
  3: { note: 'sustein', bass: 'G3', color: '#36D6AE' },
  4: { note: 'sustein', bass: 'G3', color: '#000AFF' },
  5: { note: 'sustein', bass: 'G3', color: '#00C4FF' },
  6: { note: 'sustein', bass: 'G3', color: '#FF5C00' },
  7: { note: 'sustein', bass: 'G3', color: '#C4C4C4' },
  8: { note: 'sustein', bass: 'G3', color: '#999999' },
  9: { note: 'sustein', bass: 'G3', color: '#00EDEB' },
};

const getHeight = (value) => {
  const number = (value * 0.3) % 0.19 || 0.9;
  return number * (100 - 2) + 2;
};

const lead10 = new Tone.Sampler({
  urls: {
    E3: 'E3.mp3',
  },
  baseUrl: 'https://el-nivvo.github.io/files/lead10/',
}).toDestination();

const lead10pads = new Tone.Sampler({
  urls: {
    E3: 'pads.mp3',
  },
  baseUrl: 'https://el-nivvo.github.io/files/lead10/',
}).toDestination();

const getNoteFromAdd = (addrr) => {
  if (addrr === null) {
    return null;
  }
  const arrStr = Array.from(addrr);
  let duration = '16n';
  const arrNote = [];
  arrStr.forEach((item) => {
    if (DICTIONARY_ABC[item].note === 'sustein') {
      duration = '4n';
    }
    const obj = { note: DICTIONARY_ABC[item].note, duration };
    arrNote.push(obj);
    if (DICTIONARY_ABC[item].note !== 'sustein') {
      duration = '16n';
    }
  });
  return arrNote;
};

const makeSound = (arrNote) => {
  try {
    Tone.loaded().then(() => {
      let cout = 0;
      const now = Tone.now();

      arrNote.forEach((item) => {
        if (item.note !== 'sustein') {
          const time = now + cout;
          lead10.triggerAttackRelease([item.note], 1, time);
          cout += 0.2;
        } else {
          cout += 0.2;
        }
      });

      // pads
      lead10pads.triggerAttackRelease('E3', 7);
    });
  } catch (error) {
    console.log('error', error);
  }
};

const padseAddress = (address, value) => {
  return {
    prefix: address.slice(0, value),
    address: address.slice(value, address.length - 3),
    end: address.slice(address.length - 3),
  };
};

const cutAddress = (address) => {
  if (address === null) {
    return null;
  }

  let sliceAddress = null;

  if (address.match(PATTERN_ETH)) {
    sliceAddress = padseAddress(address, 7);
  }

  if (address.match(PATTERN_COSMOS)) {
    sliceAddress = padseAddress(address, 10);
  }

  if (address.match(PATTERN_CYBER)) {
    sliceAddress = padseAddress(address, 11);
  }

  if (address.match(PATTERN_OSMOS)) {
    sliceAddress = padseAddress(address, 8);
  }

  if (address.match(PATTERN_TERRA)) {
    sliceAddress = padseAddress(address, 9);
  }

  return sliceAddress;
};

export { DICTIONARY_ABC, getHeight, getNoteFromAdd, makeSound, cutAddress };
