import scriptParticleDefault from './default/particle.rn';
import scriptParticleRuntime from './runtime/particle.rn';
import scriptMyParticleDefault from './default/myParticle.rn';
import scriptMyParticleRuntime from './runtime/myParticle.rn';

export const scriptMap = {
  particle: { user: scriptParticleDefault, runtime: scriptParticleRuntime },
  myParticle: {
    user: scriptMyParticleDefault,
    runtime: scriptMyParticleRuntime,
  },
};
