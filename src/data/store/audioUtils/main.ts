import * as Tone from "tone";

export const loopUtils = {
  mixBuffers: (
    bufferA: Tone.ToneAudioBuffer | null,
    bufferB: Tone.ToneAudioBuffer
  ) => {
    const audioContext = Tone.getContext().rawContext;
    const mixedBuffer = audioContext.createBuffer(
      bufferA?.numberOfChannels || bufferB.numberOfChannels,
      Math.max(bufferA?.length || 0, bufferB.length),
      bufferB.sampleRate
    );

    for (let channel = 0; channel < bufferB.numberOfChannels; channel++) {
      const oldData =
        bufferA?.getChannelData(channel) ||
        new Float32Array(mixedBuffer.length);
      const newData = bufferB.getChannelData(channel);
      const mixedData = mixedBuffer.getChannelData(channel);

      for (let i = 0; i < mixedData.length; i++) {
        mixedData[i] = ((oldData[i] || 0) + (newData[i] || 0)) / 2;
      }
    }

    return new Tone.ToneAudioBuffer(mixedBuffer);
  },

  quantizeBuffer: (
    buffer: Tone.ToneAudioBuffer,
    bpm: number,
    measure: number
  ) => {
    const audioContext = Tone.getContext().rawContext;
    if (!buffer || buffer.length === 0) {
      return buffer;
    }

    const samplesPerBeat = buffer.sampleRate * (60 / bpm);
    const beatsLength = buffer.length / samplesPerBeat;

    const quantizedBeats = Math.max(
      1,
      Math.round(beatsLength / measure) * measure
    );
    const quantizedLength = Math.max(
      1,
      Math.round(quantizedBeats * samplesPerBeat)
    );

    const quantizedBuffer = audioContext.createBuffer(
      buffer.numberOfChannels,
      quantizedLength,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const oldData = buffer.getChannelData(channel);
      const newData = quantizedBuffer.getChannelData(channel);

      for (let i = 0; i < quantizedLength; i++) {
        newData[i] = oldData[i] || 0;
      }
    }

    return new Tone.ToneAudioBuffer(quantizedBuffer);
  },

  createPlayer: (
    buffer: Tone.ToneAudioBuffer,
    volume: number,
    fx: Tone.ToneAudioNode[] | null
  ) => {
    const player = new Tone.Player(
      new Tone.ToneAudioBuffer(buffer)
    ).toDestination();
    player.loop = true;

    const minDb = -40;
    const volumeDb =
      volume === 0 ? -Infinity : minDb + (volume / 100) * Math.abs(minDb);

    player.volume.value = volumeDb;

    if (fx) {
      player.disconnect();
      player.chain(...fx, Tone.getDestination());
    }

    return player;
  },
};
