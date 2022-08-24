/* eslint-disable no-restricted-syntax */
import * as Tone from 'tone';
import {
  PATTERN_CYBER,
  PATTERN_ETH,
  PATTERN_COSMOS,
  PATTERN_OSMOS,
  PATTERN_TERRA,
} from '../../../../utils/config';

const DICTIONARY_ABC = {
  a: { note: 'E3', height: 16, gain: 1, color: '#36D6AE' },
  b: { note: 'G3', height: 16, gain: 1, color: '#00EDEB' },
  c: { note: 'A3', height: 16, gain: 1, color: '#000AFF' },
  d: { note: 'B3', height: 16, gain: 1, color: '#00C4FF' },
  e: { note: 'D3', height: 16, gain: 1, color: '#F62BFD' },
  f: { note: 'B3', height: 14, gain: 0.9, color: '#00C4FF' },
  g: { note: 'E3', height: 14, gain: 0.9, color: '#36D6AE' },
  h: { note: 'G3', height: 12, gain: 0.8, color: '#00EDEB' },
  i: { note: 'A3', height: 12, gain: 0.8, color: '#000AFF' },
  j: { note: 'B3', height: 12, gain: 0.8, color: '#00C4FF' },
  k: { note: 'D3', height: 12, gain: 0.8, color: '#F62BFD' },
  l: { note: 'E3', height: 10, gain: 0.7, color: '#36D6AE' },
  m: { note: 'E3', height: 8, gain: 0.6, color: '#36D6AE' },
  n: { note: 'G3', height: 8, gain: 0.6, color: '#00EDEB' },
  o: { note: 'A3', height: 8, gain: 0.6, color: '#000AFF' },
  p: { note: 'B3', height: 10, gain: 0.7, color: '#00C4FF' },
  q: { note: 'D3', height: 8, gain: 0.6, color: '#F62BFD' },
  r: { note: 'B3', height: 8, gain: 0.6, color: '#00C4FF' },
  s: { note: 'E3', height: 4, gain: 0.4, color: '#36D6AE' },
  t: { note: 'G3', height: 4, gain: 0.4, color: '#00EDEB' },
  u: { note: 'A3', height: 4, gain: 0.4, color: '#000AFF' },
  v: { note: 'B3', height: 6, gain: 0.5, color: '#00C4FF' },
  w: { note: 'D3', height: 4, gain: 0.4, color: '#F62BFD' },
  x: { note: 'B2', height: 10, gain: 0.7, color: '#FCF000' },
  y: { note: 'F#3', height: 10, gain: 0.7, color: '#FF5C00' },
  z: { note: 'B2', height: 8, gain: 0.6, color: '#FCF000' },
  0: { note: 'sustein', height: 2, color: '#777777' },
  1: { note: 'sustein', height: 2, color: '#777777' },
  2: { note: 'sustein', height: 2, color: '#777777' },
  3: { note: 'sustein', height: 2, color: '#777777' },
  4: { note: 'sustein', height: 2, color: '#777777' },
  5: { note: 'sustein', height: 2, color: '#777777' },
  6: { note: 'sustein', height: 2, color: '#777777' },
  7: { note: 'sustein', height: 2, color: '#777777' },
  8: { note: 'sustein', height: 2, color: '#777777' },
  9: { note: 'sustein', height: 2, color: '#777777' },
};

const getHeight = (value) => {
  const number = (value * 0.3) % 0.19 || 0.9;
  return number * (100 - 2) + 2;
};

// const lead10 = new Tone.Sampler({
//   urls: {
//     E3: 'E3.mp3',
//   },
//   baseUrl: 'https://el-nivvo.github.io/files/lead10/',
// }).toDestination();

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
    const obj = {
      note: DICTIONARY_ABC[item].note,
      gain: DICTIONARY_ABC[item].gain,
      duration,
    };
    arrNote.push(obj);
    if (DICTIONARY_ABC[item].note !== 'sustein') {
      duration = '16n';
    }
  });
  return arrNote;
};

const makeSound = (arrNote) => {
  try {
    const gain = new Tone.Gain(0.9).toDestination();
    const lead = new Tone.Sampler({
      urls: {
        E3: 'E3.mp3',
      },
      baseUrl: 'https://el-nivvo.github.io/files/lead10/',
    }).toDestination();
    // const leadObject = [];
    // for (const key in arrNote) {
    //   if (Object.hasOwnProperty.call(arrNote, key)) {
    //     const element = arrNote[key];
    //     const gain = new Tone.Gain(0.9).toDestination();
    //     const lead = new Tone.Sampler({
    //       urls: {
    //         E3: 'E3.mp3',
    //       },
    //       baseUrl: 'https://el-nivvo.github.io/files/lead10/',
    //     }).toDestination(gain);

    //     leadObject.push(lead);
    //   }
    // }

    Tone.loaded().then(() => {
      let cout = 0;
      const now = Tone.now();

      arrNote.forEach((item, index) => {
        if (item.note !== 'sustein') {
          const time = now + cout;
          // Tone.loaded().then(() => {
          // const templlead = leadObject[index];
          lead.triggerAttackRelease([item.note], 1, time);
          // });
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
