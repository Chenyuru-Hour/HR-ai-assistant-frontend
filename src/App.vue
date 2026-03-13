<template>
	<el-config-provider>
		<BaseHeader />
		<div class="main-container flex">
			<BaseSide />
			<div class="w-full py-4">
				<router-view />
			</div>
		</div>
	</el-config-provider>
</template>

<script setup>
import BaseHeader from '@/components/layouts/BaseHeader.vue'
import BaseSide from '@/components/layouts/BaseSide.vue'
</script>

<style scoped>

.main-container {
	height: calc(100vh - var(--el-menu-item-height) - 4px);
}
</style>
