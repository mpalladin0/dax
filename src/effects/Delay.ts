/**
 * Models an Analog Delay
 * Reference: https://joshuageisler.medium.com/modeling-an-analog-delay-in-the-web-audio-api-4ac1024e925
 * Reference: https://joshuageisler.medium.com/modeling-an-analog-delay-in-the-web-audio-api-part-2-38a0ebd26a00
 */
export class Delay {
    input: GainNode
    output: GainNode
    delay: DelayNode
    dry: GainNode
    wet: GainNode
    feedback: GainNode
    filter: BiquadFilterNode
    lfo: OscillatorNode
    lfoGain: GainNode
    context: AudioContext

    constructor(context: AudioContext, time: number, feedback = 0.3) {
        this.context = context;

        this.input = context.createGain()
        this.output = context.createGain()
        this.delay = context.createDelay()
        this.delay.delayTime.value = time;

        this.dry = context.createGain()
        this.wet = context.createGain()
        this.feedback = context.createGain()
        this.feedback.gain.value = feedback

        /**
         * Connect the “dry” side of our signal path: 
         */
        this.input.connect(this.dry)
        this.dry.connect(this.output)

        /**
         * Lowpass filter: With that created, we can wire up the “wet” signal. 
         * A good default setting for the filter is 2000 Hz. 
         * This will take away the high frequencies from the delayed signal, which is what a real analog delay will do.
         */
        this.filter = context.createBiquadFilter()
        this.filter.type = "lowpass"
        this.filter.frequency.value = 2000 // Freq. in Hz

        // Feedback loop
        this.input.connect(this.filter)
        this.filter.connect(this.delay)
        this.delay.connect(this.feedback)
        this.feedback.connect(this.filter)

        // Connect to output
        this.delay.connect(this.wet)
        this.wet.connect(this.output)

        /**
         * LFO that modulates the delay time to produce a bit of “chorus” effect. 
         * We will use the default “sine” wave as our waveform, and assign a frequency of 0.5 Hz (1 cycle every 2 seconds). 
         * Then we route it through a gain node so that the target parameter (delay time) is modulated on the right order of magnitude. 
         */
        this.lfo = context.createOscillator()
        this.lfo.frequency.value = 0.5 // Freq. in Hz
        this.lfoGain = context.createGain()
        this.lfoGain.gain.value = 0.0005
        this.lfo.start() // Start the oscillator

        // Connect to output
        this.lfo.connect(this.lfoGain)
        this.lfoGain.connect(this.delay.delayTime) // Modulates a parameter
    } 

    updateDelayTime(time: number) {
        this.delay.delayTime.linearRampToValueAtTime(
          time,
          this.context.currentTime + 0.01
        );
      }
      updateFeedback(level: number) {
        this.feedback.gain.linearRampToValueAtTime(
          level,
          this.context.currentTime + 0.01
        );
      }
      updateFilterFreq(rangeValue: number) {
        // scales 0 - 1 between 100 and 10000 on an exponential scale
        // more useful than linear scaling
        const freq = Math.pow(10, rangeValue * 2 + 2);
        this.filter.frequency.linearRampToValueAtTime(
          freq,
          this.context.currentTime + 0.01
        );
      }
      updateDryWet(gain: number) {
        this.wet.gain.linearRampToValueAtTime(
          gain,
          this.context.currentTime + 0.01
        );
        this.dry.gain.linearRampToValueAtTime(
          1 - gain,
          this.context.currentTime + 0.01
        );
      }
      updateLfoFreq(freq: number) {
        this.lfo.frequency.linearRampToValueAtTime(
          freq,
          this.context.currentTime + 0.01
        );
      }
      updateLfoGain(gain: number) {
        this.lfoGain.gain.linearRampToValueAtTime(
          gain,
          this.context.currentTime + 0.01
        );
      }
}