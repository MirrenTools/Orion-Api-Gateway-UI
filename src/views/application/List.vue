<template>
	<div style="padding: 10px 15px;">
		<div style="display: flex;flex-wrap: wrap;align-items: center;">
			<div style="line-height: 50px;">{{ $t('Total') }}:{{ data.totals }}</div>
			<div style="margin-left: auto;">
				<router-link to="/apps/new">
					<el-button type="primary">{{ $t('Create') }}</el-button>
				</router-link>
			</div>
		</div>
		<el-table ref="applicationTable" :data="data.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="50"></el-table-column>
			<el-table-column prop="name" :label="$t('App name')"></el-table-column>
			<el-table-column prop="describe" :label="$t('App describe')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="host" :label="$t('Host')"></el-table-column>
			<el-table-column prop="createTime" :label="$t('Create time')"></el-table-column>
			<el-table-column prop="apiQuantity" :label="$t('Api quantity')"></el-table-column>
			<el-table-column prop="procQuantity" :label="$t('Processed')"></el-table-column>
			<el-table-column :label="$t('Processing')">
				<template slot-scope="scope">
					<div style="display: flex;">
						{{ scope.row.process }}&nbsp;
						<el-link type="primary" @click="loadProcessingCount(scope.row)">
							<span>{{ $t('Get') }}</span>
						</el-link>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="state" :label="$t('AppState')">
				<template slot-scope="scope">
					<span v-show="scope.row.state == 0" class="color-gray">{{ $t('Unconnected') }}</span>
					<span v-show="scope.row.state == 1" class="color-green">{{ $t('Running') }}</span>
					<span v-show="scope.row.state == 2" class="color-red">{{ $t('Stopped') }}</span>
					<span v-show="scope.row.state == 3" class="color-red">{{ $t('ConnectError') }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('Operation')">
				<template slot-scope="scope">
					<router-link to="/404" style="margin-right: 10px;">
						<el-link type="primary">{{ $t('ApiManager') }}</el-link>
					</router-link>
					<router-link :to="{ path: '/apps/details', query: { id: scope.row.id } }">
						<el-link type="primary">{{ $t('Check') }}</el-link>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<div style="display: flex;flex-wrap: wrap;align-items: center;margin-bottom: 50px;">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:total="data.totals"
				:page-count="data.pages"
				:current-page="data.page"
				:page-size="data.size"
				:layout="pageLayout"
				background
				hide-on-single-page
				style="margin-top: 15px;"
			></el-pagination>
			<div style="text-align: right;margin-left: auto;">
				<el-button type="success" style="margin-top: 15px;">{{ $t('Start') }}</el-button>
				<el-button type="warning" style="margin-top: 15px;">{{ $t('Restart') }}</el-button>
				<el-button type="danger" style="margin-top: 15px;">{{ $t('Stop') }}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			// 应用的数据信息
			data: {
				totals: 1234,
				pages: 12,
				page: 1,
				size: 15,
				data: [
					{
						id: '1',
						name: '应用的名称应用的描述应用的描述',
						describe: '应用的描述应用的描述应用的描述应用的描述',
						host: '127.0.0.1:8080',
						createTime: '2020/10/12 10:12',
						apiQuantity: '456',
						procQuantity: '123',
						process: '0',
						state: '0'
					},
					{
						id: '2',
						name: '应用的名称应用的描述应用的描述',
						describe: '应用的描述应用的描述应用的描述应用的描述',
						host: '127.0.0.1:8080',
						createTime: '2020/10/12 10:12',
						apiQuantity: '456',
						procQuantity: '123',
						process: '0',
						state: '1'
					},
					{
						id: '3',
						name: '应用的名称应用的描述应用的描述',
						describe: '应用的描述应用的描述应用的描述应用的描述',
						host: '127.0.0.1:8080',
						createTime: '2020/10/12 10:12',
						apiQuantity: '456',
						procQuantity: '123',
						process: '0',
						state: '2'
					},
					{
						id: '4',
						name: '应用的名称应用的描述应用的描述',
						describe: '应用的描述应用的描述应用的描述应用的描述',
						host: '127.0.0.1:8080',
						createTime: '2020/10/12 10:12',
						apiQuantity: '456',
						procQuantity: '123',
						process: '0',
						state: '3'
					}
				]
			},
			//已选择的行
			selectList: []
		};
	},
	methods: {
		/**
		 * 表格选中行
		 * @param {Object} rows
		 */
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.applicationTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.applicationTable.clearSelection();
			}
		},
		/**
		 * 表格已选中的行
		 * @param {Object} val
		 */
		handleSelectionChange(val) {
			this.selectList = val;
		},
		/**
		 * 加载指定应用正在处理中的数量
		 * @param {Object} rows
		 */
		loadProcessingCount(rows) {
			rows.process = '...';
			setTimeout(() => {
				rows.process = 10;
			}, 3000);
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		}
	},
	computed: {
		...mapGetters(['device']),
		pageLayout() {
			return this.device == 'mobile' ? 'prev, next, jumper' : 'prev, pager, next, jumper';
		}
	}
};
</script>

<style>
.color-red {
	color: #ff0033;
}

.color-green {
	color: #28a745;
}

.color-blue {
	color: #0366d6;
}

.color-gray {
	color: #999;
}
</style>
