<template>
  <div class="app-shell">
    <div class="app-backdrop" aria-hidden="true">
      <span class="bg-glow bg-glow--red"></span>
      <span class="bg-glow bg-glow--deep"></span>
      <span class="bg-watermark">GRAY RAVEN</span>
      <span class="bg-beam bg-beam--a"></span>
      <span class="bg-beam bg-beam--b"></span>
      <span class="bg-noise"></span>
      <span class="bg-vignette"></span>
      <span class="bg-frame"></span>
    </div>
    <BlockList />
  </div>
</template>

<script setup>
import BlockList from './components/BlockList.vue'
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
  overflow-x: hidden;
}

.app-backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #050304;
}

.app-backdrop > * {
  position: absolute;
  display: block;
}

.bg-glow {
  border-radius: 50%;
}

.bg-glow--red {
  top: -24vw;
  right: -16vw;
  width: 72vw;
  height: 72vw;
  background: radial-gradient(
    circle,
    rgba(255, 31, 61, 0.36) 0%,
    rgba(255, 31, 61, 0.12) 38%,
    transparent 68%
  );
  filter: blur(18px);
}

.bg-glow--deep {
  left: -22vw;
  bottom: -26vw;
  width: 58vw;
  height: 58vw;
  background: radial-gradient(circle, rgba(163, 0, 22, 0.28), transparent 66%);
  filter: blur(30px);
}

.bg-watermark {
  top: 0;
  right: -5vw;
  font-family: 'Bahnschrift', 'Arial Narrow', sans-serif;
  font-size: clamp(150px, 23vw, 380px);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.085);
  white-space: nowrap;
  transform: skewX(-6deg);
  user-select: none;
}

.bg-beam {
  left: -20%;
  width: 140%;
  height: 1px;
  transform: rotate(-21deg);
}

.bg-beam--a {
  top: 17%;
  height: 220px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
}

.bg-beam--b {
  top: 63%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 31, 61, 0.42),
    transparent
  );
  box-shadow: 0 0 30px rgba(255, 31, 61, 0.18);
}

.bg-noise {
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.22;
  mix-blend-mode: overlay;
}

.bg-vignette {
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 30%,
    transparent 24%,
    rgba(2, 1, 2, 0.84) 100%
  );
}

.bg-frame {
  inset: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.bg-frame::before,
.bg-frame::after {
  content: '';
  position: absolute;
  width: 46px;
  height: 46px;
}

.bg-frame::before {
  top: -1px;
  left: -1px;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  border-left: 1px solid rgba(255, 255, 255, 0.45);
}

.bg-frame::after {
  right: -1px;
  bottom: -1px;
  border-right: 1px solid var(--red);
  border-bottom: 1px solid var(--red);
}

@media (max-width: 760px) {
  .bg-watermark {
    top: 1vh;
    right: -30vw;
    opacity: 0.7;
  }

  .bg-frame {
    inset: 8px;
  }

  .bg-frame::before,
  .bg-frame::after {
    width: 24px;
    height: 24px;
  }
}
</style>
