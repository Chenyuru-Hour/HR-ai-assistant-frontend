<template>
	<div class="app-layout">
		<el-container class="layout-container">
			<el-aside class="left-nav" width="220px">
				<div class="nav-title">页面导航</div>
				<el-menu :default-active="activePath" class="nav-menu" router>
					<el-menu-item index="/home">首页</el-menu-item>
					<el-menu-item index="/upload">上传简历</el-menu-item>
					<el-menu-item index="/candidates">候选列表</el-menu-item>
				</el-menu>
			</el-aside>

			<el-main class="right-content">
				<router-view />
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activePath = computed(() => route.path)
</script>

<style scoped>
.app-layout {
	min-height: 100vh;
	background: #f5f7fa;
}

.layout-container {
	min-height: 100vh;
}

.left-nav {
	background: #ffffff;
	border-right: 1px solid #ebeef5;
}

.nav-title {
	padding: 20px;
	font-size: 18px;
	font-weight: 600;
	color: #303133;
}

.nav-menu {
	border-right: none;
}

.right-content {
  width: 80vw;
	padding: 20px;
	overflow: auto;
}

@media (max-width: 900px) {
	.left-nav {
		width: 180px !important;
	}
}
</style>
