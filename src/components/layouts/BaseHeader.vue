<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { userStore } from '@/store/user'

const router = useRouter()
const store = userStore()

const username = computed(() => store.username || '--')
// const starterRepository = 'https://github.com/element-plus/element-plus-vite-starter'

function goHome() {
  router.push('/home')
}

function handleComingSoon(actionName) {
  ElMessage.info(`${actionName} 功能建设中`)
}
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="brand" @click="goHome">
      <div class="flex items-center justify-center gap-2">
        <div class="text-xl" i-ep-element-plus />
        <span>HR AI Assistant</span>
      </div>
    </el-menu-item>

    <el-menu-item index="user" disabled>
      <div class="flex items-center justify-center gap-2">
        <div i-ri-user-3-line />
        <span>{{ username }}</span>
      </div>
    </el-menu-item>

    <el-menu-item h="full" @click="handleComingSoon('通知')">
      <button class="w-full cursor-pointer border-none bg-transparent" style="height: var(--el-menu-item-height)">
        <i inline-flex i-ri-notification-3-line />
      </button>
    </el-menu-item>

    <el-menu-item h="full" @click="handleComingSoon('帮助')">
      <button class="w-full cursor-pointer border-none bg-transparent" style="height: var(--el-menu-item-height)">
        <i inline-flex i-ri-question-line />
      </button>
    </el-menu-item>

    <!-- <el-menu-item h="full">
      <a class="size-full flex items-center justify-center" :href="starterRepository" target="_blank" rel="noopener noreferrer">
        <div i-ri-github-fill />
      </a>
    </el-menu-item> -->
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu-demo {
  &.el-menu--horizontal > .el-menu-item:nth-child(1) {
    margin-right: auto;
  }
}
</style>
