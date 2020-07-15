<template>
	<div style="padding: 10px 15px;">
		<Panel :title="$t('Basic information')">
			<div>
				<el-form ref="basicFrom" :label-position="labelPosition" label-width="150px" :model="basicData" :rules="basicRules">
					<el-form-item :label="$t('App id')" prop="id"><el-input v-model="basicData.id" :placeholder="$t('Please enter application id(optional)')"></el-input></el-form-item>
					<el-form-item :label="$t('App token')" prop="token">
						<el-input v-model="basicData.token" :placeholder="$t('Please enter application token(optional)')"></el-input>
					</el-form-item>
					<el-form-item :label="$t('App name')" prop="name"><el-input v-model="basicData.name" :placeholder="$t('Please enter application name')"></el-input></el-form-item>
					<el-form-item :label="$t('App describe')" prop="describe">
						<el-input v-model="basicData.describe" :placeholder="$t('Please enter application describe')"></el-input>
					</el-form-item>
				</el-form>
			</div>
		</Panel>
		<Panel style="margin-top: 5px;" :title="$t('Server config')">
			<el-form ref="serverFrom" :label-position="labelPosition" label-width="150px" :model="serverData">
				<el-form-item :label="$t('http Server')" prop="isHttp"><el-switch v-model="serverData.ishttp"></el-switch></el-form-item>
				<el-form-item v-show="serverData.ishttp" :label="$t('http Port')" prop="httpPort">
					<el-input v-model="serverData.httpPort" :placeholder="$t('Please enter http server port,default 80')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('https Server')" prop="isHttp"><el-switch v-model="serverData.ishttps"></el-switch></el-form-item>
				<el-form-item v-show="serverData.ishttps" :label="$t('https Port')" prop="httpsPort">
					<el-input v-model="serverData.httpsPort" :placeholder="$t('Please enter https server port,default 443')"></el-input>
				</el-form-item>
				<el-form-item v-show="serverData.ishttps" :label="$t('SSL certificate(PEM)')" prop="certs">
					<template>
						<div style="display: flex;flex-wrap:wrap; align-items: center;">
							<el-popover
								placement="top-start"
								:title="$t('Tips')"
								width="300"
								trigger="click"
								:content="
									$t(
										'Only PEM certificates are supported, if the certificate is in the cert folder, you only need to enter the name of the certificate. for other paths add f:// before the certificate,for example f:///pki/cert.key'
									)
								"
							>
								<el-button slot="reference" type="text">{{ $t('Certificate explain') }}</el-button>
							</el-popover>
							<div style="margin-left: auto;">
								<el-button type="primary" size="medium" @click="addPem()">{{ $t('Add') }}</el-button>
							</div>
						</div>
						<el-row :gutter="10" v-for="(c, idx) in serverData.certs" :key="idx">
							<el-col :sm="10" :xs="24" style="margin-top: 5px;"><el-input :placeholder="$t('Please enter the certificate key path')" v-model="c.key"></el-input></el-col>
							<el-col :sm="10" :xs="24" style="margin-top: 5px;"><el-input :placeholder="$t('Please enter the certificate value path')" v-model="c.value"></el-input></el-col>
							<el-col :sm="4" :xs="24" style="margin-top: 5px;">
								<el-button size="medium" type="danger" @click="removePem(idx)">{{ $t('Remove') }}</el-button>
							</el-col>
						</el-row>
					</template>
				</el-form-item>
				<el-form-item :label="$t('Body Length')" prop="bodyLength">
					<el-input v-model="serverData.bodyLength" :placeholder="$t('Set the maximum body size -1 means unlimited')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('Session manager')" prop="sessionTimeout">
					<template>
						<div>
							<el-select v-model="sessionManager" :placeholder="$t('Select session manager')" clearable style="width: 100%;">
								<el-option v-for="plugins in sessionManagerPlugins" :key="plugins.id" :label="plugins.name" :value="plugins"></el-option>
							</el-select>
							<div v-if="sessionManager">
								<div>{{ sessionManager.describe }}</div>
								<el-form label-position="left" label-width="20vh" v-if="sessionManager.config">
									<el-form-item v-for="(config, idx) in sessionManager.config" :key="idx" :label="config.key">
										<el-input v-model="config.value" :placeholder="config.describe"></el-input>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</template>
				</el-form-item>
				<el-form-item :label="$t('Extensions config')" prop="certs">
					<template>
						<div style="display: flex;flex-wrap:wrap; align-items: center;">
							<div>
								<a target="_blank" style="color: #1976D2;text-decoration-line: none;" href="https://vertx.io/docs/apidocs/io/vertx/core/http/HttpServerOptions.html">
									{{ $t('Extensions config docs') }}
								</a>
							</div>
							<div style="margin-left: auto;">
								<el-button type="primary" size="medium" @click="addExtensions()">{{ $t('Add') }}</el-button>
							</div>
						</div>
						<el-row :gutter="10" v-for="(c, idx) in serverData.extensions" :key="idx">
							<el-col :sm="10" :xs="24" style="margin-top: 5px;"><el-input :placeholder="$t('Please enter key')" v-model="c.key"></el-input></el-col>
							<el-col :sm="10" :xs="24" style="margin-top: 5px;"><el-input :placeholder="$t('Please enter value')" v-model="c.value"></el-input></el-col>
							<el-col :sm="4" :xs="24" style="margin-top: 5px;">
								<el-button size="medium" type="danger" @click="removeExtensions(idx)">{{ $t('Remove') }}</el-button>
							</el-col>
						</el-row>
					</template>
				</el-form-item>
			</el-form>
		</Panel>
		<Panel
			style="margin-top: 5px;"
			:title="$t('Cross Origin Resource Sharing(CORS)')"
			:switchShow="true"
			v-bind:switched.sync="corsData.isCORS"
			:openText="$t('On')"
			:closeText="$t('Off')"
		>
			<el-form v-show="corsData.isCORS" ref="basicFrom" :label-position="labelPosition" label-width="150px" :model="corsData" :rules="basicRules">
				<el-form-item label="Allowed Origin" prop="allowedOrigin">
					<template>
						<div>
							<span style="color: #606266;">{{ $t('tips: input the (*) Allow all, input the (http://mirrentools.org) Allow http://mirrentools.org') }}</span>
							<a target="_blank" style="color: #1976D2;text-decoration-line: none;" href="https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html">
								{{ $t('Based on regular expression') }}
							</a>
						</div>
						<div><el-input v-model="corsData.allowedOrigin" :placeholder="$t('Allowed Origin default is *')"></el-input></div>
					</template>
				</el-form-item>
				<el-form-item label="Allow Credentials" prop="allowCredentials">
					<el-radio-group v-model="corsData.allowCredentials">
						<el-radio :label="true"></el-radio>
						<el-radio :label="false"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="Max Age Seconds" prop="maxAgeSeconds">
					<el-input v-model="corsData.maxAgeSeconds" :placeholder="$t('Please enter how long the browser should cache the information, in seconds')"></el-input>
				</el-form-item>
				<el-form-item label="Allowed Headers" prop="allowedHeaders">
					<el-input v-model="corsData.allowedHeaders" :placeholder="$t('Please enter an allowed header separated by [,]')"></el-input>
				</el-form-item>
				<el-form-item label="Exposed Headers" prop="exposedHeaders">
					<el-input v-model="corsData.exposedHeaders" :placeholder="$t('Please enter an exposed header separated by [,]')"></el-input>
				</el-form-item>
				<el-form-item label="Allowed Methods" prop="allowedMethods">
					<el-checkbox-group v-model="corsData.allowedMethods">
						<el-checkbox v-for="(method, index) in corsData.methods" :key="index" :label="method" name="allowedMethods"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</Panel>
		<Panel style="margin-top: 5px;" :title="$t('Error hander')">
			<el-table :data="errorData" border style="width: 100%">
				<el-table-column prop="id" :label="$t('Error type')"></el-table-column>
				<el-table-column prop="code" :label="$t('Status code')">
					<template slot-scope="scope">
						<el-input v-model="scope.row.code"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="msg" :label="$t('Status msg')">
					<template slot-scope="scope">
						<el-input v-model="scope.row.msg"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="type" :label="$t('Response type')">
					<template slot-scope="scope">
						<el-input v-model="scope.row.type"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="data" :label="$t('Response data')">
					<template slot-scope="scope">
						<el-input v-model="scope.row.data"></el-input>
					</template>
				</el-table-column>
			</el-table>
		</Panel>
		<Panel style="margin-top: 5px;" :title="$t('Server listener')">
			<!-- 请求到达服务器监听器 -->
			<el-form ref="listenerFrom" :label-position="labelPosition" label-width="150px">
				<el-form-item :label="$t('Request arrival listener')">
					<template>
						<div>
							<el-select v-model="requestArrivalIds" :placeholder="$t('Select request arrival at the server listener')" multiple clearable style="width: 100%;">
								<el-option v-for="listeners in requestArrivalListeners" :key="listeners.id" :label="listeners.name" :value="listeners.id"></el-option>
							</el-select>
							<div v-if="requestArrivalListener">
								<div v-for="listener in requestArrivalListener" :key="listener.id">
									<div>{{ listener.describe }}</div>
									<el-form label-position="left" label-width="20vh" v-if="listener.config">
										<el-form-item v-for="(config, idx) in listener.config" :key="idx" :label="config.key">
											<el-input v-model="config.value" :placeholder="config.describe"></el-input>
										</el-form-item>
									</el-form>
								</div>
							</div>
						</div>
					</template>
				</el-form-item>
			</el-form>
			<!-- 服务器启动监听器 -->
			<el-form ref="listenerFrom" :label-position="labelPosition" label-width="150px">
				<el-form-item :label="$t('Server start listener')">
					<template>
						<div>
							<el-select v-model="startIds" :placeholder="$t('Select server start listener')" multiple clearable style="width: 100%;">
								<el-option v-for="listeners in startListeners" :key="listeners.id" :label="listeners.name" :value="listeners.id"></el-option>
							</el-select>
							<div v-if="startListener">
								<div v-for="listener in startListener" :key="listener.id">
									<div>{{ listener.describe }}</div>
									<el-form label-position="left" label-width="20vh" v-if="listener.config">
										<el-form-item v-for="(config, idx) in listener.config" :key="idx" :label="config.key">
											<el-input v-model="config.value" :placeholder="config.describe"></el-input>
										</el-form-item>
									</el-form>
								</div>
							</div>
						</div>
					</template>
				</el-form-item>
			</el-form>
			<!-- 服务器关闭监听器 -->
			<el-form ref="listenerFrom" :label-position="labelPosition" label-width="150px">
				<el-form-item :label="$t('Server stop listener')">
					<template>
						<div>
							<el-select v-model="stopIds" :placeholder="$t('Select server stop listener')" multiple clearable style="width: 100%;">
								<el-option v-for="listeners in stopListeners" :key="listeners.id" :label="listeners.name" :value="listeners.id"></el-option>
							</el-select>
							<div v-if="stopListener">
								<div v-for="listener in stopListener" :key="listener.id">
									<div>{{ listener.describe }}</div>
									<el-form label-position="left" label-width="20vh" v-if="listener.config">
										<el-form-item v-for="(config, idx) in listener.config" :key="idx" :label="config.key">
											<el-input v-model="config.value" :placeholder="config.describe"></el-input>
										</el-form-item>
									</el-form>
								</div>
							</div>
						</div>
					</template>
				</el-form-item>
			</el-form>
		</Panel>
		<div style="text-align: center;padding: 20px;">
			<el-button type="success" @click="submit">{{ $t('Submit') }}</el-button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Panel from '../components/Panel.vue';
