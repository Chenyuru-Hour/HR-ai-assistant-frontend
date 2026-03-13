<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, UploadFilled, UserFilled } from '@element-plus/icons-vue'

const route = useRoute()
const activePath = computed(() => route.path)
</script>

<template>
  <el-menu router :default-active="activePath" class="el-menu-vertical-demo">
    <el-menu-item index="/home">
      <el-icon>
        <House />
      </el-icon>
      <template #title>
        首页
      </template>
    </el-menu-item>

    <el-menu-item index="/upload">
      <el-icon>
        <UploadFilled />
      </el-icon>
      <template #title>
        上传简历
      </template>
    </el-menu-item>

    <el-menu-item index="/candidates">
      <el-icon>
        <UserFilled />
      </el-icon>
      <template #title>
        候选列表
      </template>
    </el-menu-item>
  </el-menu>
</template>
