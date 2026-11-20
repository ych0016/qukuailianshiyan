<template>
  <article class="block-card">
    <header class="block-head">
      <div class="block-ident">
        <span class="block-kicker">BLOCK</span>
        <span class="block-index">{{ paddedIndex }}</span>
      </div>
      <div class="block-head-right">
        <time class="block-time" :datetime="isoTime">{{ formattedTime }}</time>
        <span class="block-tag">CONFIRMED</span>
      </div>
    </header>

    <div class="block-body">
      <div class="data-row">
        <span class="label">HASH</span>
        <span class="value hash" :title="block.hash">{{ block.hash }}</span>
      </div>
      <div class="data-row">
        <span class="label">PREV HASH</span>
        <span class="value hash prev" :title="block.previousHash">{{ block.previousHash }}</span>
      </div>
      <div class="data-row">
        <span class="label">DATA</span>
        <span class="value data-content">{{ block.data }}</span>
      </div>
      <div class="data-row">
        <span class="label">NONCE</span>
        <span class="value nonce">{{ block.nonce }}</span>
      </div>
    </div>

    <footer class="block-foot">
      <span>SHA-256</span>
      <span class="foot-line"></span>
      <span>CHAIN VERIFIED</span>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const timestamp = computed(() => Number(props.block.timestamp))

const formattedTime = computed(() => {
  const time = dayjs(timestamp.value)
  return time.isValid() ? time.format('YYYY-MM-DD HH:mm:ss') : '时间未知'
})

const isoTime = computed(() => {
  const date = new Date(timestamp.value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
})

const paddedIndex = computed(() =>
  String(props.block.index ?? 0).padStart(3, '0'),
)
</script>

<style scoped>
.block-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: rgba(8, 5, 6, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(5px);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.block-card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 74px;
  height: 1px;
  background: var(--red);
  box-shadow: 0 0 12px rgba(255, 31, 61, 0.5);
}

.block-card::after {
  content: '';
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 50px;
  height: 50px;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.block-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 31, 61, 0.06);
}

.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 26px 16px;
  background: linear-gradient(
    90deg,
    rgba(255, 31, 61, 0.06),
    transparent 40%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
}

.block-ident {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
}

.block-kicker {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--red);
}

.block-index {
  font-family: var(--mono);
  font-size: 54px;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: #f4f1ea;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
}

.block-head-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}

.block-time {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.52);
}

.block-tag {
  padding: 3px 9px;
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.block-body {
  padding: 16px 26px 14px;
}

.data-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.data-row:last-child {
  border-bottom: 0;
}

.label {
  padding-top: 3px;
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.35);
}

.label::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 1px;
  margin-right: 8px;
  vertical-align: middle;
  background: rgba(255, 31, 61, 0.6);
}

.value {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: #e8e3dc;
  word-break: break-all;
}

.hash {
  color: #f2ede7;
}

.hash.prev {
  color: rgba(255, 255, 255, 0.52);
}

.data-content {
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.nonce {
  color: var(--red);
}

.block-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 26px 10px;
  font-family: var(--mono);
  font-size: 7px;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.foot-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.18),
    transparent
  );
}

@media (max-width: 640px) {
  .block-head {
    align-items: flex-start;
    padding: 14px 16px 12px;
  }

  .block-index {
    font-size: 40px;
  }

  .block-kicker {
    font-size: 7px;
  }

  .block-body {
    padding: 10px 16px 8px;
  }

  .data-row {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 10px;
    padding: 10px 0;
  }

  .label {
    font-size: 7px;
    letter-spacing: 0.14em;
  }

  .label::before {
    width: 9px;
    margin-right: 6px;
  }

  .value {
    font-size: 12px;
  }

  .block-time {
    font-size: 10px;
  }

  .block-tag {
    display: none;
  }

  .block-foot {
    padding: 8px 16px;
  }
}
</style>