export default {
	components: {
		Panel
	},
	data() {
		return {
			/**基本信息*/
			basicData: {
				id: '',
				token: '',
				name: '',
				describe: ''
			},
			/**基本信息的认证*/
			basicRules: {
				name: [{ required: true, message: this.$t('Application name can not be empty'), trigger: 'blur' }],
				describe: [{ required: true, message: this.$t('Application describe can not be empty'), trigger: 'blur' }]
			},
			/**服务器信息*/
			serverData: {
				ishttp: true,
				httpPort: 80,
				ishttps: false,
				httpsPort: 443,
				certs: [],
				bodyLength: null,
				extensions: []
			},
			/**跨域信息*/
			corsData: {
				isCORS: false,
				allowedOrigin: null,
				allowCredentials: false,
				maxAgeSeconds: null,
				allowedHeaders: null,
				exposedHeaders: null,
				allowedMethods: ['GET', 'POST'],
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT', 'PATCH', 'PATCH']
			},
			/**异常信息*/
			errorData: [
				{ id: 'NOT_FOUND', code: '404', msg: 'Not Found', type: 'text/html', data: 'Not Found' },
				{ id: 'FORBIDDEN', code: '403', msg: 'Forbidden', type: 'text/html', data: 'Forbidden' },
				{ id: 'BAD_REQUEST', code: '400', msg: 'Bad Request', type: 'text/html', data: 'Bad Request' },
				{ id: 'ACCESS_LIMIT', code: '403', msg: 'API Access Limitations', type: 'text/html', data: 'API Access Limitations' },
				{ id: 'BAD_GATEWAY', code: '502', msg: 'Bad Gateway', type: 'text/html', data: 'Bad Gateway' },
				{ id: 'FAILURE', code: '500', msg: 'Internal Server Error', type: 'text/html', data: 'Internal Server Error' }
			],
			/**
			 * 所有的插件或监听器规则都为:
			 * id(String):插件的id,通常是插件或监听器的className可以用去实例化的类
			 * name(String):名称
			 * describe(String):描述
			 * config(Array(Object)):配置信息
			 *  key(String):配置的id
			 *  value(String):配置的指,统一为String,由后台自己转换
			 *  def(String):配置的默认值,统一为String,由后台自己处理当value==null的时候填充
			 *  describe(String):配置的描述信息
			 * */
			/**要使用的会话管理器*/
			sessionManager: null,
			/**会话插件集合*/
			sessionManagerPlugins: [
				{
					id: 'package.name',
					name: 'Default Local Session Manager',
					describe: 'Default Local Session Manager',
					config: [
						{ key: 'Session name', value: null, def: 'orion-api-getway.sessions', describe: 'this is the decsribe' },
						{ key: 'Session timeout', value: null, def: '1800000', describe: 'Set the session timeout the timeout, in ms.' }
					]
				}
			],
			/**要使用请求到达的监听器*/
			requestArrivalListener: [],
			/**已选择的请求到达监听器*/
			requestArrivalIds: [],
			/**请求到达监听器集合*/
			requestArrivalListeners: [],
			/**要使用请求到达的监听器*/
			requestArrivalListener: [],

			/**要使用服务器启动监听器*/
			startListener: [],
			/**已选择的服务器启动监听器*/
			startIds: [],
			/**服务器启动监听器集合*/
			startListeners: [],

			/**要使用服务器关闭监听器*/
			stopListener: [],
			/**已选择的服务器关闭监听器*/
			stopIds: [],
			/**服务器关闭监听器集合*/
			stopListeners: []
		};
	},
	methods: {
		/**
		 * 添加证书
		 */
		addPem() {
			this.serverData.certs.push({ key: '', value: '' });
		},
		/**
		 * 删除证书中指定的元素
		 * @param {Object} index 证书集中的下标
		 */
		removePem(index) {
			this.$confirm(this.$t('Are you sure to remove'), this.$t('Tips'), {
				confirmButtonText: this.$t('Confirm'),
				cancelButtonText: this.$t('Cancel'),
				type: 'error'
			})
				.then(() => {
					this.serverData.certs.splice(index, 1);
				})
				.catch(() => {});
		},
		/**
		 * 添加拓展配置
		 */
		addExtensions() {
			this.serverData.extensions.push({ key: '', value: '' });
		},
		/**
		 * 删除拓展配置中指定的元素
		 * @param {Object} index 拓展配置集中的下标
		 */
		removeExtensions(index) {
			this.$confirm(this.$t('Are you sure to remove'), this.$t('Tips'), {
				confirmButtonText: this.$t('Confirm'),
				cancelButtonText: this.$t('Cancel'),
				type: 'error'
			})
				.then(() => {
					this.serverData.extensions.splice(index, 1);
				})
				.catch(() => {});
		},
		submit() {
			this.$refs['basicFrom'].validate(valid => {
				if (valid) {
					alert('submit!');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		}
	},
	computed: {
		...mapGetters(['device']),
		labelPosition() {
			return this.device == 'mobile' ? 'top' : 'right';
		}
	},
	watch: {
		/**已选择的监听器改变事件*/
		requestArrivalIds(val) {
			if (val.length == 0) {
				this.requestArrivalListener = [];
			} else {
				var items = [];
				for (var i = 0; i < val.length; i++) {
					var id = val[i];
					var oldVal = this.requestArrivalListener.find(o => {
						return id === o.id;
					});
					if (oldVal) {
						items.push(oldVal);
					} else {
						var newVal = this.requestArrivalListeners.find(o => {
							return id === o.id;
						});
						if (newVal) {
							items.push(newVal);
						}
					}
				}
				this.requestArrivalListener = items;
			}
		},
		/**已选择的监听器改变事件*/
		startIds(val) {
			if (val.length == 0) {
				this.startListener = [];
			} else {
				var items = [];
				for (var i = 0; i < val.length; i++) {
					var id = val[i];
					var oldVal = this.startListener.find(o => {
						return id === o.id;
					});
					if (oldVal) {
						items.push(oldVal);
					} else {
						var newVal = this.startListeners.find(o => {
							return id === o.id;
						});
						if (newVal) {
							items.push(newVal);
						}
					}
				}
				this.startListener = items;
			}
		},
		/**已选择的监听器改变事件*/
		stopIds(val) {
			if (val.length == 0) {
				this.stopListener = [];
			} else {
				var items = [];
				for (var i = 0; i < val.length; i++) {
					var id = val[i];
					var oldVal = this.stopListener.find(o => {
						return id === o.id;
					});
					if (oldVal) {
						items.push(oldVal);
					} else {
						var newVal = this.stopListeners.find(o => {
							return id === o.id;
						});
						if (newVal) {
							items.push(newVal);
						}
					}
				}
				this.stopListener = items;
			}
		}
	}
};
</script>

<style></style>
