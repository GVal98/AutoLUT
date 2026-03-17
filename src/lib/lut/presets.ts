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
]
