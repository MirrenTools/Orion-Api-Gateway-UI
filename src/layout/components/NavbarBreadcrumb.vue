<template>
	<el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
		<el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path" :to="item.path">{{ $t(item.title) }}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
export default {
	data() {
		return {
			breadcrumbList: null
		};
	},
	watch: {
		$route() {
			this.getBreadcrumb();
		}
	},
	created() {
		this.getBreadcrumb();
	},
	methods: {
		getBreadcrumb() {
			this.breadcrumbList = [];
			var meta = this.$route.meta;
			var query = this.$route.query;
			if (meta != null && meta.breadcrumb != null) {
				for (var i = 0; i < meta.breadcrumb.length; i++) {
					var route = meta.breadcrumb[i];
					var queryParams = null;
					if (route.queryKeys != null) {
						var flag = true;
						for (var j = 0; j < route.queryKeys.length; j++) {
							var k = route.queryKeys[j];
							if (query[k] == null || query[k] == '') {
								continue;
							}
							if (flag) {
								queryParams = '?';
								flag = false;
							} else {
								queryParams += '&';
							}
							queryParams += k + '=' + query[k];
						}
					}
					var breadcrumb = {};
					breadcrumb.path = route.path + (queryParams || '');
					breadcrumb.title = route.title;
					this.breadcrumbList.push(breadcrumb);
				}
			}
			var title = this.$route.name;
			if (meta != null && meta.title != null) {
				title = meta.title;
			}
			var breadcrumb = { title: title };
			this.breadcrumbList.push(breadcrumb);
		}
	}
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 8px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
