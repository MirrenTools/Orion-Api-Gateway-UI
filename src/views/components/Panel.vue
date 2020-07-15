<template>
	<div style="border: 1px solid #ddd;">
		<div style="background-color: #f5f6fa;padding: 10px 10px;display: flex;flex-wrap: wrap;align-items: center;">
			<div>{{ title }}</div>
			<el-switch style="margin-left: auto;" v-if="switchShow" :active-text="switchText" v-model="isSwitch" @change="switchChange"></el-switch>
		</div>
		<div style="padding: 10px 10px;"><slot></slot></div>
	</div>
</template>

<script>
export default {
	name: 'Panel',
	props: {
		title: {
			type: String,
			required: true
		},
		switchShow: {
			type: Boolean
		},
		openText: {
			type: String,
			default: '开启'
		},
		closeText: {
			type: String,
			default: '关闭'
		},
		switched: {
			type: Boolean
		}
	},
	data() {
		return {
			isSwitch: this.switched
		};
	},
	methods: {
		switchChange() {
			this.$emit('update:switched', this.isSwitch);
		}
	},
	computed: {
		switchText() {
			return this.isSwitch ? this.openText : this.closeText;
		}
	}
};
</script>

<style></style>
