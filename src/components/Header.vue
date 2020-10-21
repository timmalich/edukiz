<template>
  <div class="header">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 35pt;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
