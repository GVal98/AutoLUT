import type { LutPreset } from './types'
import { createWarmSunsetLut } from './presets/warm-sunset'
import { createCoolBreezeLut } from './presets/cool-breeze'
import { createVintageFilmLut } from './presets/vintage-film'
import { createCinematicTealOrangeLut } from './presets/cinematic-teal-orange'
import { createNoirLut } from './presets/noir'
import { createPastelDreamLut } from './presets/pastel-dream'
import { createCrossProcessLut } from './presets/cross-process'
import { createFadedGloryLut } from './presets/faded-glory'
import { createVividPopLut } from './presets/vivid-pop'
import { createGoldenHourLut } from './presets/golden-hour'
import { createArcticBlueLut } from './presets/arctic-blue'
import { createAutumnHarvestLut } from './presets/autumn-harvest'
import { createBleachBypassLut } from './presets/bleach-bypass'
import { createChromeLut } from './presets/chrome'
import { createCyberpunkLut } from './presets/cyberpunk'
import { createDustyRoseLut } from './presets/dusty-rose'
import { createEmeraldLut } from './presets/emerald'
import { createHazeLut } from './presets/haze'
import { createInfraredLut } from './presets/infrared'
import { createLomoLut } from './presets/lomo'
import { createMoonlightLut } from './presets/moonlight'
import { createPortraLut } from './presets/portra'
import { createSepiaToneLut } from './presets/sepia-tone'
import { createSolarizeLut } from './presets/solarize'
import { createTropicalLut } from './presets/tropical'
// Classic Film Stocks
import { createKodakEktarLut } from './presets/kodak-ektar'
import { createKodakGold200Lut } from './presets/kodak-gold-200'
import { createKodakTriXLut } from './presets/kodak-tri-x'
import { createFujiVelviaLut } from './presets/fuji-velvia'
import { createFujiPro400HLut } from './presets/fuji-pro-400h'
import { createCineStill800TLut } from './presets/cinestill-800t'
// Fujifilm Film Simulations
import { createClassicChromeLut } from './presets/classic-chrome'
import { createEternaLut } from './presets/eterna'
import { createClassicNegLut } from './presets/classic-neg'
// Black & White Variations
import { createHighKeyBWLut } from './presets/high-key-bw'
import { createAcrosLut } from './presets/acros'
// Retro / Era-Specific
import { createPolaroidLut } from './presets/polaroid'
import { createKodachromeLut } from './presets/kodachrome'
import { createSeventiesRetroLut } from './presets/seventies-retro'
// Modern Social Media / Editorial
import { createLightAndAiryLut } from './presets/light-and-airy'
import { createDarkAndMoodyLut } from './presets/dark-and-moody'
import { createCleanMinimalLut } from './presets/clean-minimal'
// Cinematic / Movie Looks
import { createMatrixLut } from './presets/matrix'
import { createDayForNightLut } from './presets/day-for-night'

export const PRESET_LUTS: LutPreset[] = [
  createWarmSunsetLut(),
  createCoolBreezeLut(),
  createVintageFilmLut(),
  createCinematicTealOrangeLut(),
  createNoirLut(),
  createPastelDreamLut(),
  createCrossProcessLut(),
  createFadedGloryLut(),
  createVividPopLut(),
  createGoldenHourLut(),
  createArcticBlueLut(),
  createAutumnHarvestLut(),
  createBleachBypassLut(),
  createChromeLut(),
  createCyberpunkLut(),
  createDustyRoseLut(),
  createEmeraldLut(),
  createHazeLut(),
  createInfraredLut(),
  createLomoLut(),
  createMoonlightLut(),
  createPortraLut(),
  createSepiaToneLut(),
  createSolarizeLut(),
  createTropicalLut(),
  // Classic Film Stocks
  createKodakEktarLut(),
  createKodakGold200Lut(),
  createKodakTriXLut(),
  createFujiVelviaLut(),
  createFujiPro400HLut(),
  createCineStill800TLut(),
  // Fujifilm Film Simulations
  createClassicChromeLut(),
  createEternaLut(),
  createClassicNegLut(),
  // Black & White Variations
  createHighKeyBWLut(),
  createAcrosLut(),
  // Retro / Era-Specific
  createPolaroidLut(),
  createKodachromeLut(),
  createSeventiesRetroLut(),
  // Modern Social Media / Editorial
  createLightAndAiryLut(),
  createDarkAndMoodyLut(),
  createCleanMinimalLut(),
  // Cinematic / Movie Looks
  createMatrixLut(),
  createDayForNightLut(),
]
