<template>
	<section class="home-page">
		<header class="panel-header">
			<h2 class="panel-title">首页</h2>
			<p class="panel-desc">欢迎使用 HR AI 助手，请在左侧选择“上传简历”或“候选列表”继续操作。</p>
		</header>

		<div class="info-grid">
			<article class="info-card">
				<span class="info-label">当前用户</span>
				<strong class="info-value">{{ username }}</strong>
			</article>
			<article class="info-card">
				<span class="info-label">系统状态</span>
				<strong class="info-value status-active">运行中</strong>
			</article>
		</div>
	</section>
</template>


<script setup lang="ts">
import { userStore } from '../store/user'
import { storeToRefs } from 'pinia'

const user = userStore()
const { username } = storeToRefs(user)

</script>




<style scoped>
.home-page {
	min-height: 100%;
	padding: 24px;
	background: var(--ms-bg-surface);
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-medium);
	box-shadow: var(--ms-shadow-small);
}

.panel-title {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.panel-desc {
	margin: 10px 0 0;
	font-size: 14px;
	color: var(--ms-text-secondary);
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	margin-top: 22px;
}

.info-card {
	padding: 16px;
	background: var(--ms-bg-subtle);
	border: 1px solid var(--ms-border-default);
	border-radius: var(--ms-radius-small);
}

.info-label {
	display: block;
	font-size: 13px;
	color: var(--ms-text-secondary);
}

.info-value {
	display: block;
	margin-top: 10px;
	font-size: 18px;
	font-weight: 600;
	color: var(--ms-text-primary);
}

.status-active {
	color: var(--ms-success);
}

@media (max-width: 768px) {
	.home-page {
		padding: 16px;
	}

	.info-grid {
		grid-template-columns: 1fr;
	}
}
</style>
